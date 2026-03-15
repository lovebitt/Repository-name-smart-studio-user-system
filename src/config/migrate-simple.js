const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, '../../database.sqlite');

// 删除旧的数据库文件（如果存在）
if (fs.existsSync(DB_PATH)) {
  fs.unlinkSync(DB_PATH);
  console.log('🗑️  删除旧的数据库文件');
}

// 创建新的数据库连接
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('❌ 数据库连接失败:', err.message);
    process.exit(1);
  }
  console.log('✅ 成功创建数据库连接');
});

// 启用外键
db.run('PRAGMA foreign_keys = ON');

// 使用串行执行确保顺序
db.serialize(() => {
  console.log('\n📊 开始创建数据库表...');

  // 1. 导演身份表
  db.run(`
    CREATE TABLE directors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      display_name TEXT,
      email TEXT,
      preferences TEXT DEFAULT '{}',
      config TEXT DEFAULT '{}',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('❌ 创建导演身份表失败:', err.message);
      process.exit(1);
    }
    console.log('✅ 创建导演身份表 (directors)');
  });

  // 2. 智能体表
  db.run(`
    CREATE TABLE agents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      status TEXT DEFAULT 'active',
      capabilities TEXT DEFAULT '{}',
      config TEXT DEFAULT '{}',
      last_active TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('❌ 创建智能体表失败:', err.message);
      process.exit(1);
    }
    console.log('✅ 创建智能体表 (agents)');
  });

  // 3. 项目表
  db.run(`
    CREATE TABLE projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      director_id INTEGER REFERENCES directors(id),
      name TEXT NOT NULL,
      description TEXT,
      type TEXT,
      status TEXT DEFAULT 'planning',
      progress INTEGER DEFAULT 0,
      metadata TEXT DEFAULT '{}',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('❌ 创建项目表失败:', err.message);
      process.exit(1);
    }
    console.log('✅ 创建项目表 (projects)');
  });

  // 4. 项目-智能体关联表
  db.run(`
    CREATE TABLE project_agents (
      project_id INTEGER REFERENCES projects(id),
      agent_id INTEGER REFERENCES agents(id),
      role TEXT,
      assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (project_id, agent_id)
    )
  `, (err) => {
    if (err) {
      console.error('❌ 创建项目-智能体关联表失败:', err.message);
      process.exit(1);
    }
    console.log('✅ 创建项目-智能体关联表 (project_agents)');
  });

  // 等待所有表创建完成
  db.wait(() => {
    console.log('\n🤖 开始初始化智能体数据...');
    
    const agents = [
      {
        name: '总编剧智能体',
        type: 'narrative',
        capabilities: JSON.stringify({
          description: '故事创意和剧本创作专家',
          skills: ['故事大纲', '角色设计', '场景描述', '对话脚本'],
          specialities: ['情感叙事', '情节结构', '角色发展']
        }),
        config: JSON.stringify({
          default_style: '情感丰富',
          working_hours: '24小时',
          collaboration_mode: '主动创意'
        })
      },
      {
        name: '分镜智能体',
        type: 'storyboard',
        capabilities: JSON.stringify({
          description: '视觉叙事和分镜设计专家',
          skills: ['分镜脚本', '镜头语言', '视觉节奏', '情感表达'],
          specialities: ['电影语言', '节奏控制', '视觉叙事']
        }),
        config: JSON.stringify({
          default_style: '电影感',
          frame_rate: '24fps',
          aspect_ratio: '16:9'
        })
      },
      {
        name: '视觉风格智能体',
        type: 'visual_style',
        capabilities: JSON.stringify({
          description: '视觉设计和风格指导专家',
          skills: ['视觉风格指南', '色彩方案', '材质纹理', '构图原则'],
          specialities: ['风格分析', '色彩理论', '视觉一致性']
        }),
        config: JSON.stringify({
          default_palette: '情感色彩',
          texture_library: '丰富',
          style_variants: 5
        })
      },
      {
        name: '即梦AI专家智能体',
        type: 'dreamai',
        capabilities: JSON.stringify({
          description: 'AI生成优化和参数调整专家',
          skills: ['提示词优化', '参数调整', '质量控制', '批量生成'],
          specialities: ['即梦Seedance2.0', 'AI生成优化', '质量评估']
        }),
        config: JSON.stringify({
          ai_model: '即梦Seedance2.0',
          optimization_level: '高级',
          quality_standard: '专业级'
        })
      },
      {
        name: '主智能体 (AI导演)',
        type: 'director',
        capabilities: JSON.stringify({
          description: '系统协调和质量控制专家',
          skills: ['工作流协调', '质量评估', '资源整合', '进度监控'],
          specialities: ['多智能体协作', '质量控制', '项目协调']
        }),
        config: JSON.stringify({
          collaboration_mode: '主动协调',
          quality_standard: '最高',
          monitoring_frequency: '实时'
        })
      }
    ];

    let insertedCount = 0;
    
    agents.forEach((agent, index) => {
      db.run(
        'INSERT INTO agents (name, type, capabilities, config) VALUES (?, ?, ?, ?)',
        [agent.name, agent.type, agent.capabilities, agent.config],
        (err) => {
          if (err) {
            console.error(`❌ 初始化智能体失败 ${agent.name}:`, err.message);
            process.exit(1);
          }
          console.log(`✅ 初始化智能体: ${agent.name}`);
          insertedCount++;
          
          if (insertedCount === agents.length) {
            console.log('🎉 智能体数据初始化完成！');
            
            // 初始化导演数据
            console.log('\n🎬 开始初始化导演数据...');
            
            const director = {
              username: 'Nmyh_NIUMA',
              display_name: 'Nmyh NIUMA',
              email: 'your-email@example.com',
              preferences: JSON.stringify({
                creative_style: '情感丰富+视觉冲击',
                preferred_genres: ['奇幻', '科幻', '情感剧'],
                work_rhythm: '24小时灵活工作制',
                collaboration_preference: '主动创意+技术执行',
                notification_preferences: {
                  progress_updates: true,
                  quality_alerts: true,
                  system_status: true
                }
              }),
              config: JSON.stringify({
                theme: 'dark',
                language: 'zh-CN',
                timezone: 'Asia/Shanghai',
                default_project_type: 'video_creation',
                auto_save: true,
                backup_frequency: 'daily'
              })
            };
            
            db.run(
              'INSERT INTO directors (username, display_name, email, preferences, config) VALUES (?, ?, ?, ?, ?)',
              [director.username, director.display_name, director.email, director.preferences, director.config],
              (err) => {
                if (err) {
                  console.error('❌ 初始化导演失败:', err.message);
                  process.exit(1);
                }
                console.log('✅ 初始化导演: Nmyh NIUMA');
                console.log('🎉 导演数据初始化完成！');
                
                // 完成迁移
                console.log('\n🚀 数据库迁移完成！');
                console.log('📊 数据库状态:');
                console.log('   - 4个核心表已创建');
                console.log('   - 5个智能体已初始化');
                console.log('   - 导演身份已设置 (Nmyh NIUMA)');
                
                db.close();
                process.exit(0);
              }
            );
          }
        }
      );
    });
  });
});