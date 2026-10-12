const fs = require('fs');
const ts = require('typescript');
const file = 'src/components/CollegeDetailScreen.tsx';
const content = fs.readFileSync(file, 'utf8');

const program = ts.createProgram([file], { jsx: ts.JsxEmit.React });
const diagnostics = ts.getPreEmitDiagnostics(program);

diagnostics.forEach(diagnostic => {
  if (diagnostic.file) {
    const { line, character } = ts.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start);
    const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
    console.log(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
  } else {
    console.log(ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'));
  }
});
