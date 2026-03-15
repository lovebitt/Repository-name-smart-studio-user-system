const DreamAIIntegration = require('./src/integration/dreamaiIntegration');

async function testFixedParse() {
  console.log('🔧 测试修复后的解析...');
  
  const dreamai = new DreamAIIntegration();
  const result = await dreamai.initialize();
  
  if (result.success) {
    console.log('✅ 初始化成功');
    console.log(`📊 类别数量: ${result.categories.length}`);
    console.log(`📝 提示词总数: ${result.total_prompts}`);
    
    // 显示类别详情
    console.log('\n📋 类别列表:');
    result.categories.forEach((category, index) => {
      console.log(`${index + 1}. ${category}`);
    });
    
    // 测试搜索
    console.log('\n🔍 测试搜索 "梦幻":');
    const searchResult = dreamai.searchPromptsByKeyword('梦幻', 5);
    if (searchResult.success) {
      console.log(`找到 ${searchResult.total_matches} 个匹配`);
      searchResult.results.slice(0, 3).forEach((prompt, i) => {
        console.log(`${i + 1}. ${prompt.description.substring(0, 80)}...`);
      });
    }
    
    // 测试生成提示词
    console.log('\n🎯 测试生成提示词:');
    const promptResult = await dreamai.generatePrompt({
      scene_type: '城市夜景',
      style_preference: '梦幻',
      camera_technique: '推镜头'
    });
    
    if (promptResult.success) {
      console.log(`生成的提示词: ${promptResult.prompt.substring(0, 100)}...`);
      console.log(`置信度: ${promptResult.confidence_score}%`);
    }
    
    // 获取统计
    console.log('\n📈 获取统计:');
    const stats = dreamai.getPromptStats();
    if (stats.success) {
      console.log(`总提示词: ${stats.stats.total_prompts}`);
      console.log(`总类别: ${stats.stats.total_categories}`);
      console.log(`总子类别: ${stats.stats.total_subcategories}`);
      console.log('难度分布:', stats.stats.difficulty_distribution);
    }
    
  } else {
    console.error('❌ 初始化失败:', result.error);
  }
}

testFixedParse().catch(console.error);