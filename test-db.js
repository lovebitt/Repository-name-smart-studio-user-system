const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
console.log('数据库路径:', dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('连接数据库失败:', err.message);
    return;
  }
  console.log('成功连接到数据库');
  
  // 检查表
  db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
    if (err) {
      console.error('查询表失败:', err.message);
      return;
    }
    
    console.log('\n数据库中的表:');
    tables.forEach(table => {
      console.log(`- ${table.name}`);
    });
    
    if (tables.length === 0) {
      console.log('数据库为空，需要运行迁移');
    } else {
      // 检查每个表的数据
      tables.forEach(table => {
        db.all(`SELECT COUNT(*) as count FROM ${table.name}`, (err, result) => {
          if (!err) {
            console.log(`${table.name}: ${result[0].count} 条记录`);
          }
        });
      });
    }
    
    db.close();
  });
});