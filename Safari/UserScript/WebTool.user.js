
// ==UserScript==
// @name       网页工具箱(待更新)
// @description 常用网址书签栏、搜索引擎优化、网站二维码生成、链接跳转直达。本脚本基于星星龙作者精简修改

// @author      Eric
// @version     3.0.1
// @include     *
// @license     MIT License

// @require     https://cdn.staticfile.org/mustache.js/3.1.0/mustache.min.js
// @require     https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @require     https://cdn.bootcdn.net/ajax/libs/toastr.js/2.1.3/toastr.min.js
// @require     https://cdn.bootcdn.net/ajax/libs/jszip/3.1.5/jszip.min.js
// @resource    toastr_css https://cdn.bootcdn.net/ajax/libs/toastr.js/2.1.3/toastr.min.css

// @connect     *
// @grant       GM_log
// @grant       GM.info
// @grant       GM_info
// @grant       GM_addStyle
// @grant       GM.setValue
// @grant       GM_setValue
// @grant       GM.getValue
// @grant       GM_getValue
// @grant       unsafeWindow
// @grant       GM.openInTab
// @grant       GM_openInTab
// @grant       GM.listValues
// @grant       GM_listValues
// @grant       GM.deleteValue
// @grant       GM_deleteValue
// @grant       GM.setClipboard
// @grant       GM_setClipboard
// @grant       GM.notification
// @grant       GM.xmlHttpRequest
// @grant       GM_xmlhttpRequest
// @grant       GM.getResourceUrl
// @grant       GM_getResourceURL
// @grant       GM_getResourceText
// @grant       GM_registerMenuCommand
// @grant       GM_unregisterMenuCommand
// ==/UserScript==
(function () {
    'use strict';


    var GUtils = {
        inIframe: function () {
            return self.frameElement && 'IFRAME' == self.frameElement.tagName
                || !(window.frames.length == parent.frames.length && self == top)
        },
        
        intercepter: function (regexStr) {
            if (regexStr && regexStr.length !== 0) {
                for (let i = 0; i < regexStr.length; i++) {
                    let item = regexStr[i];
                    if (location.href.indexOf(item) !== -1) {
                        return false;
                    }
                }
      
            }
         
        },
    };

    

    var Constant = {
        getLinkStr: function () {
            return linkStr;
        },


        getSelectMode: function () {
            return keySelectMode;//记录上次点击的是书签还是搜索模块
        },
        StrSearch: function () {
            return modeSearch;//常量
        },
        StrBookMark: function () {
            return modeBookMark;//常量
        },

        getBookMarkIds: function () {
            return bookMarkIds;//书签类型ID缓存
        },
        getListBookMark: function () {
            return bookMarkList;//书签缓存
        },

        getKeyButtonTop: function () {
            return keyButtonTop;//工具按钮的y坐标的记录点常量
        },
        getKeyButtonLeft: function () {
            return keyButtonLeft;//工具按钮的x坐标的记录点常量
        },
        getKeyQrcodeSwitch: function () {
            return keyQrcodeSwitch;//二维码的开关记录常量
        },

        getKeySwitch: function () {
            return keySwitch;//总开关：处于关闭状态则其他的按钮全部是收起状态
        },
        getKeySearch: function () {
            return keySearch;//搜索功能上次是否开启
        },
        getKeyBookMark: function () {
            return keyBookMark;//搜索功能上次是否开启
        },
    };


    let keyButtonTop = 'maga-tag-navigator-button-top';
    let keyButtonLeft = 'maga-tag-navigator-button-left';
    let keyQrcodeSwitch = 'maga-qrcode-url-key-switch';


    let keySelectMode = 'maga-key-optimize-select-mode';
    let modeSearch = 'maga-optimize-select-mode-search';
    let modeBookMark = 'maga-optimize-select-mode-book-mark';

    let keySwitch = 'maga-key-optimize-search-switch';
    let keySearch = 'maga-key-optimize-search-search';
    let keyBookMark = 'maga-key-optimize-search-book-mark';

    let bookMarkIds = 'maga-optimize-select-book-mark-id-1001';
    let bookMarkList = 'maga-optimize-select-book-mark-list';

    let linkStr = `
[百度搜索] [https://www.baidu.com/s?wd=#keyword#]
[360搜索] [https://www.so.com/s?q=#keyword#]
[搜狗搜索] [https://www.sogou.com/web?query=#keyword#]
[谷歌搜索] [https://www.google.com/search?q=#keyword#]
[Bing搜索] [https://cn.bing.com/search?q=#keyword#]
[雅虎搜索] [https://search.yahoo.com/search?p=#keyword#] (input[name=p])
[Yandex搜] [https://yandex.com/search/?text=#keyword#] (input[name=text])
[鸭鸭搜索] [https://duckduckgo.com/?q=#keyword#]
[Ecosia搜] [https://www.ecosia.org/search?method=index&q=#keyword#]
[You搜索] [https://you.com/search?q=#keyword#]

[百度翻译] [https://fanyi.baidu.com/#en/zh/#keyword#] [新窗口]
[谷歌翻译] [https://translate.google.com/?hl=zh-CN&tab=wT0#view=home&op=translate&sl=auto&tl=zh-CN&text=#keyword#] [新窗口]
[搜狗翻译] [https://fanyi.sogou.com/?keyword=#keyword#] [新窗口]
[有道翻译] [http://dict.youdao.com/search?q=#keyword#] [新窗口]
[Deepl翻译] [https://www.deepl.com/translator#zh/en/#keyword#] [新窗口]

[Quora搜索] [https://www.quora.com/search?q=#keyword#] [新窗口]
[维基百科] [https://zh.wikipedia.org/wiki/#keyword#] [新窗口]
[知乎搜索] [https://www.zhihu.com/search?type=content&q=#keyword#]
[豆瓣搜索] [https://www.douban.com/search?source=suggest&q=#keyword#]
[简书搜索] [https://www.jianshu.com/search?q=#keyword#] (#q)


[GitHub搜] [https://github.com/search?utf8=✓&q=#keyword#]
[Stackoverflow] [https://stackoverflow.com/search?q=#keyword#] [新窗口]
[Segmentfault] [https://segmentfault.com/search?q=#keyword#]
[博客园] [https://zzk.cnblogs.com/s?w=#keyword#] (input[name=Keywords]) [右侧]
[CSDN] [https://so.csdn.net/so/search/s.do?q=#keyword#] (#toolbar-search-input)
[掘金] [https://juejin.im/search?query=#keyword#] (.search-input)
[MSDN] [https://docs.microsoft.com/zh-cn/search/?terms=#keyword#] [新窗口]

[百度图片] [https://image.baidu.com/search/index?tn=baiduimage&word=#keyword#] [新窗口]
[Google图片] [https://www.google.com/search?q=#keyword#&tbm=isch] [新窗口]
[Bing图片] [https://cn.bing.com/images/search?q=#keyword#&scenario=ImageBasicHover] [新窗口]


[有道词典] [https://dict.youdao.com/w/#keyword#] [新窗口]
[必应词典] [https://cn.bing.com/dict/search?q=#keyword#] [新窗口]
[Vocabulary] [https://www.vocabulary.com/dictionary/#keyword#] [新窗口]
[格林斯高阶] [https://www.collinsdictionary.com/dictionary/english/#keyword#] [新窗口]
[剑桥词典] [https://dictionary.cambridge.org/zhs/%E8%AF%8D%E5%85%B8/%E8%8B%B1%E8%AF%AD-%E6%B1%89%E8%AF%AD-%E7%AE%80%E4%BD%93/#keyword#] [新窗口]
[韦氏词典] [https://www.learnersdictionary.com/definition/#keyword#] [新窗口]


[淘宝搜索] [https://s.taobao.com/search?q=#keyword#] [新窗口]
[天猫搜索] [https://list.tmall.com/search_product.htm?q=#keyword#] [新窗口]
[京东搜索] [http://search.jd.com/Search?keyword=#keyword#] [新窗口]
[亚马逊搜] [https://www.amazon.cn/s?k=#keyword#] [新窗口]
[当当网搜] [http://search.dangdang.com/?key=#keyword#] [新窗口]
[孔夫子搜] [http://search.kongfz.com/product_result/?key=#keyword#] [新窗口]


[YouTube] [https://www.youtube.com/results?search_query=#keyword#] [新窗口]
[哔哩搜索] [http://search.bilibili.com/all?keyword=#keyword#] [新窗口]
[优酷搜索] [https://so.youku.com/search_video/q_#keyword#] [新窗口]
[爱奇艺搜] [https://so.iqiyi.com/so/q_#keyword#] [新窗口]
[腾讯搜索] [https://v.qq.com/x/search/?q=#keyword#] [新窗口]


[云盘精灵搜] [https://www.yunpanjingling.com/search/#keyword#]
[大圣盘搜索] [https://www.dashengpan.com/search?keyword=#keyword#]
[大力盘搜索] [https://www.dalipan.com/search?keyword=#keyword#]
[小昭来啦] [https://www.xiaozhaolaila.com/s/search?q=#keyword#]
[小可搜搜] [https://www.xiaokesoso.com/s/search?q=#keyword#]
`;

    let linkList = '';
   

    var Utils = {
        get: function () {
            if (linkList == '' || linkList.length === 0) {
                linkList = this.trim(this.getDefault());
            }
            return linkList
        },
        getDefault: function () {
            //默认的搜索引擎格式：[名称][搜索网址][是否新窗口打开，可省略] 搜索关键词用 #keyword# 表示，每行一个网站
            return this.trim(Constant.getLinkStr())
        },
        trim: function (str) {
            if (typeof str === 'string') {
                //去除字符串两端空白符
                return str
                    .replace(/^\s\s*/, '')
                    .replace(/\s\s*$/, '')
                    .trim()
            } else {
                return str
            }
        },

        //提取链接中对应参数的值
        getQueryVariable: function (variable) {
            let query = window.location.search.substring(1);
            let vars = query.split('&');
            for (let i = 0; i < vars.length; i++) {
                let pair = vars[i].split('=');
                if (pair[0] == variable) {
                    return pair[1]
                }
            }
            return ''
        },

        //获取搜索关键词
        getQueryPramValue: function () {
            {
                return currQueryPramVal
            }
        },
        getUserSelector: function ($j) {
            {
                return currSelector
            }
        },
        //尝试用户自定义关键词
        getKeywordConfig: function ($j) {
            //尝试用户自定义选择符
            let val = '';
            let selector = this.getUserSelector($j);
            if (selector) {
                if (selector.indexOf('#') !== -1 ||
                    selector.indexOf('.') !== -1 ||
                    selector.indexOf('=') !== -1 ||
                    selector.indexOf('input') !== -1 ||
                    selector.indexOf(':') !== -1) {
                    val = $j(selector).val() || $j(selector).text();
                }
                if (val && val.length > 0) {
                    return val
                } else {
                    return $j('#' + selector).val() ||
                        $j('.' + selector).val() ||
                        $j('input[name=\'' + selector + '\']').val() ||
                        $j('#' + selector).text() ||
                        $j('.' + selector).text() ||
                        $j('input[name=\'' + selector + '\']').text()
                }
            } else {
                return ''
            }
        },

        //尝试获取常见选择符
        getKeywordCommon: function ($j) {
            //尝试常用标记
            let val = $j('input[name=q]').val() || $j('input[name=query]').val()
                || $j('input[name=search]').val() || $j('input[name=keyword]').val()
                || $j('input[name=Keywords]').val() || $j('input[name=\'w\']').val()
                || $j('input[name=searchInput]').val() || $j('input[name=word]').val()
                || $j('input[name=\'search-input\']').val() || $j('input[name=\'text\']').val()
                || $j('input[name=\'s\']').val() || $j('input[name=key]').val()
                || $j('input#q').val() || $j('input#query').val()
                || $j('input#search').val() || $j('input#keyword').val()
                || $j('input#Keywords').val() || $j('input#w').val()
                || $j('input#input').val() || $j('#input[name=searchWord]').val()
                || $j('input#searchInput').val() || $j('input#word').val()
                || $j('input#search-input').val() || $j('input#text').val()
                || $j('input#s').val() || $j('input#search_input').val()
                || $j('input#key').val() || $j('input.q').val()
                || $j('input.query').val() || $j('input.search').val()
                || $j('input.keyword').val() || $j('input.Keywords').val()
                || $j('input.w').val() || $j('input.input').val()
                || $j('input.key').val() || $j('input.searchInput').val()
                || $j('input.word').val() || $j('input.search-input').val()
                || $j('input.text').val() || $j('input.s').val()
                || $j('input.search_input').val()

                || $j('#kw').val() || $j('input[name=q]').val()
                || $j('#upquery').val() || $j('#baidu_translate_input').val()
                || $j('#sb_form_q').val() || $j('#query').val()
                || $j('#trans-input').val() || $j('#Popover2-toggle').val()
                || $j('input.word').val() || $j('input[name=q]').eq(1).val()
                || $j('#search').val() || $j('#searchword').val()
                || $j('input[name=keyword]').val() || $j('input[name=searchInput]').val()
                || $j('#mq').val() || $j('#keywords').val()
                || $j('input[name=p]').val() || $j('.right_contents input.selector_input').val()
                || $j('#searchIput').val() || $j('input[name=text]').val()
                || $j('input[name=Keywords]').val() || $j('#q').val()
                || $j('#toolbar-search-input').val() || $j('input.search-input').val()
                || $j('input[name=\'facet-search-input\']').val() || $j('.headword').text()
                || $j('input[name=ld_search_inp]').eq(1).val() || $j('#twotabsearchtextbox').val()
                || $j('#key_S').val() || $j('#stickSearchKey').val() || '';

            //获取地址栏参数
            if (val) {
                return val
            } else {
                return this.getQueryPramValue()
            }
        },
        //获取youtube选择符
        getKeywordYuToBe: function () {
            let ytbObj = document.getElementsByName('search_query');
            if (ytbObj && ytbObj[0] && ytbObj[0].value) {
                return ytbObj[0].value
            }
            return ''
        },
        //获取搜索关键词
        getKeyword: function ($j) {
            let keyword = this.getKeywordCommon($j) || this.getKeywordYuToBe() || this.getKeywordConfig($j);
            return encodeURIComponent(keyword.replace(/^\s+|\s+$/gm, ''))
        },
    };

    var Event = {

        initEvent: function ($j, runType) {

            //默认选中的模块
            setSelectMode($j);
            //插件功能是否开启
            setOnClickListenerSwitch($j);
            //搜索页面点击事件
            setOnClickListenerSearch($j);
            //书签页面点击事件
            setOnClickListenerBookMark($j);
            //更多页面点击事件
            setOnClickListenerMore($j);
            //设置页面点击事件
            setOnClickListenerSetting($j, runType);
            //设置控件的一些属性
            addattribute($j);

            //搜索引擎
            $j('#maga-better-list-search a').each(function () {
                $j(this).attr('data-href', $j(this).attr('href'));
            });

            //修改链接
            $j('#maga-better-list-search a').on('mouseover', function () {
                let href = $j(this).attr('data-href').replace(/#keyword#/i, Utils.getKeyword($j));
                $j(this).attr('href', href);
            });

            //链接跳转
            $j('#maga-better-list-search a').on('click', function () {
                if ($j(this).attr('href').indexOf('#keyword#') !== -1) {
                    let href = $j(this).attr('href').replace(/#keyword#/i, Utils.getKeyword($j));
                    $j(this).attr('href', href);
                }
                return true
            });
        },
    };

    function setOnClickListenerSwitch($j) {
        function fadeOutViews($j) {
            $j('#maga-better-icon-search').fadeOut();
         
            $j('#maga-better-icon-more').fadeOut();
            $j('#maga-better-icon-setting').fadeOut();
        }

        function fadeInViews($j) {
            $j('#maga-better-icon-search').fadeIn();
          
            $j('#maga-better-icon-more').fadeIn();
            $j('#maga-better-icon-setting').fadeIn();
        }

        $j(document).keyup(function (e) {
            // GM_log('e.key================' + e.key)
            if (e.key === 'Escape') {
                // ESC关闭页面
                $j('#maga-better-list-search').fadeOut();
                
                $j('#maga-better-list-more').fadeOut();
                $j('#maga-better-list-setting').fadeOut();
            } else if (e.altKey && e.key === 'z') {
                $j('#maga-better-icon-switch').click();
            } else if (e.altKey && e.key === 'x') {
                $j('#maga-better-icon-search').click();
            } else if (e.altKey && e.key === 'c') {
               
            } else if (e.altKey && e.key === 'v') {
                $j('#maga-better-icon-more').click();
            } else if (e.altKey && e.key === 'b') {
                $j('#maga-better-icon-setting').click();
            }
        });

        $j('#maga-better-icon-switch').click(function () {
            GM_setValue(Constant.getKeySwitch(), !GM_getValue(Constant.getKeySwitch(), true));
            if (GM_getValue(Constant.getKeySwitch(), true)) {
                fadeInViews($j);
            } else {
                fadeOutViews($j);
                /*总开关关闭 ==> 关闭所有展示的模块*/
                GM_setValue(Constant.getKeySearch(), false);
                GM_setValue(Constant.getKeyBookMark(), false);
                $j('#maga-better-list-search').fadeOut();
               
                $j('#maga-better-list-more').fadeOut();
                $j('#maga-better-list-setting').fadeOut();
            }
        });
        if (GM_getValue(Constant.getKeySwitch(), true)) {
            $j('#maga-better-icon-search').show();
           
            $j('#maga-better-icon-more').show();
            $j('#maga-better-icon-setting').show();
        } else {
            $j('#maga-better-icon-search').hide();
           
            $j('#maga-better-icon-more').hide();
            $j('#maga-better-icon-setting').hide();
        }
    }

    function setSelectMode($j) {
        let selectMode = GM_getValue(Constant.getSelectMode(), Constant.StrSearch());
        if (selectMode == Constant.StrSearch()) {
            if (GM_getValue(Constant.getKeySearch(), true)) {
                $j('#maga-better-list-search').show();
            } else {
                $j('#maga-better-list-search').hide();
            }
        } else if (selectMode == Constant.StrBookMark()) {
            if (GM_getValue(Constant.getKeyBookMark(), true)) {
                
            } else {
                
            }
        }
    }

    function setOnClickListenerSearch($j) {
        $j('#maga-better-icon-search').click(function () {
            GM_setValue(Constant.getSelectMode(), Constant.StrSearch());
            if ($j('#maga-better-list-search').css('display') === 'none') {
                GM_setValue(Constant.getKeySearch(), true);
            } else {
                GM_setValue(Constant.getKeySearch(), false);
            }

          
            $j('#maga-better-list-setting').fadeOut();
            $j('#maga-better-list-more').fadeOut();

            setTimeout(function () {
                if (GM_getValue(Constant.getKeySearch(), true)) {
                    $j('#maga-better-list-search').fadeIn();
                } else {
                    $j('#maga-better-list-search').fadeOut();
                }
            }, 300);
        });
    }

    function setOnClickListenerBookMark($j) {
        $j('#maga-better-icon-book-mark').click(function () {
            GM_setValue(Constant.getSelectMode(), Constant.StrBookMark());
           

            $j('#maga-better-list-search').fadeOut();
            $j('#maga-better-list-setting').fadeOut();
            $j('#maga-better-list-more').fadeOut();

          
        });
    }

    function setOnClickListenerMore($j) {
        $j('#maga-better-icon-more').click(function () {
            $j('#maga-better-list-search').hide();
            $j('#maga-better-list-setting').hide();
          

            setTimeout(function () {
                if ($j('#maga-better-list-more').css('display') === 'none') {
                    $j('#maga-better-list-more').fadeIn();
                } else {
                    $j('#maga-better-list-more').fadeOut();
                }
            }, 300);
        });
    }

    function setOnClickListenerSetting($j, runType) {
        // 设置页面点击事件
        $j('#maga-better-icon-setting').click(function () {
            $j('#maga-better-list-search').hide();
            $j('#maga-better-list-more').hide();
           

            setTimeout(function () {
                if ($j('#maga-better-list-setting').css('display') === 'none') {
                    $j('#maga-better-list-setting').fadeIn();
                } else {
                    $j('#maga-better-list-setting').fadeOut();
                }
            }, 300);
        });
        if (runType == 'complex') {
            $j('#maga-better-setting-qrcode').click(function () {
                let key = Constant.getKeyQrcodeSwitch();
                GM_setValue(key, !GM_getValue(key, true));
                if (GM_getValue(key, true)) {
                    toastr.success('二维码工具已开启！');
                } else {
                    toastr.error('二维码工具已关闭！');
                }
                setTimeout(() => {
                    location.reload();
                }, 200);
            });
            $j('#maga-better-setting-reset-button-tool').click(function () {
                // 导航按钮复位
                GM_deleteValue(Constant.getKeyButtonTop());
                GM_deleteValue(Constant.getKeyButtonLeft());
                toastr.success('设置成功，网页刷新！');
                setTimeout(() => {
                    location.reload();
                }, 200);
            });
        }
        $j('#maga-better-setting-reset').click(function () {
            // 清理缓存
            GM_deleteValue(Constant.getSelectMode());
            GM_deleteValue(Constant.getBookMarkIds());
            GM_deleteValue(Constant.getListBookMark());
            GM_deleteValue(Constant.getKeyButtonTop());
            GM_deleteValue(Constant.getKeyButtonLeft());
            GM_deleteValue(Constant.getKeyQrcodeSwitch());
            GM_deleteValue(Constant.getKeySwitch());
            GM_deleteValue(Constant.getKeySearch());
            GM_deleteValue(Constant.getKeyBookMark());
            toastr.success('清理成功，网页刷新！');
            setTimeout(() => {
                location.reload();
            }, 200);
        });
        $j('#maga-better-setting-book-type').click(function () {
            if ($j('#maga-better-setting-book-type-list').css('display') === 'none') {
                $j('#maga-better-setting-book-type-list').fadeIn();
            } else {
                $j('#maga-better-setting-book-type-list').fadeOut();
            }
        });

        $j('#maga-better-setting-book-type-refresh').click(function () {
            toastr.success('网页刷新！');
            setTimeout(() => {
                location.reload();
            }, 200);
        });

        // 链接跳转
        $j('.book-type-item').click(function () {
            let ids = GM_getValue(Constant.getBookMarkIds(), []);
            let dataId = $j(this).attr('data-id');

            for (let i = 0; i < ids.length; i++) {
                let id = ids[i].id;
                ids[i].typeName;
                if (id == dataId) {
                    if ($j(this).hasClass('book-type-item-select')) {
                        $j(this).attr('class', 'book-type-item book-type-item-unselect');
                    } else {
                        $j(this).attr('class', 'book-type-item book-type-item-select');
                    }
                    ids[i].enable = !ids[i].enable;
                    break
                }
            }
            // GM_log(ids)
            GM_setValue(Constant.getBookMarkIds(), ids);
            return true
        });

         $j('#maga-better-setting-coupon').click(function () {
            // 百度大全
            GM_openInTab('https://www.baidu.com/more/');
        });
        $j('#maga-better-setting-video').click(function () {
            // VIP影视解析
            GM_openInTab('https://z1.m1907.cn/');
        });
        $j('#maga-better-setting-zhenbuka-group').click(function () {
            // 真不卡影视
            GM_openInTab('http://www.zhenbuka5.com');
        });
         $j('#maga-better-setting-greasyfork-group').click(function () {
            // 油猴脚本
            GM_openInTab('https://greasyfork.org/');
        });
        $j('#maga-better-setting-tool-group').click(function () {
            // Tools在线工具
            GM_openInTab('https://tool.lu/');
        });
        $j('#maga-better-setting-savieo-group').click(function () {
            // savieo视频
            GM_openInTab('https://savieo.com/');
        });

    }

    function addattribute($j) {
        $j('#maga-better-icon-switch').attr('class', 'maga-better-icon');
        $j('#maga-better-icon-search').attr('class', 'maga-better-icon');
       
        $j('#maga-better-icon-setting').attr('class', 'maga-better-icon');
        $j('#maga-better-icon-more').attr('class', 'maga-better-icon');

        $j('#maga-better-list-setting').css('min-height', '136px');
        $j('#maga-better-list-more').css('min-height', '136px');

    }

    let runType$1 = 'alone';

    let regexStr$6 = [];

    const website$7 = {
        intercepter: function () {
            return GUtils.intercepter(regexStr$6)
        },

        setRunType: function (val) {
            runType$1 = val || 'alone';
        },
        init: function ($j) {
            GM_addStyle(GM_getResourceText('toastr_css'));
            let html = `
                <div id="maga-better-wrapper">
                    <div id="maga-better-icon-wrapper">
                        <!--关闭插件-->
                        <img id="maga-better-icon-switch"/>
                        <!--搜索优化-->
                        <img id="maga-better-icon-search"/>
                       
                        <!--更多功能-->
                        <img id="maga-better-icon-more"/>
                        <!--设置功能-->
                        <img id="maga-better-icon-setting"/>
                    </div>
                    <div id="maga-better-content-wrapper">
                        <!--搜索优化列表-->
                        <div id="maga-better-list-search"></div>
                        
                        <!--更多模块列表-->
                        <div id="maga-better-list-more"></div>
                        <!--设置模块列表-->
                        <div id="maga-better-list-setting"></div>
                    </div>
             </div>
            `;

            setTimeout(function () {
                if ($j('#maga-better-wrapper').length !== 0) return

                $j('body').append(html);

                parseConfigSearch($j);
               
                parseConfigMore($j);
                parseConfigSetting($j, runType$1);

                Event.initEvent($j, runType$1);
            }, 200);

            function parseConfigSearch($j) {
                let template = `
                    <a class="search-item" href="{{siteurl}}" {{sitetarget}} data-selector="{{inputselector}}">
                        {{sitename}}
                    </a>
                    `;
                let linkArr = Utils.get().split(/\r*?\n|\r/);
                let linkHtmlStr = '';
                for (let i in linkArr) {
                    let link = Utils.trim(linkArr[i]);
                    if (typeof link !== 'string' || link === '') {
                        continue
                    }
                    link = link.replace(/【/g, '[').replace(/】/g, ']');
                    let matches = link.match(/\[(.*?)\][^\[]*?\[(.*?)\]/);
                    if (matches == null) {
                        continue
                    }
                    let title = Utils.trim(matches[1]);
                    let url = matches[2].indexOf('#keyword#') !== -1 ? Utils.trim(matches[2]) : Utils.trim(matches[2]) + '#keyword#';
                    let target = /\[\s*?新窗口(打开)?\s*?]/.test(link) ? 'target="_blank"' : '';
                    let inputSelector = link.match(/\(\s*?(.*?)\s*?\)/);
                    inputSelector = inputSelector && inputSelector[1] ? inputSelector[1] : '';

                    let linkHtmlItem = template
                        .replace(/{{sitename}}/g, title)
                        .replace('{{siteurl}}', url)
                        .replace('{{sitetarget}}', target)
                        .replace('{{inputselector}}', inputSelector);
                    linkHtmlStr += linkHtmlItem;
                }
                $j('#maga-better-list-search').append(linkHtmlStr);
            }

            function parseConfigBookMark($j) {

                function renderHtml(bookmark, $j) {
                    let templateTitle = `
                    <a class="book-mark-title">
                        {{sitename}}
                    </a>
                    `;
                    let templateItem = `
                    <a class="book-mark-item" href="{{siteurl}}" target="_blank">
                        {{sitename}}
                    </a>
                    `;
                    let linkHtmlStr = '';
                    if (bookmark.data && bookmark.data.length > 0) {
                        bookmark.data.forEach((item, index) => {
                            if (item.data.length === 0) { return }
                            let linkHtmlItem = templateTitle
                                .replace(/{{sitename}}/g, item.typeName);
                            linkHtmlStr += linkHtmlItem;
                            item.data.forEach((row) => {
                                let linkHtmlItem = templateItem
                                    .replace(/{{sitename}}/g, row.remarks)
                                    .replace('{{siteurl}}', row.clickUrl);
                                linkHtmlStr += linkHtmlItem;
                            });
                        });
                    }
                    $j('#maga-better-list-book-mark').empty();
                    $j('#maga-better-list-book-mark').append(linkHtmlStr);
                }

                return new Promise((resolve, reject) => {
                    function getBookmark(resolve, reject) {
                        let ids = GM_getValue(Constant.getBookMarkIds(), []);
                        if (ids.length === 0) {
                            reject('get book mark error!');
                        } else {
                            let idListStr = [];
                            for (let i = 0; i < ids.length; i++) {
                                if (ids[i].enable) {
                                    idListStr.unshift(ids[i].id);
                                }
                            }
                           
                                  
                                    }
                                
                           
                        }
                    

                    // 书签
                    function getBookType(resolve, reject) {
                       
                        
                    }

                   

                   
                    if (GM_getValue(Constant.getBookMarkIds(), []).length == 0) {
                        getBookType(resolve, reject);
                    } else {
                       
                    }

                }).then((bookMark) => {
                   
                })
            }

            function parseConfigMore($j) {
                let linkHtmlStr = `<a id="maga-better-setting-coupon">百度大全</a>`;
                linkHtmlStr += `<a id="maga-better-setting-video">VIP影视解析</a>`;
                linkHtmlStr += `<a id="maga-better-setting-zhenbuka-group">真不卡影视</a>`;
                linkHtmlStr += `<a id="maga-better-setting-greasyfork-group">油猴脚本</a>`;
                linkHtmlStr += `<a id="maga-better-setting-tool-group">Tool在线工具</a>`;
                linkHtmlStr += `<a id="maga-better-setting-savieo-group">savieo视频</a>`;
                $j('#maga-better-list-more').append(linkHtmlStr);
            }

            function parseConfigSetting($j, runType) {

                let linkHtmlStr = '';
                if (runType == 'complex') {
                    linkHtmlStr = `<a id="maga-better-setting-qrcode">二维码开关</a>`;
                    linkHtmlStr += `<a id="maga-better-setting-reset-button-tool">复位工具按钮</a>`;
                }
                linkHtmlStr += `<a id="maga-better-setting-reset">清理缓存</a>`;
                
                $j('#maga-better-list-setting').append(linkHtmlStr);
                
                  

                function renderHtml($j, ids) {
                    let templateIdOpen = `
                    <span class="book-type-item book-type-item-select" data-id="{{data-id}}">
                        {{typeName}}
                    </span>
                    `;
                    let templateIdClose = `
                    <span class="book-type-item book-type-item-unselect" data-id="{{data-id}}">
                        {{typeName}}
                    </span>
                    `;
                    let bookMarkHtmlStr = '';
                    for (let index = 0; index < ids.length; index++) {
                        let item = ids[index];
                        let linkHtmlItem;
                        if (item.enable) {
                            linkHtmlItem = templateIdOpen
                                .replace('{{data-id}}', item.id)
                                .replace(/{{typeName}}/g, item.typeName);
                        } else {
                            linkHtmlItem = templateIdClose
                                .replace('{{data-id}}', item.id)
                                .replace(/{{typeName}}/g, item.typeName);
                        }
                        bookMarkHtmlStr += linkHtmlItem;
                    }
                    $j('#maga-better-setting-book-type-list').append(bookMarkHtmlStr);
                }
            }

        },
    };

    const modules$2 = [website$7];

    const prepare$2 = {
        init: function ($j, runType) {
            if (GUtils.inIframe()) {
                return
            }
            GM_addStyle(CSS_STR$1);
            for (let i = 0; i < modules$2.length; i++) {
                let module = modules$2[i];
                if (module.intercepter()) {
                    continue;
                }
                module.setRunType((typeof runType === 'undefined') ? 'alone' : runType);
                module.init($j);
            }
        }
    };

    let CSS_STR$1 = `
#maga-better-wrapper {
    background: transparent;
    position: fixed;
    top: 140px;
    /*右侧*/
    right: 0;
    flex-direction: row-reverse;
    max-width: 320px;
    padding: 10px;
    font-size: 14px;

    /*左侧*/
    /*left: 0;*/
    /*flex-direction: row;*/
    /*max-width: 160px;*/
    /*padding: 6px;*/
    /*font-size: 14px;*/

    z-index: 99999999;
    font-weight: 400;
    box-sizing: border-box;
    display: flex;
    align-items: flex-start;
}

#maga-better-icon-wrapper {
    width: 36px;
}

#maga-better-content-wrapper {
    margin: 0 2px;
    text-align: left;
    flex: 1;
}

#maga-better-list-book-mark {
    padding: 8px 4px;
    border-radius: 6px;
    background: rgba(28, 35, 35, 0.9);
    display: none;
    max-height: 500px;
    min-height: 176px;
    overflow-y: scroll;
}

/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
#maga-better-list-book-mark::-webkit-scrollbar {
    width: 0;
    height: 0;
}

#maga-better-list-search {
    padding: 8px 4px;
    border-radius: 6px;
    background: rgba(28, 35, 35, 0.9);
    display: none;
    max-height: 500px;
    min-height: 176px;
    overflow-y: scroll;
}

/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
#maga-better-list-search::-webkit-scrollbar {
    width: 0;
    height: 0;
}

#maga-better-list-setting {
    padding: 8px 4px;
    border-radius: 6px;
    background: rgba(28, 35, 35, 0.9);
    display: none;
}

/*搜索模块-列表的条目：搜索网址*/
.search-item {
    border-radius: 2px;
    border: 1px solid #EFEFEF;
}







#maga-better-list-more {
    padding: 8px 4px;
    border-radius: 6px;
    background: rgba(28, 35, 35, 0.9);
    display: none;
}

#maga-better-setting-book-type {
    flex: 1;
    display: inline-block;
    font-weight: 200;
}

#maga-better-setting-book-type-refresh {
    cursor: pointer;
    display: inline-block;
    font-weight: 100;
    color: #3186fd;
}

#maga-better-content-wrapper a {
    cursor: pointer;
    color: #FFFFFF;
    margin: 2px 2px;
    padding: 3px 3px;
    list-style: none;
    text-decoration: none;
    display: inline-block;
}

#maga-better-content-wrapper a:hover {
    color: #EEEEEE !important;
}

.maga-better-icon {
    width: 36px;
    height: 36px;
    cursor: pointer;
    border-radius: 6px;
    background: rgba(28, 35, 35, 0.9);
}

#maga-better-icon-setting {
    background-repeat: no-repeat;
    background-position: center;
    background-image: url("data:image/svg+xml;charset=utf8,<svg width=%2230%22 height=%2230%22 class=%22icon%22 viewBox=%220 0 1024 1024%22 version=%221.1%22 xmlns=%22http://www.w3.org/2000/svg%22> <path d=%22M547.6 960h-71.3c-31.9 0-57.9-26-57.9-57.9v-37.2c-31.5-8.3-61.6-20.8-89.9-37.3L302.2 854c-22.5 22.6-59.3 22.6-81.8 0L170 803.6c-22.6-22.5-22.6-59.3 0-81.8l26.4-26.4c-0.9-1.5-1.7-2.9-2.5-4.4-15.3-27-26.9-55.7-34.8-85.5h-37.2c-31.9 0-57.8-26-57.8-57.9v-71.3c0-31.9 25.9-57.9 57.8-57.9h37.2c8.3-31.5 20.8-61.6 37.3-89.9L170 302.2c-22.6-22.5-22.6-59.3 0-81.8l50.4-50.4c22.5-22.5 59.3-22.6 81.8 0l26.4 26.4c13.9-8.1 28.4-15.3 43.2-21.5 15.2-6.3 30.8-11.6 46.7-15.8v-37.2c0-31.9 26-57.9 57.9-57.9h71.3c31.9 0 57.9 26 57.9 57.9v37.2c31.5 8.3 61.6 20.8 89.9 37.3l26.4-26.4c22.5-22.5 59.3-22.6 81.8 0l50.4 50.4c22.6 22.5 22.6 59.3 0 81.8l-26.4 26.4c16.5 28.3 29 58.4 37.3 89.9h37.2c31.9 0 57.9 26 57.9 57.9v71.3c0 31.9-26 57.9-57.9 57.9H865c-8.3 31.5-20.8 61.6-37.3 89.9l26.4 26.4c22.6 22.5 22.6 59.3 0 81.8L803.6 854c-22.5 22.6-59.3 22.6-81.8 0l-26.4-26.4c-28.3 16.5-58.4 29-89.9 37.3v37.2c0 31.9-26 57.9-57.9 57.9zM324.8 767.8c5.1 0 10.1 1.4 14.6 4.4 33.9 22.5 71.1 38 110.7 45.9 12.3 2.5 21.2 13.3 21.2 25.8V902c0 2.8 2.3 5.1 5.1 5.1h71.3c2.8 0 5.1-2.3 5.1-5.1v-58c0-12.6 8.9-23.4 21.2-25.8 39.6-8 76.8-23.4 110.7-45.9 10.4-7 24.3-5.6 33.2 3.3l41.2 41.2c2 2 5.3 2 7.3 0l50.4-50.4c2-2 2-5.3 0-7.3l-41.2-41.2c-8.9-8.9-10.3-22.8-3.3-33.2 22.5-33.9 38-71.1 45.9-110.7 2.5-12.3 13.3-21.2 25.8-21.2h58.1c2.8 0 5.1-2.3 5.1-5.1v-71.3c0-2.8-2.3-5.1-5.1-5.1H844c-12.6 0-23.4-8.9-25.8-21.2-8-39.6-23.4-76.8-45.9-110.7-6.9-10.4-5.6-24.3 3.3-33.2l41.2-41.2c2-2 2-5.3 0-7.3l-50.4-50.4c-2-2-5.3-2-7.3 0l-41.2 41.2c-8.9 8.9-22.8 10.2-33.2 3.3-33.9-22.5-71.1-38-110.7-45.9-12.3-2.5-21.2-13.3-21.2-25.8V122c0-2.8-2.3-5.1-5.1-5.1h-71.3c-2.8 0-5.1 2.3-5.1 5.1v58c0 12.6-8.9 23.4-21.2 25.8-19.7 4-39.2 9.9-57.9 17.7-18.4 7.7-36.1 17.2-52.8 28.2-10.5 7-24.4 5.6-33.2-3.3L265 207.3c-2-2-5.3-2-7.3 0l-50.4 50.4c-2 2-2 5.3 0 7.3l41.2 41.2c8.9 8.9 10.3 22.8 3.3 33.2-22.5 33.9-38 71.1-45.9 110.7-2.5 12.3-13.3 21.2-25.8 21.2H122c-2.8 0-5.1 2.3-5.1 5.1v71.3c0 2.8 2.3 5.1 5.1 5.1h58c12.6 0 23.4 8.9 25.8 21.2 6.4 32 17.8 62.6 33.9 91.1 3.8 6.7 7.8 13.2 12 19.6 6.9 10.4 5.6 24.3-3.3 33.2L207.3 759c-2 2-2 5.3 0 7.3l50.4 50.4c2 2 5.3 2 7.3 0l41.2-41.2c5-5 11.8-7.7 18.6-7.7z%22 fill=%22%23FAFAFA%22></path> <path d=%22M512 716.4c-112.7 0-204.4-91.7-204.4-204.4S399.3 307.6 512 307.6c71.5 0 136.6 36.4 174.1 97.3 7.6 12.4 3.8 28.6-8.6 36.3-12.4 7.6-28.6 3.8-36.3-8.6-27.8-45.2-76.1-72.2-129.2-72.2-83.6 0-151.7 68-151.7 151.6s68 151.6 151.7 151.6 151.6-68 151.6-151.6c0-14.5 11.8-26.4 26.4-26.4s26.4 11.8 26.4 26.4c0 112.7-91.7 204.4-204.4 204.4z%22 fill=%22%23FAFAFA%22></path> </svg>");
}

#maga-better-icon-search {
    background-repeat: no-repeat;
    background-position: center;
    background-image: url("data:image/svg+xml;charset=utf8,<svg width=%2230%22 height=%2230%22 viewBox=%220 0 1024 1024%22 version=%221.1%22 xmlns=%22http://www.w3.org/2000/svg%22> <path fill=%22%23FAFAFA%22 d=%22M512 64.7C265.3 64.7 64.7 265.3 64.7 512S265.3 959.3 512 959.3 959.3 758.7 959.3 512 758.7 64.7 512 64.7z m0 845.8c-219.8 0-398.5-178.8-398.5-398.5 0-91.3 31.2-175.2 83-242.5-2.2 8.1-6.6 22.9-5.4 27.4 1.6 5.5 0.7 8.4 2.6 13.2-1.2 0.9-3.7 2.6-2.7 4.6 3.3 6.5 7.2 15.9 12.2 16.4-2 9.8 3.2 6 6.3 14.2 0.3 1.6-0.4 4.3 1.5 5.1 8.4 2.6 20.2 6.9 24 14.1-0.1-0.1-0.4 0-0.5 0 0 0.4-0.1 1.3-0.1 1.7 1.6 5.8 3.6 7 5.7 11.2 1.3 3 1.1 9.7 3.9 11.6 4.2 2.7 8.3 7.7 12 13 2.1 3.1-4.1 2.4-5.2 2.4 2.6 3.7 8.3 2.9 11.7 6.2 2.7 2.5 4.6 5.1 7.4 7.9-0.1 1.7-0.1 4.4-0.2 6.6 0.5 1 0.9 1.3 2.6 2.2 3 1.9 5.1 7.6 10.1 7.7 0.1 0.8 3.9 5.4 4.3 5.4 0.6-0.1 1.8-2.9 1.9-3.9-0.1-1.6-3.1-6.4-5.3-4.3-4.9-3.1-6.3-9.5-8.2-15.7-2-5.4-6.7-7.8-8.6-13.7-1.2-4.3-1.7-6.7-5.1-10.2-2.6-2.5-5.8-2.3-7.6-6-1.8-4.1-4.1-7.2-4.1-12.5 0-0.6 0.1-2.4 0.7-3.3 3 3 7.1 2.6 11.6 4.4 1.7 0.9 1.3 6.3 3.6 8.6 2 2.2 1.3 6.4 3.6 8.7 2.8 2.7 5.2 5.2 8.7 8.5 0.6-0.6 0.5-0.5 2.9-0.1 0 6.2 7.8 6.4 10.4 11 1.1 2.8-0.8 5.2 1.5 7.4 2.4 2.3 6.8 3.4 9.7 6 5.8 5.7 11.9 13.9 15.2 23.5 0.3 1.4 2.6 2.5 2.7 6 0.2 3-2.7 4.4-2.8 7.3 0.1 1.7 1.8 5.2 4.1 5.2 1.4 3.5 9.4 5.3 12.8 8.3 0.8 0.5 2.3 1.3 3.1 1.8 3.6 1.6 5.5 1 9.3 2.6 3.6 1.9 4.8 5 8.7 6.1 3.4 0.9 5.2-0.7 8.3 0.5 3.2 1.4 12.4 7.5 16 7.7 1.7 0 4.5-0.5 6.6 0.5 0.9 0.4 3.5 2.3 5.8 2.4 5-0.1 5.8-5.2 11-5.3 1.7 0 3.8 0.8 6.4 2.1h1.7c7.9 3.7 10 14.5 19.2 18.7 5.9 2.7 9.8 1.4 15.5 3.7 3.7 1.7 6.7 4.3 12.3 4.5 1.5-0.1 3.5-1.2 5.6-1.3 0.4 0.1 1.3 0.1 1.7 0 1.9 6.5 6.6 8.6 11.4 13.1 1.1 1 2.9 2.1 3.8 4.5 1.5 4.2-1.5 7.6 2.9 10.4 0.7-0.2 2.2 0 2.9 0-0.4-0.3-0.4-1.7 0-2.3 0.2 0 10 5.4 11.1 7.1 0.8 1.6 1 4.6 5.2 5.6-0.1 0.4 1 1.6 1.4 1.6 1.5 0 6.5-1.6 8.7 0.3 2.3 2.2 5.1 7 9.8 7.1 1.7 0.1 3.8-1.3 4.4-4-0.4-0.2-2.2-1.6-2.3-2.4 0.2-1.1 8-6.8 10.2-6.9 3 0 1.1 5.9 4.4 7.5-0.4 0.8-1.7 1.9-1.8 2.6 0 0.6 2.8 1.7 3.2 2 0.2 0 0.5-0.3 0.7-0.3-0.1 0.4-0.4 1.2-0.5 1.7 0.1 4.8 4.9 3.7 5.1 9.4-0.1 2.6-1.4 3.7-1.5 6.8 0.1 1.6 1.6 3.6 1.7 5.7v1.3c-0.3 0.5-1 1.6-1.2 2.1 0 0.6 1.7 2.3 2.8 2.6-2 7-9.1 5.1-12.5 11-2.3 4.3-4.3 10.9-12.2 11.2 1 11.6-3 16.3-3.1 22.2-0.1 3.7 0.4 8.4 4.4 8.5 1.5-0.1 1.7-1.3 4.3 0.2-1.4 3.9-6.3 5-9 8.9-0.9 0.7-3.1 4.4-3.2 7.5 0 4.3 3.9 9.4 6.9 12 0.9 0.7 3.3 0.4 4.2 1.9 0.6 1.3 1.3 5 3.3 6.8 0.8 0.4 2.7 0.2 3.6 1.6 2.3 4.6 4 7.6 5.9 13.2 1.8 5.1 3.2 10.4 5.3 16 1.2 3.6 5.1 5.1 5 8.7 0 3-1.2 5.4 0.9 7.2 4.9 4.3 8.4 7 16 8.7 3.7 0.9 5.2 1.4 8.5 4.2 2.9 2.2 5.8 1.9 9.8 3 5 2.2 8.6 4.7 10.8 9.9 0.5 2.5 1.1 15 0.9 17.1-0.3 3.2-3 9-3.2 12.1-0.4 2.9-0.5 5.7-0.7 9-0.8 2-2.3 5.8-2.4 7.2 0 0.6-0.1 1.2-0.1 1.8-0.7 6.7-4.9 10.9-5.6 18.4-0.2 3.1-3.3 5.9-2.1 9.1-0.4 4.8-0.6 9.2-1.1 13.6-1.9 4.3-2.3 7.2-4.4 11.4-0.4 0.7-1.6 0.8-2.4 1.4-1.2 1.2-2.1 3.5-3.2 5-2.4 2.3-6.2 6.5-6.7 10.3-0.3 1.3-0.2 5.4 0.6 5.5 0 0 1.2 0.4 1.2 1.6-0.2 0.5-0.9 1-2.5 1.1-1.2 2.9-3 4.1-3.2 7-0.1 1.9-1.1 5.4 1 5.4 1.5-0.3 1.9-1.2 3.8-1.9 0.6-0.2 1.5 0 2.2-0.2 0 1-0.1 1.2-0.3 2.2-2.7 4.2-5.4 8.3-8.1 12.4-15.7 1.9-32 3.2-48.6 3.2z m-38.5-795.1c-0.5 1-1.3 2-3.3 3.3-5.8 3.8-10.8 0.5-10.9-1 0-0.3 0.5-0.3 0.7-0.5 4.6-0.6 9-1.4 13.5-1.8z m148.7 779.3c0.4-0.4 0.5-0.6 1-1-1.1 0-2.3-0.2-2-1.7 2.2-0.5 2.7 0.8 5.6 0.3 0.4-0.2 2.6-1 2.6-2.2 0.3-0.9-0.8-0.4-1.7-1.1-0.6 0.3-2.3 1.3-3.4 1.5-1.9 0.4-3.9-2.8-3.6-5 0.1-1 0.9-2 2.6-2.1 4.7-0.9 5 1.1 9.8 0.5 1.5-0.3 5.1-1.7 5.6-2.5 0-0.7 0.1-0.9 0.3-1.5 2-2.3-0.6-4 2.8-6.3 2.5-1.8 9.3-1.2 13.1-2.6 5.7-2.1 9.8-2.3 14.4-5.5 2.3-2 4.3-3.1 6.8-5.7 1.4-1.2 1.6-2.1 2-4.3 0.7-2-3-1-3.4-2.7-0.4-2.4-0.1-3.4-1.6-4.5-0.8-0.4-3.7-0.4-3.5-2.1 0.1-0.6 1.3-1.1 2-1.1 3.6-0.6 5.9 0.9 8.9 0.3 1.5-0.3 5.8 0.5 9.5-0.1 10-2.1 13.5-10.2 18.9-16.4 4.7-5 10.2-9.5 15.2-14.8 2.4-2.8 0.5 1.2 2.4-1.4v0.1c3-4 5.8-7.3 10.2-10.1 1-4.6 1.6-9.7 2.4-14.8 0.4-3.5-0.7 0.5 2.7-2.4 1.9-1.8 4.7-2.2 6.8-5.1 4.8-6.1 9.1-4.5 15.1-10 0.6-0.6 0.9-1.7 2.4-2.5 3-1.9 6-2.4 9.8-3.3 3.4-0.6 7.8-4.3 9.5-6.9 0.5-0.7 0.7-2.9 1.8-4.4 3.6-4.5 4.9-6.5 8.7-11.7 0.5-0.7 1.7-5 2.3-6.8 0.2-1.6 2.2-3.9 3.3-5.1 0.4-0.5 1.4-1.6 1.4-2.6 0.6-2.5 3.7-13.3 4.3-16.9 0.8-4.9-2.1-6.2 1.1-10.1 2.2-2.4 4.3-3.4 6.6-6.7 1.6-2.2 2.3-2.7 3.7-4.8 6.4-9.8 15-19.3 17.3-35.2 0.6-4.7 0.2-8.9-3.1-9.5-2.5-0.4-4.1 1-6.6 0.6-3-0.8-7.8-5.9-9.4-9.1-2.3-1-5-2-8.8-2.4-2.3 0.6-5 1.5-7.7 2-4 0.6-4.2-2.9-8.9-2.6-1.9 0.3-2.8 1.9-4.8 3-0.5 0.1-1 0.1-1.5 0.2 0.2-1.7 0.5-3.7 0.1-5.7-0.3-1.6-2.1-1.1-3.8-2.2-2.7-1.4-10.3-5.2-14.2-5-3.9 0.4-6.6 5.5-9.2 9.5-0.5 1-1.9 3-2.7 3-0.6 0.1-1-1.9-1-2.5-1.7-0.1-3.4 0.4-5.5 0.4-0.2-2.4-1.3-4-3.6-5.1-1.1-0.3-3.2 0-3.1-2.4 0.8-7.3 8.5-16.8 12.6-21.8-0.1-1.9-2.7-2.2-3.9-4.5-1-2.7-3.6-10.2-3.6-13.1-3.9-0.8-8.6-8.4-12.5-8.4-0.4 0.1-1 0.1-1.5 0.1 0.1 0 0-0.4 0-0.5-2.3 0.2-6.2-1.7-7.9-2.4-1.8 0.1-4.4 0.1-6.4 0.3-6.8-1-16.8 0.2-18.8-6.8-1.1 0-3.4-0.6-3.8-1.4-3.2-6.3-5.1-5.3-10.1-10.1-2.3 0.2-4.9 0.1-7.3 0.2-1.2-3.5 0.1-7-3.5-8.1-3.9-1.1-9.4-1.8-11.3-5.5-0.1-0.5 0.1-1.5 0-2 0.7 0.3 3.2 0.1 4-0.6 0 0-4.9-0.7-7.5-0.6-0.7 0.3-6.4 0.9-6.7 1.4-2.1 3.1-4.4 3.1-8.5 3.7-1.7 0.1-5.4-0.4-5.4-2.8-4.9 0.1-9.8 0.1-14.8 0.2-1.3-0.1-3.2-2-3.3-4.6-4-0.7-10.4-2.2-11.5-6.4-1.3 0-3.7-0.1-4.9 0-0.2 3.1 4.2 1.9 5.3 4.9-1.7 0.1-4.4 0.1-6.7 0.1-2.5 1.7-6.9 1.1-7.1 5.1-0.2 3.1 3.1 4.9 3.3 8.1-0.1 0.8-1.8 4.1-2.7 4.3-3.4-0.1-4.9-5.1-4.6-7.8-0.2-1.7 1.7-6.8 2.6-10.8 0.9 0 2.8-1.1 2.9-3.2 0 0-1.5-3-2.5-3.1-3.3 0.3-4.5 3.9-8.2 5.1-7.3 2.1-11.5 3.2-18.6 5.4-3.7 1.2-6.2 1.8-7.7 6.1-0.4 1.6-1.1 5.4-2.6 6.6-1.4 0.5-4.4 1.9-4.6 4.5-0.4 0.1-1.7 0.9-1.7 1.3 0.1 0.4 0.1 1.2 0 1.6-1.4 0.6-1.3 0.4-3.5 0.1-0.6 0.4-1.6 1.4-2.2 1.8 0.4-0.5 1.5-1.6 1.9-2.1-4.6-3.3-5-10.9-13.4-11.2-7 0.1-10.6 5.2-18.3 5.4-5.1-0.1-4.9-4.7-8.1-6.3-4.7-2.1-10.5-4.2-10.8-10.3 0-5.5 0.2-10.6 0-16.2 1.8-2.6 2-13 2-15.5 0.2-1 0-3 0-4-5.2-1.1-6.9-5.5-14-5.6-10.3 0.1-18 1.6-27.8 1.6-1.3 0.1-3.4-1-3.5-2.9 0-0.3-0.1-1 0-1.3 1.4-1.1 5.2-2.6 5.3-5.3-0.2-4.4-0.1-8.6 0-12.8 0.6-0.1 1.8 0 2.4 0-0.1 0.4 0.1 1.4 0 1.9 1.8-2.6 3.5-4.4 3.5-8.8 0.1-5.2 4.9-9.8 5-13.6v-2.4c-1.3 0-5.8-0.4-6.7-0.5-0.8-0.5-3.2-1-5.8-0.8-8 0-18.2-0.2-18.5 7.6-0.1 4-4.8 7.5-6.2 10.7-0.2 0.8-1.8 4.1-4.1 4.3-0.8 0-2.3-1.6-5.5-1.6-6 0-10.4 3.6-16 3.7-1.7-0.1-2.4-2.3-4.9-3.2-7.8-2.3-7.6-6.5-12.7-11.4-1.9-1.8-5.7-5.6-6.9-7.7-1.3-2.5 0.3-3.9-0.8-6.3-0.5-0.7-2.7-3.1-2.3-5.3 0.2-4.9 0.2-9.7 0.1-14.7 0.9-4 3-5.6 3-10.6 0.1-1.2-0.7-3-1.1-4.2-0.1-0.1-0.3-0.5-0.2-0.6 0.1-0.1 0.6 0.3 0.8 0.1 0.1-0.6-1.4-2-1.4-2.6 0.3-7.8 3.7-14.8 10.2-17.1 2.9-1.1 5.4 0.8 7.8-1.4 3.6-3.1 7.4-9.5 15.9-9.8 3.3 0.1 4.9 2.6 8.1 2.5 1.3-0.1 3-2.1 4.4-2.1 5.9 0 12.5 8.6 20.8 5.1-3.5-2.2-1-4.6-0.5-8.3-1.4 0.3-1.1 0.8-4.1 0 5-1.5 11-1 15.6-2.1 0 0.6 1.4 2.1 2 2.1 1.7 0.1 3.1-2.2 7.3-2.1 7-0.1 10 6.1 15.4 6 1.9 0 3.8-3.4 6.4-3.4 12.9 0.2 9.5 15.7 14 24.3 2.3 4.3 5.1 5.7 8.8 9.7 1.6 2.7 1.5 6.4 5.8 6.6 5 0 6.3-4.9 6.3-10.5 0-4.9-2.6-7.3-3.6-10.5 0.1-0.3 0-1 0-1.3-0.3-8.4-8-10.8-8.2-19.6 0.1-19 14-20 27.6-26.4-0.2-0.1-0.6-0.4-0.8-0.5 1.3-1.1 1.3-2.2 4.8-3.2 1.7-0.2 3.7-2.4 7.1-2.9 1.2-0.1 2.6-1.9 3.3-2.7-0.8-0.5-2.5-1.5-3.4-1.8 0.1-0.5-0.1-1.5 0-2 1.9 0 3.8 0.2 4.4-2.4-1.1-0.3-2.8-0.4-4-2.3 1.1 0 3.7-0.8 3.7-3 0-0.7 0-1.9-0.1-2.5-0.4-0.3-1.5 0-2-0.1-1.3-1.2 0-1.3-0.1-3.7-0.1-2.5-1.5-7.1-1.6-8.7 0 0-0.2-2.3 0.2-3.2 0.5 2.7 3.3 6.2 3.3 8.3 0.1 0.7 0.1 2 0.1 2.7 0.1 0.3 0.8 1.5 1.1 1.5 0.6-0.2 6.1-8.8 6.2-10-0.2-1.6-2-2.5-2.6-4.7 0.4-0.3 1.1-0.8 1.4-1.2 0.4 0.4 1.4 2 2 2 1.5-0.1 7-8.5 7.5-10.3 0 0-2.6-2-2.6-3-0.3-0.5 1-1.3 1.6-1.7 0.6 0.1 1.9 0.2 2.5 0.3 4.1-0.3 6.6 0.3 10.5-0.9-1.4-1.1-4.4 0-6.9-0.3-0.7-0.1-2.1-0.2-2.8-0.1 5.5-3 14.7-1.3 20.1-4.5 0.8 0.8 5.6 0.4 9-0.3-0.1-0.4-0.1-1.2-0.1-1.7 0 0-2.5 1.5-3 1.5-1.3 0-2.9-3.4-2.9-4.4-0.6-0.2-1.1-1.6-1.2-2.2-0.1-9.4 9.5-6 13.9-9.6 2.6-1 2.8-1.5 6.1-1.3 3.7 0.3 6.5-1.1 8.3-3.4-0.4-0.3-0.9-1.3-1.3-1.7 0 0 0-0.6-0.2-0.7v-0.7c0.4 0.1 2 0.1 2.6 0.2 1.3 0 8.2 1.3 10.5 0.2 2.3-1.4 2-4.1 5.9-4.1 0.3 3.1 0 3.3 4.2 3.7-6.1-0.1-15 3.1-14.8 8.1 0.2 1.8 4.1 5.9 5.6 6.1 1.7-0.1 6.5-5.6 11.6-6.8 1.1 0 17.9-4.7 18.2-6.5-0.4-2.3-6.6-3.2-8.4-3.4-7.4-0.7-19.3-7.8-20.2-13.3-1.4-0.3-3.7-0.9-5.6-1 1.4-1.7 10.4-1.9 10.3-6.5-0.5-3.9-8.1-4-13.7-4.4-11.6-0.7-16.1 5.5-24.1 6.1 3.2-5.8 8.6-3.7 14.2-7.9 3.6-3 0.5-5 6-6.1 9.6-1.8 15.1 0.1 25 1 12.8 1.1 22.6 6.4 29.4-0.9 3.1-3.4 21.2-0.9 20.8-6-0.5-3.8-2.4-5.6-5-8.1-1.7-0.3 0.7-1.3-2.2-2.6 0-0.6-0.3-1.3-0.3-1.9-5.2 1.3-16.1 2.4-22.1 1.9-0.6 0.1-2.3-0.6-2.5-0.9 4.6-1.1 17.4-0.6 18.8-3.5 0-0.8-1.9-1.3-2.3-2-5.9-0.3-17.9-3.4-18.8-8.7-0.1-0.1-0.1-0.3-0.1-0.3-5.4-0.8-8.8-3.3-12.1-5.1 1.1-0.4 3.4-0.5 3.3-2.4-0.1-1.5-2.4-3-2.2-4.4-2.4-0.8-10.6-4.5-8.8-7.2 2-3.3-8-5-9.6-9.1-0.6-0.1-3.6-1.7-4.4-2.3-1.6 0.6-6 1.6-5.2 3.5 1.5 3.3-2.8 3.5-7.2 4.9-3 1-5.2 3.2-7.9 3-4.5-0.4-8.2-5.4-11.2-5.9-4.2-0.5-2.7-7.2-3.7-10.6-1.7-4.1-14.4-2.5-15.3-7.7-7.2-1.1-6.4-3.7-13.7-4.2-1.5-0.2-3.7-0.3-5.6-0.4-7.5-0.5-12-3.1-19.5-3.5-3.9-0.2-7.7 0.6-7.6 3.2 0.2 1.5 9.5 3.8 1.1 6.6-3.4 1 4.9 4.9 5.6 6.9 1.1 4.8-6.1 5.4-9.6 5.9 3.7 3.3 10.6 4.4 13.9 7.3 2.6 2.6 1.1 6.7 1.3 11.6-0.2 2.9-15.5 9.3-21 10 9.7 3.3 6.2 11.7 10 14.9-0.9 0.9-3.8 4.4-4 6.1-3.4 0.2-6.2 1-8.9-0.4-6.9-3.6-16.9-9.9-17.2-14.4-0.2-4.8 0.1-8.7-7.7-11.5-5.7-1.2-11.4-2-17.2-2.9-10.2-3.8-21.2-6.5-33.2-8.7-1.7-0.4-8.2-2.7-12-2.7-4.1 0.2-6 2.4-10 2.4-0.2-3.4-3.9-11.1-9.8-11.2-2.7 0.2-4 1.3-6.7 1.7 1-1.6 0-2.4 0.3-6.4 0.3-5.8 4-11 10.3-14.4 2.2-1.6 6.9-6.5 8.9-7 4.5-0.9 8.6 2 8.8-1.3-0.1-2.2-9.9-1.9-13.5-2.8 1.9 0.3-5.9-2.4 15.6 0.6 5.6 0.4 2.2-2.8 5.4-2.9 1.6-0.1 3.7-0.2 5.7-0.1 6.5-0.1 9.7-3.4 13.9-4.9v-1.9c-8.9-1.1-17.4-0.2-21.4-3.9 1.3-0.1 3.4-0.2 4.6-0.1 3.3 0.7 6.5 2.7 11.6 2.8 4.2-0.2 13.4-0.9 13.7-2.4-0.1-2.4-0.6-3.4-1.1-3.8 5.1 0.3 7.2 2.4 10.6 2.6 2.9-0.2 5.6 0.2 8.6 0.2-1.2-0.6-0.3-2.9 3.1-0.6 1.8 1.3 14.4-3.8 14.7-5.5-0.2-1.2-5.8-2.3-6-3.2 0-0.6-1.3-1.6 0-2.7 2.9-0.1 5.7-0.5 8.6-0.5 10.2 0 20.2 0.8 30.2 1.5 0.3 0.1 1.3 1.1 2.1 1.3 3.3 0 4.7-0.9 7.8-0.7 5.1 0.6 21.2 6.5 21.7 9.2 0.2 1.6-4.8 3.1-7 4-1.7 0.2-6.1-0.7-6.1 1.1 0 0.9 3.7 2.1 4.7 2.5-3.1 0.4-9 0.8-11.2 0.7-3.8-0.3-7.2-0.6-10.9-0.7-3.5-0.4-9.9 1.1-10 2.3 0.2 1.6 8.2 3.4 11.1 3.6 3 0.3 4.4-1.2 7.5-1.1 1.9 0.2 1.7 0.8 4.4 1 1.9 0.2 3.7-0.6 4.9-1.2 7.5 2.3 11.6 4.6 20 7-3.7 3.2 10.9 4.5 17.2 6.5 6.5 2.2 10.8 2.2 18.3 4.4 0.6 0.3 1.6 1.5 2.6 1.6 0.8 0.1 2.3-0.3 2.3-1.1-0.8-3.1-14.3-6.7-18.8-9.6 1 0.4 2.6 0.3 3.7 0.4 2.8 1.8 18.6 6.3 23.2 6.9 0.9-1.2 3.1-2.7 3-3.8-0.3-1.2-4.5-2.2-4.6-3-0.2-0.7-0.3-1.4-0.3-2.1-1.2 0.1-2.9-0.4-4.1-0.5-0.7-1.9-2.2-1-6.9-2.1-1.6-0.7-5.1-3.2-5.8-4.6-0.9-0.1-2.3-0.2-3.2-0.4 0-0.6 0-1-0.2-1.6 0.8 0.4 2.2 0.5 3.6 0.4-0.1-0.4 0-0.8-0.2-1.2-1.9-0.2-2.6-0.1-4.9-0.8 0.2-0.1 3.1-0.8 4.7-0.6 11.9 1.5 12.9 8.3 24.9 10.1 2.7 0.3 2.8-1.2 2.6-2.5 4.5 0.5 5-0.2 5-0.5-0.1-0.5-0.3-0.8-0.3-1.3 2.5 0.4 5.2 0.5 6-0.4 9.2 3.4 18.3 7.1 27.2 11.1 0.4 0.3 1.1 0.7 2 0.9 4.8 2.3 9.6 4.5 14.4 7-1.5-0.6-3-1.2-4.7-1.5-1.8-0.5-1.7-0.5-3.7-0.8 1.3 2.2 11.6 5.3 18.8 7.6 1.1 0.6 2.1 1.3 3.2 2-1.3 1.3-3 1.8-3.6 4-3-1.4-2.9-1.2-5.6-1.1 0.1 0 0 0.1 0 0.1-3.9 0.7-4.5 2.2-7 3.4 0.1 0.9 0.3 1.4 0.5 2.2 1.4-0.1 2.6 0.3 4.2 0.9-0.4 1.2-1.8 0.9-1.5 2 0.5 2.6 6.5 4.7 8.1 6.9 0.9 1 2 3.2 2.8 3.7 3.9 1.8 4-0.6 7.7 1.9-1.6 0.3-3-0.1-2.6 1.2 0.6 3.1 8.9 10.9 13.6 13.4 0.5 0.4 0.7 1.6 1.9 2.3 3.7 1.7 5.1 1.6 7.2 4.3 2.3 0.5 5.2-0.1 7.9 0.6 4.9 1.4 5.6 5.5 10.3 6.9 1.2 0.1 1.4-0.3 3.6 0.2 0.3 0.7 1.2 1.1 2.5 1.6 5 1.1 1.4-4.4 5.4-4.4-0.7-1.1-1-3.8-1.5-5.4-0.7-2.6 4.8-1.8 6.3-3.2 56.9 47.4 100.2 110.4 123.8 182.2-0.2 0.2-0.5 0.3-0.6 0.5-6 11.1-10.6 23.8-14 38.1-1.4 5.3-9.3 9.4-9.1 17.1 2.4 14.6 10.7 26.5 10.8 43 0.3 9.3-6.6 26.8-15.2 31.3 2.1 5.2 8.5 12.2 9 17.4-0.2 3.1 1.1 6.1 1.1 11.8h-1c2.3 2.5 2.3 2.8 4.4 5 0.1 1.4 16.3 17.6 18.8 19.4 4.4 4.4 6.4 9.5 8.4 15.2-28.6 147.9-138.6 266.6-281.3 307.8zM632 132c-0.5-0.1-0.6 0-1.3-0.1-1.4-0.2-2.2-0.7-3.1-1.2 1.5 0.4 3 0.8 4.4 1.3z m0 0%22/> </svg>");
}

#maga-better-icon-switch {
    background-repeat: no-repeat;
    background-position: center;
    background-image: url("data:image/svg+xml;charset=utf8,<svg width=%2230%22 height=%2230%22 class=%22icon%22 viewBox=%220 0 1024 1024%22 version=%221.1%22 xmlns=%22http://www.w3.org/2000/svg%22> <path fill=%22%23FAFAFA%22 d=%22M208.5 284.93c-37.07 19.34-41.73 51.05-43.29 63.69-0.09 0.68 0 2.25-0.08 2.9a117.17 117.17 0 0 0 0.13 16.09l0.13 2.1v285.85l-0.13 1.06a116.39 116.39 0 0 0-0.2 15.77v2.12c1.16 14.2 6.55 45 42.81 64.23l0.88 0.47 0.47 0.25 256.7 148.22c0.05 0 9.64 6.14 17 8.62 0.24 0.08 0.76 0.39 1 0.47a89.08 89.08 0 0 0 27 5.66 80.57 80.57 0 0 0 8.49-0.11 100 100 0 0 0 35.84-9.46L811.41 745.8c6.92-5.16 41.85-33.35 47.92-65 0.85-3.25 1.32-11.21 1.32-14.61L860.28 512l0.51-154.31c0-3.43-0.47-11.46-1.33-14.75-6.07-31.55-40.75-59.58-47.74-64.78L556 131.14a99.8 99.8 0 0 0-35.49-9.45c-3-0.18-5.92-0.21-8.78-0.11-11.66 0.61-20.55 3.72-25.33 5.2-0.53 0.16-1.66 0.77-2.16 0.94-7.34 2.46-16.87 8.54-16.94 8.6l-1.34 0.87z m-19.15-35.79l251.83-144.48c0.92-0.62 11.44-6.74 13.64-7.78a121.67 121.67 0 0 1 55.37-15.95c2.2-0.08 4.43-0.11 6.7-0.07 19.05 0.32 38.28 5 57.14 13.92l1.46 0.76 258.57 148.75 1.26 0.9c8.35 6.12 63.23 48.18 65.77 103.58 0.18 1.42 0.25 10.93 0.25 12.41l-0.5 150.9 0.37 150.47c0 1.51-0.08 11.27-0.27 12.73-2.6 55.07-57 96.93-65.83 103.43-0.51 0.38-1.41 1-1.53 1.07l-1 0.64S573.75 929 573.32 929.22c-18.88 8.89-38.13 13.57-57.29 13.9-2.3 0-4.57 0-6.81-0.07a123.52 123.52 0 0 1-55.73-15.91c-2.27-1.06-13-7.31-13.88-7.91L189.34 774.79c-58.85-30.95-67.12-85.91-64.67-112.48 0-2 0.06-12 0.15-13V374.76c-0.09-1-0.19-11.07-0.15-13.08-2.45-26.6 5.83-81.57 64.68-112.54z%22/> <path fill=%22%23FAFAFA%22 d=%22M163.7 603.25a20.31 20.31 0 0 1-20.28 20.31 20.32 20.32 0 0 1-20.29-20.31V436a20.3 20.3 0 0 1 20.29-20.31A20.29 20.29 0 0 1 163.7 436zM888.74 603.25a20.31 20.31 0 0 1-20.28 20.31 20.31 20.31 0 0 1-20.29-20.31V436a20.29 20.29 0 0 1 20.29-20.31A20.29 20.29 0 0 1 888.74 436zM627.12 894a20.24 20.24 0 0 1-27.72-7.41 20.29 20.29 0 0 1 7.43-27.7l144.84-83.74a20.27 20.27 0 0 1 27.7 7.38 20.3 20.3 0 0 1-7.4 27.72zM506 873.48c-29 0-47.07-13.33-47.82-13.88L235 730.34c-56.67-29.61-46-86.53-45.92-87.1V390.41c-0.07-0.05-10.7-57 46.07-86.67l223.69-129.4c0.48-0.37 18.48-13.7 47.44-13.7 14.85 0 29.92 3.53 44.81 10.57L773 298.8c2.28 1.6 51.48 36.94 51.48 81.42l-0.42 136.84 0.38 136.81c0 44.47-49.25 79.84-51.34 81.3l-222 127.65c-15.1 7.12-30.22 10.66-45.1 10.66z m0.24-707.82c-27.28 0-44.47 12.76-44.64 12.9l-224 129.63c-53.42 27.93-43.92 79.52-43.48 81.71v253.8c-0.47 2.7-10 54.3 43.37 82.16L461 855.38c0.42 0.31 17.8 13.07 45 13.07 14.13 0 28.5-3.42 42.71-10.11l221.65-127.42c0.29-0.2 49-35.2 49-77L819 517.06l0.44-136.84c0-41.86-48.68-76.83-49.17-77.17L548.72 175.69c-14.02-6.61-28.4-10.03-42.47-10.03z%22/> <path fill=%22%23FAFAFA%22 d=%22M612.26 330.11H411.75A71.84 71.84 0 0 0 340 401.87v7.39A71.84 71.84 0 0 0 411.75 481h200.51A71.84 71.84 0 0 0 684 409.26v-7.39a71.84 71.84 0 0 0-71.74-71.76z m-3.17 126.64c-28.49 0-50.65-22.17-50.65-50.66s22.16-50.66 50.65-50.66 50.65 22.17 50.65 50.66-22.16 50.66-50.65 50.66zM612.25 543h-200.5A71.85 71.85 0 0 0 340 614.74v7.39a71.84 71.84 0 0 0 71.77 71.76h200.5A71.84 71.84 0 0 0 684 622.13v-7.39A71.84 71.84 0 0 0 612.25 543zM414.91 669.62c-28.49 0-50.65-22.16-50.65-50.66s22.16-50.65 50.65-50.65 50.66 22.16 50.66 50.65-22.16 50.66-50.66 50.66z%22/> </svg>");
}

#maga-better-icon-more {
    background-repeat: no-repeat;
    background-position: center;
    background-image: url("data:image/svg+xml;charset=utf8,<svg width=%2230%22 height=%2230%22 class=%22icon%22 viewBox=%220 0 1024 1024%22 version=%221.1%22 xmlns=%22http://www.w3.org/2000/svg%22> <path d=%22M411.733333 232.533333v206.933334H200.533333c-44.8-2.133333-81.066667-40.533333-81.066666-85.333334s36.266667-83.2 81.066666-85.333333h4.266667c21.333333 0 42.666667 8.533333 57.6 21.333333-12.8-14.933333-21.333333-34.133333-21.333333-57.6v-4.266666c2.133333-44.8 40.533333-81.066667 85.333333-81.066667s83.2 36.266667 85.333333 81.066667v4.266666z%22 fill=%22%23FAFAFA%22></path> <path d=%22M433.066667 460.8h-234.666667c-55.466667-4.266667-100.266667-49.066667-100.266667-106.666667s44.8-102.4 100.266667-106.666666h21.333333v-14.933334-6.4c4.266667-55.466667 49.066667-100.266667 106.666667-100.266666s104.533333 44.8 106.666667 100.266666v234.666667z m-228.266667-170.666667h-4.266667c-34.133333 2.133333-59.733333 29.866667-59.733333 64s25.6 61.866667 59.733333 64H390.4v-185.6-4.266666c-2.133333-34.133333-29.866667-59.733333-64-59.733334s-61.866667 25.6-64 59.733334v4.266666c0 14.933333 6.4 32 17.066667 42.666667l-29.866667 29.866667c-12.8-10.666667-29.866667-14.933333-44.8-14.933334z%22 fill=%22%23FAFAFA%22></path> <path d=%22M612.266667 791.466667v-206.933334H823.466667c44.8 2.133333 81.066667 40.533333 81.066666 85.333334s-36.266667 83.2-81.066666 85.333333h-4.266667c-21.333333 0-42.666667-8.533333-57.6-21.333333 12.8 14.933333 21.333333 34.133333 21.333333 57.6v4.266666c-2.133333 44.8-40.533333 81.066667-85.333333 81.066667s-83.2-36.266667-85.333333-81.066667v-4.266666z%22 fill=%22%23FAFAFA%22></path> <path d=%22M697.6 898.133333c-57.6 0-104.533333-44.8-106.666667-100.266666v-234.666667h234.666667c55.466667 4.266667 100.266667 49.066667 100.266667 106.666667s-44.8 102.4-100.266667 106.666666h-21.333333v21.333334c-2.133333 55.466667-49.066667 100.266667-106.666667 100.266666z m-64-292.266666V795.733333c2.133333 34.133333 29.866667 59.733333 64 59.733334s61.866667-25.6 64-59.733334v-4.266666c0-14.933333-6.4-32-17.066667-42.666667l29.866667-29.866667c12.8 10.666667 29.866667 17.066667 46.933333 17.066667 34.133333-2.133333 59.733333-29.866667 59.733334-64s-25.6-61.866667-59.733334-64H633.6z%22 fill=%22%23FAFAFA%22></path> <path d=%22M411.733333 791.466667v-206.933334H200.533333c-44.8 2.133333-81.066667 40.533333-81.066666 85.333334s36.266667 83.2 81.066666 85.333333h4.266667c21.333333 0 42.666667-8.533333 57.6-21.333333-12.8 14.933333-21.333333 34.133333-21.333333 57.6v4.266666c2.133333 44.8 40.533333 81.066667 85.333333 81.066667s83.2-36.266667 85.333333-81.066667v-4.266666z%22 fill=%22%23FAFAFA%22></path> <path d=%22M326.4 898.133333c-57.6 0-102.4-44.8-106.666667-100.266666v-6.4-14.933334c-6.4 0-14.933333 2.133333-21.333333 0-55.466667-4.266667-100.266667-49.066667-100.266667-106.666666s44.8-104.533333 100.266667-106.666667h234.666667v234.666667c-4.266667 55.466667-51.2 100.266667-106.666667 100.266666z m-78.933333-179.2l29.866666 29.866667c-10.666667 12.8-17.066667 27.733333-17.066666 42.666667v4.266666c2.133333 34.133333 29.866667 59.733333 64 59.733334s61.866667-25.6 64-59.733334V605.866667H200.533333c-34.133333 2.133333-59.733333 29.866667-59.733333 64s25.6 61.866667 59.733333 64h4.266667c14.933333 0 32-4.266667 42.666667-14.933334z%22 fill=%22%23FAFAFA%22></path> <path d=%22M612.266667 232.533333v206.933334H823.466667c44.8-2.133333 81.066667-40.533333 81.066666-85.333334s-36.266667-83.2-81.066666-85.333333h-4.266667c-21.333333 0-42.666667 8.533333-57.6 21.333333 12.8-14.933333 21.333333-34.133333 21.333333-57.6v-4.266666c-2.133333-44.8-40.533333-81.066667-85.333333-81.066667s-83.2 36.266667-85.333333 81.066667v4.266666z%22 fill=%22%23FAFAFA%22></path> <path d=%22M819.2 460.8H590.933333V232.533333v-6.4c4.266667-55.466667 49.066667-100.266667 106.666667-100.266666s102.4 44.8 106.666667 100.266666v21.333334c6.4 0 14.933333-2.133333 21.333333 0 55.466667 4.266667 100.266667 49.066667 100.266667 106.666666s-44.8 102.4-100.266667 106.666667h-6.4z m-185.6-42.666667H823.466667c34.133333-2.133333 59.733333-29.866667 59.733333-64s-25.6-61.866667-59.733333-64h-4.266667c-14.933333 0-32 6.4-42.666667 17.066667L746.666667 275.2c10.666667-12.8 17.066667-27.733333 17.066666-42.666667v-4.266666c-2.133333-34.133333-29.866667-59.733333-64-59.733334s-61.866667 25.6-64 59.733334V418.133333z%22 fill=%22%23FAFAFA%22></path> </svg>");
}



`;
 let KEY_QRCODE_URL = 'https://qun.qq.com/qrcode/index?data=';
    /*这里的ID若改变记得同步到optimize-search中，否则会导致设置模块失效*/
   
    let KEY_QRCODE_SWITCH = 'maga-qrcode-url-key-switch';
    let runType = 'alone';

    const website$6 = {
        setRunType: function (val) {
            runType = val || 'alone';
        },
        init: function ($j) {

            GM_addStyle(GM_getResourceText('toastr_css'));

            function getQrLayout() {
                if ($j('#maga-qrcode-dialog').length !== 0) {
                    return
                }
                $j(`<div id='maga-qrcode-dialog'>
                                <a id="maga-qrcode-dialog-close" href="javascript:;">&nbsp;✕&nbsp;</a>
                                <a id="maga-qrcode-dialog-qrcode" target="_blank"></a>
                                <span id="maga-qrcode-dialog-hint">请用手机扫描二维码</span>
                            </div>`,
                ).appendTo($j('body'));
                $j('#maga-qrcode-dialog').css('display', 'flex');
                $j('#maga-qrcode-dialog').click(function () {
                    $j('#maga-qrcode-dialog').css('display', 'none');
                });
            }

            function generateQRCode(qrcodeText) {
                // GM_log('qrcodeText==================>' + qrcodeText)
                getQrLayout();
                $j('#maga-qrcode-dialog-qrcode').attr('style', `background-image:url('${KEY_QRCODE_URL}${encodeURIComponent(qrcodeText)}');`);
            }

            function getSelect() {
                if (window.getSelection) {
                    return window.getSelection().toString()
                } else {
                    return document.selection.createRange().text
                }
            }

            function checkUrlFormat(string) {
                return /^(https?:)?\/\/(\S+\.)+\S{2,}$/i.test(string)
            }

            // 按住CTRL键，右键点击图片或超级链接，即可查看该图片或链接的地址的二维码;
            $j(document).contextmenu(function (e) {
                if (e.ctrlKey) {
                    var target = e.target;
                    //找出选中的内容是否存在超链接
                    if (!/^(a|img)$/i.test(target.tagName)) {
                        while (!/^(body|html)$/i.test(target.tagName)) {
                            target = target.parentNode;
                            if (/^(a|img)$/i.test(target.tagName)) {
                                break
                            }
                        }
                    }

                    if (checkUrlFormat(target.href)) {
                        if (target.tagName === 'A') {
                            generateQRCode(target.href);
                        } else if (target.tagName === 'IMG') {
                            generateQRCode(target.src);
                        }
                    }
                }
            });

            $j(document).keyup(function (e) {
                // GM_log('e.key================' + e.key)
                if (e.key === 'Escape') {
                    if ($j('#maga-qrcode-dialog').length === 0) {
                        return
                    }
                    // ESC关闭二维码弹窗
                    $j('#maga-qrcode-dialog').css('display', 'none');
                }
                if (e.ctrlKey && e.key === 'q') {
                    // 划词按Ctrl + Q 转化为二维码
                    if ($j('#maga-qrcode-dialog').length === 0) {
                        let selectText = getSelect();
                        if (selectText && selectText.length > 0) {
                            generateQRCode(selectText);
                        } else {
                            generateQRCode(location.href);
                        }
                    } else if ($j('#maga-qrcode-dialog').css('display') === 'flex') {
                        $j('#maga-qrcode-dialog').css('display', 'none');
                    } else {
                        $j('#maga-qrcode-dialog').css('display', 'flex');
                    }
                }
            });
            // 点击菜单栏里的“查看二维码”就可以查看当前页面的二维码(快捷键:Ctrl + Q );
            GM_registerMenuCommand('查看二维码', () => {
                if ($j('#maga-qrcode-dialog').length === 0) {
                    let selectText = getSelect();
                    if (selectText && selectText.length > 0) {
                        generateQRCode(selectText);
                    } else {
                        generateQRCode(location.href);
                    }
                } else if ($j('#maga-qrcode-dialog').css('display') === 'flex') {
                    $j('#maga-qrcode-dialog').css('display', 'none');
                } else {
                    $j('#maga-qrcode-dialog').css('display', 'flex');
                }
            });

            function createQrCode() {

                if ($j('#maga-qrcode-static').length == 0) {
                    let qrCode = document.createElement('div');
                    qrCode.id = 'maga-qrcode-static';
                    document.getElementsByTagName('body')[0].appendChild(qrCode);
                }
                let display = `display: ${GM_getValue(KEY_QRCODE_SWITCH, true) ? 'block' : 'none'};`;
                $j('#maga-qrcode-static').hover(function () {
                    this.className = 'maga-qrcode-static maga-qrcode-static-image';
                    this.style = display + `background-image:url('${KEY_QRCODE_URL}${encodeURIComponent(location.href)}');`;
                }, function () {
                    this.className = 'maga-qrcode-static';
                    this.style = display;
                });
                $j('#maga-qrcode-static').attr('class', 'maga-qrcode-static');
                $j('#maga-qrcode-static').attr('style', display);
            }

            setTimeout(function () {
                createQrCode();
            }, 200);
            if (runType === 'alone') {
                GM_registerMenuCommand('二维码工具开关', function () {
                    GM_setValue(KEY_QRCODE_SWITCH, !GM_getValue(KEY_QRCODE_SWITCH, true));
                    if (GM_getValue(KEY_QRCODE_SWITCH, true)) {
                        toastr.success('二维码工具已开启！');
                    } else {
                        toastr.error('二维码工具已关闭！');
                    }
                    createQrCode();
                });
            }
        },
    };

    const modules$1 = [website$6];

    const prepare$1 = {
        init: function ($j, runType) {
            if (GUtils.inIframe()) {
                return
            }
            GM_addStyle(CSS_STR);
            for (let i = 0; i < modules$1.length; i++) {
                let module = modules$1[i];
                module.setRunType((typeof runType === 'undefined') ? 'alone' : runType);
                module.init($j);
            }
        }
    };

    var CSS_STR = `
.maga-qrcode-static {
    display: block;
    position: fixed;

    width: 40px;
    height: 40px;

    bottom: 140px;
    right: 10px;
    cursor: pointer;
    transition: 0.4s all;
    background-color: #FFFFFF;
    background-position: center;
    background-repeat: no-repeat;
    background-size: 70%;
    box-shadow: 0 0 2px #999999;
    border-radius: 1px;
    z-index: 9999999;
    background-image: url("data:image/svg+xml;charset=utf8,<svg class=%22icon%22 viewBox=%220 0 1024 1024%22 version=%221.1%22 xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22><path d=%22M126.160164 820.041068h77.798768v77.798768H126.160164z m126.160165-48.361397V946.201232H77.798768v-174.521561z m7.359342-77.798768h-189.240246A70.439425 70.439425 0 0 0 0 764.320329v189.240246a70.439425 70.439425 0 0 0 70.439425 70.439425h189.240246a70.439425 70.439425 0 0 0 70.439426-70.439425v-189.240246a70.439425 70.439425 0 0 0-70.439426-70.439426z m560.361397 126.160165h77.798768v77.798768H820.041068z m126.160164-48.361397V946.201232h-174.521561v-174.521561z m7.359343-77.798768h-189.240246a70.439425 70.439425 0 0 0-70.439426 70.439426v189.240246a70.439425 70.439425 0 0 0 70.439426 70.439425h189.240246a70.439425 70.439425 0 0 0 70.439425-70.439425v-189.240246a70.439425 70.439425 0 0 0-70.439425-70.439426zM820.041068 126.160164h77.798768v77.798768H820.041068z m126.160164-48.361396V252.320329h-174.521561V77.798768zM953.560575 0h-189.240246a70.439425 70.439425 0 0 0-70.439426 70.439425v189.240246a70.439425 70.439425 0 0 0 70.439426 70.439426h189.240246a70.439425 70.439425 0 0 0 70.439425-70.439426v-189.240246A70.439425 70.439425 0 0 0 953.560575 0zM126.160164 126.160164h77.798768v77.798768H126.160164z m-48.361396 126.160165V77.798768H252.320329V252.320329z m-7.359343 77.798768h189.240246a70.439425 70.439425 0 0 0 70.439426-70.439426v-189.240246A70.439425 70.439425 0 0 0 259.679671 0h-189.240246A70.439425 70.439425 0 0 0 0 70.439425v189.240246a70.439425 70.439425 0 0 0 70.439425 70.439426zM0 567.720739h77.798768v77.798768H0zM456.279261 630.800821H378.480493v203.958933h63.080082v48.361396H378.480493v77.798768h126.160164v63.080082h77.798768v-63.080082h63.080082V883.12115H567.720739V946.201232h-48.361396v-111.441478h126.160164V756.960986h-189.240246z m504.640657-252.320328H883.12115v126.160164h-111.441479V378.480493h-189.240246V252.320329h-63.080082v-48.361397h63.080082v-63.080082h63.080082V63.080082h-63.080082V0H378.480493v77.798768h126.160164v48.361396H441.560575v140.87885h63.080082V378.480493H441.560575v63.080082H330.119097V378.480493H252.320329v63.080082h-48.361397V378.480493H63.080082v63.080082H0v77.798768h77.798768v-63.080082H189.240246v63.080082h63.080083v126.160164h77.798768v-126.160164h126.160164v-63.080082h237.601642v48.361396H504.640657v77.798768h63.080082v126.160164h140.87885V630.800821h-63.080082v-48.361396h252.320329v-63.080082H946.201232v63.080082h77.798768V504.640657h-63.080082z%22 fill=%22%232C2C2C%22></path></svg>");
}

.maga-qrcode-static-image {
    width: 160px;
    height: 160px;
    background-size: 100%;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.15);
    border-radius: 4px;
}

#maga-qrcode-dialog {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.15);
    z-index: 999999;
    position: fixed;
    padding: 10px 14px;
    font-family: Arial, serif;
    background: #FFFFFF;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

#maga-qrcode-dialog-qrcode {
    padding: 20px;
    text-decoration: none !important;
    background-position: center;
    background-repeat: no-repeat;
    width: 140px;
    height: 140px;
}

#maga-qrcode-dialog-close {
    font-size: 14px;
    color: gray;
    line-height: 22px;
    text-align: center;
    align-self: flex-end;
    text-decoration: none !important;
}

#maga-qrcode-dialog-hint {
    font-size: 14px;
    color: gray;
}
`;


    const prepares = [

        prepare$2,
        prepare$1,
      
    ];

    (function () {
        var jq = jQuery.noConflict();
        for (let i = 0; i < prepares.length; i++) {
            let prepare = prepares[i];
            prepare.init(jq, 'complex');
        }
    })();

})();

