// ==UserScript==
// @name         GitHub 功能增强版
// @namespace    https://github.com/
// @version      6.0.5
// @author       Mr.Eric
// @description  GitHub 下载 ZIP / Raw 链接，自动获取所有分支选择下载，添加文件编辑和保存功能。
// @match        https://github.com/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_notification
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @require      https://cdn.jsdelivr.net/npm/crypto-js@4.2.0/crypto-js.min.js
// @require      https://cdn.jsdelivr.net/npm/core-js-bundle@3.38.1/minified.js
// @require      https://cdn.jsdelivr.net/npm/regenerator-runtime@0.14.1/runtime.min.js
// @require      https://cdn.jsdelivr.net/npm/whatwg-fetch@3.6.20/dist/fetch.umd.min.js
// @require      https://cdn.jsdelivr.net/npm/abortcontroller-polyfill@1.7.5/dist/abortcontroller-polyfill-only.min.js
// @require      https://cdn.jsdelivr.net/npm/mutationobserver-shim@0.3.7/dist/mutationobserver.min.js
// @require      https://cdn.jsdelivr.net/npm/intersection-observer@0.12.2/intersection-observer.js
// @require      https://cdn.jsdelivr.net/npm/resize-observer-polyfill@1.5.1/dist/ResizeObserver.global.min.js
// @require      https://cdn.jsdelivr.net/npm/url-polyfill@1.1.12/url-polyfill.min.js
// @require      https://cdn.jsdelivr.net/npm/details-element-polyfill@3.0.2/dist/details-element-polyfill.js
// @require      https://cdn.jsdelivr.net/npm/web-animations-js@2.3.2/web-animations.min.js
// ==/UserScript==

