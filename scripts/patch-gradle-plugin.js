// Patch for __dirname compatibility in both CommonJS and ES modules
let __dirname = typeof __dirname !== 'undefined' ? __dirname : undefined;
if (!__dirname) {
  const { fileURLToPath } = require('url');
  const { dirname } = require('path');
  const __filename = fileURLToPath(import.meta.url);
  __dirname = dirname(__filename);
}

const fs = require('fs');
const path = require('path');

const gradlePluginPath = path.join(__dirname, '../node_modules/react-native/node_modules/@react-native/gradle-plugin/build.gradle.kts');

if (fs.existsSync(gradlePluginPath)) {
  let content = fs.readFileSync(gradlePluginPath, 'utf8');
  // Comment out the import line
  content = content.replace(/^(import org\.gradle\.configurationcache\.extensions\.serviceOf)/m, '// $1');
  // Comment out the testRuntimeOnly block using serviceOf
  content = content.replace(/testRuntimeOnly\([\s\S]*?serviceOf<ModuleRegistry>\(\)[\s\S]*?first\(\)\)[\s\S]*?\)/gm, match => match.split('\n').map(line => '// ' + line).join('\n'));
  // Comment out any remaining direct uses of serviceOf
  content = content.replace(/^(\s*)(serviceOf<ModuleRegistry>\(\))/gm, '$1// $2');
  fs.writeFileSync(gradlePluginPath, content, 'utf8');
  console.log('Patched build.gradle.kts to comment out serviceOf references.');
} else {
  console.log('No build.gradle.kts found to patch.');
} 