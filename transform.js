// transform.js
const fs = require("fs");
const esprima = require("esprima");
const estraverse = require("estraverse");
const escodegen = require("escodegen");

// 1. 读源文件
const inputFile = process.argv[2] || "input.js";
if (!fs.existsSync(inputFile)) {
  console.error(`❌ File not found: ${inputFile}`);
  process.exit(1);
}
const code = fs.readFileSync(inputFile, "utf8");

// 2. parse 成 AST
const ast = esprima.parseScript(code, { range: true, loc: true });

// 3. 遍历并做变换
estraverse.replace(ast, {
  enter: function (node, parent) {
    // 重命名以 _0x 开头的标识符
    if (node.type === "Identifier" && node.name.startsWith("_0x")) {
      node.name = "var_" + node.name.substring(3);
    }

    // 替换 console.log -> console.info
    if (
      node.type === "CallExpression" &&
      node.callee.type === "MemberExpression" &&
      node.callee.object.type === "Identifier" &&
      node.callee.object.name === "console" &&
      node.callee.property.type === "Identifier" &&
      node.callee.property.name === "log"
    ) {
      node.callee.property.name = "info";
    }

    return node;
  },
});

// 4. 生成代码
const output = escodegen.generate(ast, {
  format: { indent: { style: "  " } },
});
fs.writeFileSync("output.js", output, "utf8");
console.log("✅ Transformed code written to output.js");