(function () {
  'use strict';

  // 配置常量
  const STORAGE_KEYS = {
    GITHUB_TOKEN: 'github_pat_token',
    USER_INFO: 'github_user_info',
    FILE_HISTORY: 'github_file_history',
    USER_SETTINGS: 'github_user_settings',
    REMEMBER_TOKEN: 'github_remember_token',
    SELECTED_BRANCH: 'github_selected_branch' // 新增：存储选择的分支
  };

  /************************
   * Repo 信息解析（修复版）
   ************************/
  function getDefaultBranch() {
    var el = document.querySelector('meta[name="octolytics-dimension-repository_default_branch"]');
    return el && el.getAttribute('content') || 'main';
  }

  function getCurrentBranchFromDOM() {
    var el = document.querySelector('button[data-hotkey="w"]') || document.querySelector('[data-view-component="true"][id^="branch"]');
    if (el) {
      var text = el.textContent.trim();
      if (text) return text;
    }
    return null;
  }

  function getRepoInfo() {
    var path = location.pathname.split('/').filter(Boolean);
    if (path.length < 2) return {};

    var owner = path[0];
    var repo = path[1];
    var branch = getDefaultBranch();
    var filePath = '';

    if (path.length === 2) {
      branch = getCurrentBranchFromDOM() || getDefaultBranch();
    } else if (path[2] === 'tree') {
      branch = path.slice(3).join('/');
    } else if (path[2] === 'blob') {
      var rest = path.slice(3);
      for (let i = rest.length; i > 0; i--) {
        branch = rest.slice(0, i).join('/');
        filePath = rest.slice(i).join('/');
        if (filePath) break;
      }
    }

    return { owner, repo, branch, filePath };
  }

  /************************
   * GitHub API 认证管理
   ************************/
  function getGitHubToken() {
    return GM_getValue(STORAGE_KEYS.GITHUB_TOKEN, '');
  }

  function setGitHubToken(token, remember = false) {
    GM_setValue(STORAGE_KEYS.GITHUB_TOKEN, token);
    GM_setValue(STORAGE_KEYS.REMEMBER_TOKEN, remember);
  }

  function clearGitHubToken() {
    GM_deleteValue(STORAGE_KEYS.GITHUB_TOKEN);
    GM_deleteValue(STORAGE_KEYS.USER_INFO);
    GM_deleteValue(STORAGE_KEYS.USER_SETTINGS);
    GM_setValue(STORAGE_KEYS.REMEMBER_TOKEN, false);
  }

  function isAuthenticated() {
    const token = getGitHubToken();
    const remember = GM_getValue(STORAGE_KEYS.REMEMBER_TOKEN, false);
    return !!token && remember;
  }

  function getAuthHeaders() {
    const token = getGitHubToken();
    return {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    };
  }

  async function verifyToken(token) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒超时

      const response = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const userData = await response.json();
        GM_setValue(STORAGE_KEYS.USER_INFO, userData);
        return { success: true, user: userData };
      } else {
        return { success: false, error: `Token验证失败: ${response.status} ${response.statusText}` };
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        return { success: false, error: 'Token验证超时，请检查网络连接' };
      }
      return { success: false, error: error.message };
    }
  }

  function createAuthDialog() {
    const dialogId = '__gh_auth_dialog__';
    if (document.getElementById(dialogId)) return;

    const dialog = document.createElement('div');
    dialog.id = dialogId;
    dialog.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 400px;
      background: white;
      z-index: 2147483647;
      border: 1px solid #ccc;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
      border-radius: 8px;
      padding: 20px;
      display: none;
    `;

    const title = document.createElement('h3');
    title.textContent = 'GitHub 认证';
    title.style.marginTop = '0';

    const desc = document.createElement('p');
    desc.innerHTML = '需要GitHub Personal Access Token来保存文件修改。<br>'
      + '1. 前往 <a href="https://github.com/settings/tokens" target="_blank">GitHub Tokens</a><br>'
      + '2. 生成新Token (需要 repo 权限)';

    const input = document.createElement('input');
    input.type = 'password';
    input.placeholder = '输入GitHub Personal Access Token';
    input.style.cssText = `
      width: 100%;
      padding: 8px;
      margin: 10px 0;
      border: 1px solid #ddd;
      border-radius: 4px;
      box-sizing: border-box;
    `;

    // 记住我复选框
    const rememberContainer = document.createElement('div');
    rememberContainer.style.cssText = `
      display: flex;
      align-items: center;
      margin: 10px 0;
    `;

    const rememberCheckbox = document.createElement('input');
    rememberCheckbox.type = 'checkbox';
    rememberCheckbox.id = '__gh_remember_me__';
    rememberCheckbox.checked = GM_getValue(STORAGE_KEYS.REMEMBER_TOKEN, true);

    const rememberLabel = document.createElement('label');
    rememberLabel.htmlFor = '__gh_remember_me__';
    rememberLabel.textContent = '记住我';
    rememberLabel.style.marginLeft = '8px';
    rememberLabel.style.cursor = 'pointer';

    rememberContainer.appendChild(rememberCheckbox);
    rememberContainer.appendChild(rememberLabel);

    const buttonGroup = document.createElement('div');
    buttonGroup.style.cssText = `
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 15px;
    `;

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = '取消';
    cancelBtn.onclick = () => hideAuthDialog();

    const submitBtn = document.createElement('button');
    submitBtn.textContent = '验证';
    submitBtn.style.background = '#2ea44f';
    submitBtn.style.color = 'white';
    submitBtn.onclick = async () => {
      const token = input.value.trim();
      if (!token) {
        alert('请输入GitHub Token');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = '验证中...';

      const result = await verifyToken(token);
      if (result.success) {
        const remember = rememberCheckbox.checked;
        setGitHubToken(token, remember);
        hideAuthDialog();
        GM_notification({
          title: '认证成功',
          text: `已登录为: ${result.user.login}`,
          timeout: 3000
        });
        updateUIWithAuthStatus();
      } else {
        alert(`认证失败: ${result.error}`);
        submitBtn.disabled = false;
        submitBtn.textContent = '验证';
      }
    };

    buttonGroup.appendChild(cancelBtn);
    buttonGroup.appendChild(submitBtn);

    dialog.appendChild(title);
    dialog.appendChild(desc);
    dialog.appendChild(input);
    dialog.appendChild(rememberContainer);
    dialog.appendChild(buttonGroup);

    document.documentElement.appendChild(dialog);
    return dialog;
  }

  function showAuthDialog() {
    const dialog = document.getElementById('__gh_auth_dialog__') || createAuthDialog();
    dialog.style.display = 'block';
    
    // 自动填充已保存的token（如果不记住则不清除）
    const input = dialog.querySelector('input[type="password"]');
    const rememberCheckbox = dialog.querySelector('#__gh_remember_me__');
    const remember = GM_getValue(STORAGE_KEYS.REMEMBER_TOKEN, false);
    const savedToken = GM_getValue(STORAGE_KEYS.GITHUB_TOKEN, '');
    
    if (remember && savedToken) {
      input.value = savedToken;
    }
    rememberCheckbox.checked = remember;
  }

  function hideAuthDialog() {
    const dialog = document.getElementById('__gh_auth_dialog__');
    if (dialog) dialog.style.display = 'none';
  }

  /************************
   * 工具函数
   ************************/
  function makeLink(href, text) {
    var el = document.createElement('a');
    el.href = href;
    el.textContent = text;
    el.style.display = 'inline-block';
    el.style.margin = '6px 8px 0 0';
    el.style.textDecoration = 'underline';
    el.target = '_blank';
    return el;
  }

  function makeBtn(text, onclick, title = '') {
    var btn = document.createElement('button');
    btn.textContent = text;
    btn.title = title;
    btn.style.margin = '6px 8px 0 0';
    btn.style.padding = '2px 6px';
    btn.style.fontSize = '12px';
    btn.addEventListener('click', onclick);
    return btn;
  }

  function downloadViaGM(url, suggestedName) {
    GM_xmlhttpRequest({
      method: 'GET',
      url: url,
      responseType: 'blob',
      onload: function(response) {
        try {
          var blob = response.response;
          var a = document.createElement('a');
          var objectUrl = URL.createObjectURL(blob);
          a.href = objectUrl;
          a.download = (suggestedName && suggestedName.split('/').pop()) || 'download';
          document.body.appendChild(a);
          a.click();
          setTimeout(() => { 
            URL.revokeObjectURL(objectUrl); 
            a.remove(); 
          }, 3000);
        } catch (e) {
          window.open(url, '_blank');
        }
      },
      onerror: function(err) {
        console.error('下载失败:', err);
        window.open(url, '_blank');
      }
    });
  }

  function saveFileLocally(content, filename) {
    try {
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        URL.revokeObjectURL(url);
        a.remove();
      }, 100);
      
      // 保存历史记录
      const history = GM_getValue(STORAGE_KEYS.FILE_HISTORY, []);
      history.unshift({
        filename: filename,
        content: content.substring(0, 200) + (content.length > 200 ? '...' : ''),
        timestamp: new Date().toISOString(),
        size: content.length
      });
      
      // 只保留最近10条记录
      GM_setValue(STORAGE_KEYS.FILE_HISTORY, history.slice(0, 10));
      
      return true;
    } catch (error) {
      console.error('本地保存失败:', error);
      return false;
    }
  }

  /************************
   * 获取仓库所有分支
   ************************/
  async function fetchAllBranches(owner, repo) {
    try {
      var apiUrl = `https://api.github.com/repos/${owner}/${repo}/branches?per_page=100`;
      var res = await fetch(apiUrl, { 
        credentials: 'omit',
        headers: isAuthenticated() ? getAuthHeaders() : {}
      });
      if (!res.ok) throw new Error(res.status + ' ' + res.statusText);
      var data = await res.json();
      return data.map(b => b.name);
    } catch (e) {
      console.warn('获取分支失败:', e);
      return [];
    }
  }

  /************************
   * 文件编辑器功能
   ************************/
  function createEditor() {
    const editorId = '__gh_editor_modal__';
    if (document.getElementById(editorId)) return;
    
    const modal = document.createElement('div');
    modal.id = editorId;
    modal.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 80%;
      height: 80%;
      background: white;
      z-index: 2147483647;
      border: 1px solid #ccc;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
      display: none;
      flex-direction: column;
      border-radius: 8px;
      overflow: hidden;
    `;
    
    const header = document.createElement('div');
    header.style.cssText = `
      padding: 10px;
      background: #f6f8fa;
      border-bottom: 1px solid #d0d7de;
      display: flex;
      justify-content: space-between;
      align-items: center;
    `;
    
    const title = document.createElement('span');
    title.id = '__gh_editor_title__';
    title.textContent = 'GitHub 文件编辑器';
    title.style.fontWeight = 'bold';
    
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '×';
    closeBtn.style.cssText = `
      background: none;
      border: none;
      font-size: 20px;
      cursor: pointer;
      padding: 0;
      width: 24px;
      height: 24px;
    `;
    closeBtn.onclick = () => hideEditor();
    
    header.appendChild(title);
    header.appendChild(closeBtn);
    
    const editorArea = document.createElement('textarea');
    editorArea.id = '__gh_editor_textarea__';
    editorArea.style.cssText = `
      flex: 1;
      padding: 12px;
      border: none;
      resize: none;
      font-family: monospace;
      font-size: 14px;
    `;
    
    const footer = document.createElement('div');
    footer.style.cssText = `
      padding: 10px;
      background: 'none';
      border-top: 1px solid #d0d7de;
      display: flex;
      justify-content: space-between;
      align-items: center;
    `;
    
    const status = document.createElement('div');
    status.id = '__gh_editor_status__';
    status.style.fontSize = '12px';
    status.style.color = '#586069';
    
    const buttonGroup = document.createElement('div');
    buttonGroup.style.display = 'flex';
    buttonGroup.style.gap = '8px';
    
    const saveLocalBtn = makeBtn('💾 保存到本地', () => saveFileLocally(), '保存文件到本地设备');
    const saveGithubBtn = makeBtn('🚀 保存到GitHub', () => saveFileToGitHub(), '保存文件到GitHub仓库');
    const cancelBtn = makeBtn('取消', () => hideEditor(), '关闭编辑器');
    
    saveGithubBtn.style.background = '#2ea44f';
    saveGithubBtn.style.color = 'white';
    
    buttonGroup.appendChild(saveLocalBtn);
    buttonGroup.appendChild(saveGithubBtn);
    buttonGroup.appendChild(cancelBtn);
    
    footer.appendChild(status);
    footer.appendChild(buttonGroup);
    
    modal.appendChild(header);
    modal.appendChild(editorArea);
    modal.appendChild(footer);
    
    document.documentElement.appendChild(modal);
    
    // 添加ESC键关闭功能
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal.style.display === 'flex') {
        hideEditor();
      }
    });
    
    // 监听内容变化更新状态
    editorArea.addEventListener('input', function() {
      updateEditorStatus();
    });
  }
  
  function showEditor(content, filename) {
    const modal = document.getElementById('__gh_editor_modal__');
    const textarea = document.getElementById('__gh_editor_textarea__');
    const title = document.getElementById('__gh_editor_title__');
    
    if (!modal || !textarea || !title) return;
    
    title.textContent = `编辑: ${filename}`;
    textarea.value = content;
    modal.style.display = 'flex';
    textarea.focus();
    
    // 更新状态
    updateEditorStatus();
  }
  
  function updateEditorStatus() {
    const textarea = document.getElementById('__gh_editor_textarea__');
    const status = document.getElementById('__gh_editor_status__');
    
    if (!textarea || !status) return;
    
    const content = textarea.value;
    const lineCount = content.split('\n').length;
    const charCount = content.length;
    const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
    
    status.textContent = `行数: ${lineCount} | 字符: ${charCount} | 单词: ${wordCount}`;
  }
  
  function hideEditor() {
    const modal = document.getElementById('__gh_editor_modal__');
    if (modal) modal.style.display = 'none';
  }
  
  async function loadFileForEditing() {
    const info = getRepoInfo();
    if (!info.filePath) {
      alert('当前页面不是文件页面');
      return;
    }
    
    try {
      const rawUrl = `https://raw.githubusercontent.com/${info.owner}/${info.repo}/${info.branch}/${info.filePath}`;
      const response = await fetch(rawUrl);
      if (!response.ok) throw new Error('无法加载文件: ' + response.status);
      
      const content = await response.text();
      showEditor(content, info.filePath.split('/').pop());
    } catch (error) {
      console.error('加载文件失败:', error);
      alert('加载文件失败: ' + error.message);
    }
  }
  
  async function saveFileToGitHub() {
    const info = getRepoInfo();
    const textarea = document.getElementById('__gh_editor_textarea__');
    
    if (!info.filePath || !textarea) return;
    
    // 检查认证
    if (!isAuthenticated()) {
      alert('请先进行GitHub认证才能保存文件');
      showAuthDialog();
      return;
    }
    
    const newContent = textarea.value;
    const filename = info.filePath.split('/').pop();
    
    try {
      // 1. 获取文件SHA（用于更新现有文件）
      let sha = null;
      try {
        const fileInfoUrl = `https://api.github.com/repos/${info.owner}/${info.repo}/contents/${info.filePath}?ref=${info.branch}`;
        const fileInfoResponse = await fetch(fileInfoUrl, {
          headers: getAuthHeaders()
        });
        
        if (fileInfoResponse.ok) {
          const fileInfo = await fileInfoResponse.json();
          sha = fileInfo.sha;
        }
      } catch (e) {
        // 文件可能不存在，这是正常的
        console.log('获取文件SHA失败（可能是新文件）:', e);
      }
      
      // 2. 提交到GitHub
      const commitUrl = `https://api.github.com/repos/${info.owner}/${info.repo}/contents/${info.filePath}`;
      const commitData = {
        message: `Update ${filename} via GitHub Editor`,
        content: btoa(unescape(encodeURIComponent(newContent))),
        branch: info.branch
      };
      
      if (sha) {
        commitData.sha = sha;
      }
      
      const commitResponse = await fetch(commitUrl, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(commitData)
      });
      
      if (commitResponse.ok) {
        const result = await commitResponse.json();
        GM_notification({
          title: '保存成功',
          text: `文件已保存到GitHub`,
          timeout: 3000
        });
        
        // 刷新页面以显示更改
        setTimeout(() => {
          location.reload();
        }, 1000);
        
        hideEditor();
      } else {
        const error = await commitResponse.text();
        throw new Error(`GitHub API错误: ${commitResponse.status} - ${error}`);
      }
    } catch (error) {
      console.error('保存到GitHub失败:', error);
      alert('保存到GitHub失败: ' + error.message);
    }
  }
  
  function saveFileLocally() {
    const info = getRepoInfo();
    const textarea = document.getElementById('__gh_editor_textarea__');
    
    if (!info.filePath || !textarea) return;
    
    const content = textarea.value;
    const filename = info.filePath.split('/').pop();
    
    if (saveFileLocally(content, filename)) {
      GM_notification({
        title: '保存成功',
        text: `文件已保存到本地`,
        timeout: 2000
      });
    } else {
      alert('保存到本地失败');
    }
  }

  /************************
   * GitHub 设置功能
   ************************/
  async function fetchUserGists() {
    try {
      const response = await fetch('https://api.github.com/gists', {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          // Token失效，清除认证状态
          clearGitHubToken();
          updateUIWithAuthStatus();
          throw new Error('Token已失效，请重新认证');
        }
        throw new Error('获取Gists失败: ' + response.status);
      }
      
      const gists = await response.json();
      return gists;
    } catch (error) {
      console.error('获取Gists失败:', error);
      throw error;
    }
  }

  function createGistsPanel() {
    const panelId = '__gh_gists_panel__';
    if (document.getElementById(panelId)) return;
    
    const panel = document.createElement('div');
    panel.id = panelId;
    panel.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 70%;
      height: 70%;
      background: white;
      z-index: 2147483646;
      border: 1px solid #ccc;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
      display: none;
      flex-direction: column;
      border-radius: 8px;
      overflow: hidden;
    `;
    
    const header = document.createElement('div');
    header.style.cssText = `
      padding: 10px;
      background: #f6f8fa;
      border-bottom: 1px solid #d0d7de;
      display: flex;
      justify-content: space-between;
      align-items: center;
    `;
    
    const title = document.createElement('span');
    title.textContent = 'Your Gists';
    title.style.fontWeight = 'bold';
    
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '×';
    closeBtn.style.cssText = `
      background: none;
      border: none;
      font-size: 20px;
      cursor: pointer;
      padding: 0;
      width: 24px;
      height: 24px;
    `;
    closeBtn.onclick = () => hideGistsPanel();
    
    header.appendChild(title);
    header.appendChild(closeBtn);
    
    const content = document.createElement('div');
    content.id = '__gh_gists_content__';
    content.style.cssText = `
      flex: 1;
      padding: 12px;
      overflow-y: auto;
    `;
    
    const footer = document.createElement('div');
    footer.style.cssText = `
      padding: 10px;
      background: #f6f8fa;
      border-top: 1px solid #d0d7de;
      display: flex;
      justify-content: flex-end;
    `;
    
    const newGistBtn = makeBtn('新建 Gist', () => {
      window.open('https://gist.github.com', '_blank');
    });
    
    footer.appendChild(newGistBtn);
    
    panel.appendChild(header);
    panel.appendChild(content);
    panel.appendChild(footer);
    
    document.documentElement.appendChild(panel);
    return panel;
  }

  function showGistsPanel() {
    const panel = document.getElementById('__gh_gists_panel__') || createGistsPanel();
    panel.style.display = 'flex';
    
    // 加载Gists
    loadUserGists();
  }

  function hideGistsPanel() {
    const panel = document.getElementById('__gh_gists_panel__');
    if (panel) panel.style.display = 'none';
  }

  async function loadUserGists() {
    const content = document.getElementById('__gh_gists_content__');
    if (!content) return;
    
    content.innerHTML = '<div style="text-align: center; padding: 20px;">加载中...</div>';
    
    try {
      const gists = await fetchUserGists();
      
      if (gists.length === 0) {
        content.innerHTML = '<div style="text-align: center; padding: 20px;">没有找到Gists</div>';
        return;
      }
      
      let html = '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 12px;">';
      
      gists.forEach(gist => {
        const filename = Object.keys(gist.files)[0];
        const description = gist.description || '无描述';
        const isPublic = gist.public;
        const createdAt = new Date(gist.created_at).toLocaleDateString();
        
        html += `
          <div style="border: 1px solid #e1e4e8; border-radius: 6px; padding: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <span style="font-weight: 500;">${filename}</span>
              <span style="font-size: 12px; color: ${isPublic ? '#0366d6' : '#6a737d'};">
                ${isPublic ? '公开' : '私有'}
              </span>
            </div>
            <div style="font-size: 13px; color: 'none'; margin-bottom: 8px;">${description}</div>
            <div style="font-size: 11px; color: #6a737d; margin-bottom: 12px;">创建于: ${createdAt}</div>
            <div style="display: flex; gap: 8px;">
              <a href="${gist.html_url}" target="_blank" style="font-size: 12px; color: #0366d6; text-decoration: none;">查看</a>
              <a href="${gist.html_url}/raw" target="_blank" style="font-size: 12px; color: #0366d6; text-decoration: none;">Raw</a>
            </div>
          </div>
        `;
      });
      
      html += '</div>';
      content.innerHTML = html;
    } catch (error) {
      console.error('加载Gists失败:', error);
      content.innerHTML = `
        <div style="text-align: center; padding: 20px; color: #cb2431;">
          <p>加载Gists失败: ${error.message}</p>
          <button onclick="showAuthDialog()" style="margin-top: 10px; padding: 5px 10px; background: #2ea44f; color: white; border: none; border-radius: 4px; cursor: pointer;">
            重新认证
          </button>
        </div>
      `;
    }
  }

  function openGitHubSettings() {
    window.open('https://github.com/settings/profile', '_blank');
  }

  /************************
   * Rescue 功能面板 - 修复自动关闭问题并添加分支保存功能
   ************************/
  async function buildRescueLinks() {
    var wrap = document.createElement('div');
    var info = getRepoInfo();
    var owner = info.owner, repo = info.repo, branch = info.branch, filePath = info.filePath;

    if (!owner || !repo) {
      wrap.textContent = '当前不是仓库页。';
      return wrap;
    }

    // 认证状态显示
    const authStatus = document.createElement('div');
    authStatus.style.marginBottom = '10px';
    authStatus.style.padding = '5px';
    authStatus.style.borderBottom = '1px solid #eee';
    
    if (isAuthenticated()) {
      const userInfo = GM_getValue(STORAGE_KEYS.USER_INFO, {});
      authStatus.innerHTML = `✅ 已认证: <strong>${userInfo.login || 'GitHub用户'}</strong> | 
        <a href="#" id="__gh_logout__" style="color: #0366d6; text-decoration: underline;">退出</a>`;
    } else {
      authStatus.innerHTML = `❌ 未认证 | 
        <a href="#" id="__gh_login__" style="color: #0366d6; text-decoration: underline;">登录GitHub</a>`;
    }
    
    wrap.appendChild(authStatus);

    // 添加常用链接
    wrap.appendChild(makeLink('/' + owner + '/' + repo + '/issues', 'Issues'));
    wrap.appendChild(makeLink('/' + owner + '/' + repo + '/pulls', 'Pull Requests'));
    wrap.appendChild(makeLink('/' + owner + '/' + repo + '/releases', 'Releases'));
    wrap.appendChild(makeLink('/' + owner + '/' + repo + '/actions', 'Actions'));

    // 分支选择下拉菜单 - 增强：添加打开分支链接功能
    var branches = await fetchAllBranches(owner, repo);
    if (branches.length > 0) {
      var selectWrap = document.createElement('div');
      selectWrap.style.margin = '10px 0';
      
      var selectLabel = document.createElement('span');
      selectLabel.textContent = '选择分支: ';
      selectLabel.style.marginRight = '5px';
      
      var select = document.createElement('select');
      select.id = '__gh_branch_select__';
      select.style.marginRight = '8px';
      select.style.fontSize = '12px';
      select.style.padding = '2px';
      
      // 获取保存的分支选择
      const savedBranch = GM_getValue(STORAGE_KEYS.SELECTED_BRANCH, branch);
      
      branches.forEach(b => {
        var option = document.createElement('option');
        option.value = b;
        option.textContent = b;
        if (b === savedBranch) option.selected = true;
        select.appendChild(option);
      });
      
      // 添加分支选择变化事件
      select.addEventListener('change', function() {
        GM_setValue(STORAGE_KEYS.SELECTED_BRANCH, this.value);
      });
      
      selectWrap.appendChild(selectLabel);
      selectWrap.appendChild(select);

      var zipBtn = makeBtn('⬇️ Download ZIP', () => {
        var chosenBranch = select.value;
        var zipUrl = `https://codeload.github.com/${owner}/${repo}/zip/refs/heads/${chosenBranch}`;
        downloadViaGM(zipUrl, `${repo}-${chosenBranch}.zip`);
      }, '下载选中分支的ZIP文件');

      // 新增：打开分支链接按钮
      var openBranchBtn = makeBtn('🌐 打开分支', () => {
        var chosenBranch = select.value;
        var branchUrl = `https://github.com/${owner}/${repo}/tree/${chosenBranch}`;
        window.open(branchUrl, '_blank');
      }, '在新标签页中打开选中的分支');
      
      selectWrap.appendChild(zipBtn);
      selectWrap.appendChild(openBranchBtn);
      wrap.appendChild(selectWrap);
    }

    // 文件操作区域
    if (filePath) {
      var fileSection = document.createElement('div');
      fileSection.style.margin = '10px 0';
      fileSection.style.padding = '10px';
      fileSection.style.borderTop = '1px solid #eee';
      
      var fileTitle = document.createElement('div');
      fileTitle.textContent = '当前文件:';
      fileTitle.style.fontWeight = 'bold';
      fileTitle.style.marginBottom = '5px';
      
      var fileName = document.createElement('div');
      fileName.textContent = filePath;
      fileName.style.fontFamily = 'monospace';
      fileName.style.fontSize = '12px';
      fileName.style.marginBottom = '10px';
      fileName.style.color = '#586069';
      
      fileSection.appendChild(fileTitle);
      fileSection.appendChild(fileName);
      
      var rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filePath}`;
      fileSection.appendChild(makeLink(rawUrl, '🌐 打开Raw文件'));
      fileSection.appendChild(makeBtn('⬇️ 下载文件', function () {
        downloadViaGM(rawUrl, filePath);
      }, '下载当前文件'));
      
      // 添加编辑按钮
      fileSection.appendChild(makeBtn('✏️ 编辑文件', function () {
        loadFileForEditing();
      }, '编辑当前文件'));
      
      wrap.appendChild(fileSection);
    }

    // GitHub 设置功能区域
    const settingsSection = document.createElement('div');
    settingsSection.style.margin = '10px 0';
    settingsSection.style.padding = '10px';
    settingsSection.style.borderTop = '1px solid #eee';
    
    const settingsTitle = document.createElement('div');
    settingsTitle.textContent = 'GitHub 设置:';
    settingsTitle.style.fontWeight = 'bold';
    settingsTitle.style.marginBottom = '8px';
    
    settingsSection.appendChild(settingsTitle);
    
    // Your Gists 按钮
    settingsSection.appendChild(makeBtn('📝 Your Gists', function () {
      if (!isAuthenticated()) {
        alert('请先进行GitHub认证才能查看Gists');
        showAuthDialog();
        return;
      }
      showGistsPanel();
    }, '查看和管理你的Gists'));
    
    // Settings 按钮
    settingsSection.appendChild(makeBtn('⚙️ Settings', function () {
      openGitHubSettings();
    }, '打开GitHub设置'));
    
    wrap.appendChild(settingsSection);

    // 添加事件监听器
    setTimeout(() => {
      const loginBtn = document.getElementById('__gh_login__');
      const logoutBtn = document.getElementById('__gh_logout__');
      
      if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
          e.preventDefault();
          showAuthDialog();
        });
      }
      
      if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
          e.preventDefault();
          clearGitHubToken();
          updateRescuePanel();
          GM_notification({
            title: '已退出登录',
            text: 'GitHub认证已清除',
            timeout: 2000
          });
        });
      }
    }, 100);

    return wrap;
  }

  function ensureRescueButtonAndPanel() {
    // 移除可能存在的旧按钮和面板
    const oldBtn = document.getElementById('__gh_rescue_btn__');
    const oldPanel = document.getElementById('__gh_rescue_panel__');
    if (oldBtn) oldBtn.remove();
    if (oldPanel) oldPanel.remove();

    var btn = document.createElement('button');
    btn.id = '__gh_rescue_btn__';
    btn.textContent = '👾 Fix GitHub';
    Object.assign(btn.style, {
      position: 'fixed', 
      right: '10px', 
      bottom: '12px', 
      zIndex: 2147483647,
      padding: '6px 10px', 
      border: '1px solid #999', 
      borderRadius: '8px',
      background: '#fff', 
      fontSize: '12px', 
      opacity: '0.7', 
      cursor: 'pointer'
    });

    var panel = document.createElement('div');
    panel.id = '__gh_rescue_panel__';
    Object.assign(panel.style, {
      position: 'fixed', 
      right: '10px', 
      bottom: '48px', 
      zIndex: 2147483647,
      padding: '10px', 
      border: '1px solid #999', 
      borderRadius: '8px',
      background: '#fff', 
      fontSize: '13px', 
      display: 'none', // 初始状态为隐藏
      maxWidth: '80vw', 
      maxHeight: '80vh', 
      overflow: 'auto',
      boxShadow: '0 6px 20px rgba(0,0,0,.15)'
    });

    // 修复：阻止面板内部点击事件冒泡
    panel.addEventListener('click', function(e) {
      e.stopPropagation();
    });

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
      if (panel.style.display === 'block') {
        updateRescuePanel();
      }
    });

    // 点击外部关闭面板 - 修复：更精确的关闭控制
    document.addEventListener('click', function(e) {
      const panel = document.getElementById('__gh_rescue_panel__');
      const btn = document.getElementById('__gh_rescue_btn__');
      
      if (panel && panel.style.display === 'block' && 
          !panel.contains(e.target) && 
          e.target !== btn) {
        panel.style.display = 'none';
      }
    });

    document.documentElement.appendChild(btn);
    document.documentElement.appendChild(panel);
    
    // 创建编辑器
    createEditor();
    // 创建认证对话框
    createAuthDialog();
    // 创建Gists面板
    createGistsPanel();
    
    console.log('GitHub Rescue 按钮和面板已初始化');
  }

  function updateUIWithAuthStatus() {
    // 更新救援面板
    updateRescuePanel();
  }

  async function updateRescuePanel() {
    var panel = document.getElementById('__gh_rescue_panel__');
    if (!panel) {
      console.log('救援面板不存在，重新初始化');
      ensureRescueButtonAndPanel();
      panel = document.getElementById('__gh_rescue_panel__');
      if (!panel) return;
    }
    
    // 只有在面板显示时才更新内容
    if (panel.style.display === 'none') {
      return;
    }
    
    // 显示加载中
    panel.innerHTML = '<div style="padding: 10px;">加载中...</div>';
    
    try {
      var content = await buildRescueLinks();
      panel.innerHTML = '';
      panel.appendChild(content);
    } catch (e) {
      console.error('更新面板失败:', e);
      panel.innerHTML = '<div style="padding: 10px; color: red;">加载失败</div>';
    }
  }

  /************************
   * 菜单命令
   ************************/
  function registerMenuCommands() {
    // 清除认证令牌
    GM_registerMenuCommand('清除GitHub认证', function() {
      clearGitHubToken();
      GM_notification({
        title: '已清除认证',
        text: 'GitHub令牌已删除',
        timeout: 2000
      });
      updateRescuePanel();
    });
    
    // 显示文件历史
    GM_registerMenuCommand('查看文件历史', function() {
      const history = GM_getValue(STORAGE_KEYS.FILE_HISTORY, []);
      if (history.length === 0) {
        alert('没有文件历史记录');
        return;
      }
      
      let message = '最近保存的文件:\n\n';
      history.forEach((item, index) => {
        message += `${index + 1}. ${item.filename} (${new Date(item.timestamp).toLocaleString()})\n`;
        message += `   内容: ${item.content}\n`;
        message += `   大小: ${item.size} 字符\n\n`;
      });
      
      alert(message);
    });
    
    // 生成新Token帮助
    GM_registerMenuCommand('生成GitHub Token', function() {
      GM_setClipboard('https://github.com/settings/tokens/new');
      window.open('https://github.com/settings/tokens/new', '_blank');
      GM_notification({
        title: '已复制链接',
        text: 'GitHub Token创建页面已复制到剪贴板',
        timeout: 2000
      });
    });
    
    // 打开Gists面板
    GM_registerMenuCommand('打开Your Gists', function() {
      if (!isAuthenticated()) {
        alert('请先进行GitHub认证才能查看Gists');
        showAuthDialog();
        return;
      }
      showGistsPanel();
    });
    
    // 打开GitHub设置
    GM_registerMenuCommand('打开GitHub设置', function() {
      openGitHubSettings();
    });

    // 新增：清除保存的分支选择
    GM_registerMenuCommand('清除分支记忆', function() {
      GM_deleteValue(STORAGE_KEYS.SELECTED_BRANCH);
      GM_notification({
        title: '已清除分支记忆',
        text: '下次将使用默认分支',
        timeout: 2000
      });
    });
  }

  /************************
   * 主初始化函数
   ************************/
  async function safeFixAll() {
    try { 
      ensureRescueButtonAndPanel(); 
    } catch (e) { 
      console.error('初始化救援按钮失败:', e);
    }
    // 不再自动调用updateRescuePanel()，避免面板自动弹出
  }

  function init() {
    console.log('GitHub Rescue 脚本开始初始化');
    
    // 检查是否已认证
    if (isAuthenticated()) {
      console.log('检测到已保存的GitHub Token，自动验证中...');
      // 自动验证token有效性
      verifyToken(getGitHubToken()).then(result => {
        if (!result.success) {
          console.log('保存的Token已失效，需要重新认证');
          GM_notification({
            title: 'Token已失效',
            text: '请重新进行GitHub认证',
            timeout: 3000
          });
          clearGitHubToken();
          updateUIWithAuthStatus();
        }
      });
    }
    
    // 监听页面变化
    ['DOMContentLoaded', 'turbo:load', 'pjax:end', 'load'].forEach(ev => {
      document.addEventListener(ev, safeFixAll, { passive: true });
    });
    
    // 注册菜单命令
    try {
      registerMenuCommands();
    } catch (e) {
      console.error('注册菜单命令失败:', e);
    }
    
    // 初始执行
    setTimeout(safeFixAll, 1000);
    setInterval(safeFixAll, 5000); // 每5秒检查一次页面变化
    
    console.log('GitHub Rescue 脚本初始化完成');
  }

  // 启动脚本
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // 暴露全局函数供HTML使用
  window.showAuthDialog = showAuthDialog;
})();