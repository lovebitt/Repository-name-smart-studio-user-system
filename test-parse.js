const fs = require('fs');
const path = require('path');

const promptLibraryPath = path.join(__dirname, '../即梦Seedance2.0_提示词库.md');

console.log('📚 测试解析提示词库...');
console.log('文件路径:', promptLibraryPath);

if (!fs.existsSync(promptLibraryPath)) {
  console.error('❌ 文件不存在');
  process.exit(1);
}

const content = fs.readFileSync(promptLibraryPath, 'utf8');
const lines = content.split('\n');

console.log(`文件行数: ${lines.length}`);

// 简单统计
let categoryCount = 0;
let subcategoryCount = 0;
let promptCount = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  
  if (line.startsWith('## ')) {
    categoryCount++;
    console.log(`发现类别: ${line}`);
  } else if (line.startsWith('### ')) {
    subcategoryCount++;
  } else if (line.startsWith('- ') || line.startsWith('* ')) {
    promptCount++;
    
    // 显示前5个提示词
    if (promptCount <= 5) {
      console.log(`提示词 ${promptCount}: ${line.substring(0, 100)}...`);
    }
  }
}

console.log('\n📊 统计结果:');
console.log(`类别数量: ${categoryCount}`);
console.log(`子类别数量: ${subcategoryCount}`);
console.log(`提示词数量: ${promptCount}`);

// 显示文件前100行
console.log('\n📝 文件前100行预览:');
for (let i = 0; i < Math.min(100, lines.length); i++) {
  console.log(`${i + 1}: ${lines[i]}`);
}