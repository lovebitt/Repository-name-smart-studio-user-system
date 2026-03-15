/**
 * 即梦AI提示词库集成模块
 * 将即梦Seedance2.0提示词库集成到智能体协作工作流
 */

const fs = require('fs');
const path = require('path');

class DreamAIIntegration {
  constructor() {
    this.promptLibraryPath = path.join(__dirname, '../../../即梦Seedance2.0_提示词库.md');
    this.promptCategories = {};
    this.initialized = false;
  }

  /**
   * 初始化提示词库
   */
  async initialize() {
    try {
      console.log('📚 初始化即梦AI提示词库...');
      
      if (!fs.existsSync(this.promptLibraryPath)) {
        throw new Error(`提示词库文件不存在: ${this.promptLibraryPath}`);
      }
      
      const content = fs.readFileSync(this.promptLibraryPath, 'utf8');
      this.parsePromptLibrary(content);
      
      this.initialized = true;
      console.log(`✅ 提示词库初始化完成，加载 ${Object.keys(this.promptCategories).length} 个类别`);
      
      return {
        success: true,
        categories: Object.keys(this.promptCategories),
        total_prompts: this.getTotalPromptCount(),
        version: 'Seedance2.0',
        last_updated: '2026-03-14'
      };
    } catch (error) {
      console.error('❌ 初始化提示词库失败:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 解析提示词库内容
   */
  parsePromptLibrary(content) {
    const lines = content.split('\n');
    let currentCategory = null;
    let currentSubcategory = null;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // 检测主类别 (## 标题)
      if (line.startsWith('## ')) {
        const categoryMatch = line.match(/^##\s+(.+?)\s*$/);
        if (categoryMatch) {
          const categoryName = categoryMatch[1].trim();
          
          // 跳过非提示词类别
          const skipCategories = ['📋 目录', '📚 学习资源推荐', '💡 使用建议'];
          if (skipCategories.includes(categoryName)) {
            currentCategory = null;
            currentSubcategory = null;
            continue;
          }
          
          // 清理类别名称
          const cleanCategoryName = categoryName
            .replace('提示词', '')
            .replace(/^[🎥✨💃🏞️🎨🧠📚💡]+\s*/, '')
            .trim();
          
          currentCategory = cleanCategoryName;
          currentSubcategory = null;
          
          if (!this.promptCategories[currentCategory]) {
            this.promptCategories[currentCategory] = {
              name: currentCategory,
              description: this.extractDescription(lines, i),
              subcategories: {},
              prompts: []
            };
          }
        }
      }
      
      // 检测子类别 (### 标题)
      else if (line.startsWith('### ')) {
        const subcategoryMatch = line.match(/^###\s+(.+?)\s*$/);
        if (subcategoryMatch && currentCategory) {
          const subcategoryName = subcategoryMatch[1].trim();
          currentSubcategory = subcategoryName;
          
          if (!this.promptCategories[currentCategory].subcategories[currentSubcategory]) {
            this.promptCategories[currentCategory].subcategories[currentSubcategory] = {
              name: currentSubcategory,
              prompts: []
            };
          }
        }
      }
      
      // 检测提示词项 (- 或 * 开头)
      else if ((line.startsWith('- ') || line.startsWith('* ')) && (currentCategory || currentSubcategory)) {
        const promptText = line.substring(2).trim();
        
        if (promptText) {
          // 移除Markdown加粗标记
          const cleanText = promptText.replace(/\*\*/g, '');
          const prompt = this.parsePromptItem(cleanText);
          
          if (currentSubcategory && currentCategory) {
            this.promptCategories[currentCategory].subcategories[currentSubcategory].prompts.push(prompt);
          } else if (currentCategory) {
            this.promptCategories[currentCategory].prompts.push(prompt);
          }
        }
      }
      
      // 检测详细描述 (包含冒号的项)
      else if (line.includes('：') || line.includes(':')) {
        const colonIndex = line.indexOf('：') !== -1 ? line.indexOf('：') : line.indexOf(':');
        if (colonIndex > 0) {
          const key = line.substring(0, colonIndex).trim();
          const value = line.substring(colonIndex + 1).trim();
          
          // 如果是提示词描述，添加到最近一个提示词
          if (key && value && this.hasRecentPrompt()) {
            this.addDetailToRecentPrompt(key, value);
          }
        }
      }
    }
  }

  /**
   * 提取类别描述
   */
  extractDescription(lines, startIndex) {
    let description = '';
    
    for (let i = startIndex + 1; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line.startsWith('#') || line.startsWith('-') || line.startsWith('*')) {
        break;
      }
      
      if (line) {
        description += line + ' ';
      }
    }
    
    return description.trim();
  }

  /**
   * 解析提示词项
   */
  parsePromptItem(text) {
    // 提取中文名称和英文名称
    const chineseMatch = text.match(/^【(.+?)】/);
    const englishMatch = text.match(/\((.+?)\)/);
    
    let chineseName = '';
    let englishName = '';
    let description = text;
    
    if (chineseMatch) {
      chineseName = chineseMatch[1];
      description = description.replace(chineseMatch[0], '').trim();
    }
    
    if (englishMatch) {
      englishName = englishMatch[1];
      description = description.replace(`(${englishName})`, '').trim();
    }
    
    return {
      id: `prompt_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      chinese_name: chineseName || '',
      english_name: englishName || '',
      description: description,
      original_text: text,
      tags: this.extractTags(text),
      difficulty: this.estimateDifficulty(text),
      usage_count: 0,
      last_used: null,
      created_at: new Date().toISOString()
    };
  }

  /**
   * 提取标签
   */
  extractTags(text) {
    const tags = [];
    
    // 提取风格标签
    const styleKeywords = ['梦幻', '唯美', '科幻', '奇幻', '现实', '抽象', '简约', '复杂'];
    styleKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        tags.push(keyword);
      }
    });
    
    // 提取技术标签
    const techKeywords = ['运镜', '特效', '转场', '色彩', '光影', '构图', '节奏'];
    techKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        tags.push(keyword);
      }
    });
    
    return tags;
  }

  /**
   * 估计难度级别
   */
  estimateDifficulty(text) {
    const length = text.length;
    const hasEnglish = /[a-zA-Z]/.test(text);
    const hasTechnicalTerms = /(运镜|特效|转场|参数|设置)/.test(text);
    
    if (length > 100 || (hasEnglish && hasTechnicalTerms)) {
      return '高级';
    } else if (length > 50 || hasEnglish || hasTechnicalTerms) {
      return '中级';
    } else {
      return '初级';
    }
  }

  /**
   * 检查是否有最近的提示词
   */
  hasRecentPrompt() {
    // 简化实现：总是返回true
    return true;
  }

  /**
   * 添加详细信息到最近的提示词
   */
  addDetailToRecentPrompt(key, value) {
    // 简化实现：记录日志
    console.log(`📝 添加详细信息: ${key} = ${value}`);
  }

  /**
   * 获取提示词总数
   */
  getTotalPromptCount() {
    let count = 0;
    
    Object.values(this.promptCategories).forEach(category => {
      count += category.prompts.length;
      
      Object.values(category.subcategories).forEach(subcategory => {
        count += subcategory.prompts.length;
      });
    });
    
    return count;
  }

  /**
   * 根据需求生成提示词
   */
  async generatePrompt(requirements) {
    if (!this.initialized) {
      await this.initialize();
    }
    
    const {
      scene_type,
      style_preference,
      camera_technique,
      special_effects,
      duration,
      target_audience,
      emotion_tone
    } = requirements;
    
    // 构建搜索关键词
    const keywords = [
      scene_type,
      style_preference,
      camera_technique,
      special_effects,
      emotion_tone
    ].filter(Boolean);
    
    // 搜索匹配的提示词
    const matchedPrompts = this.searchPrompts(keywords);
    
    if (matchedPrompts.length === 0) {
      return this.generateFallbackPrompt(requirements);
    }
    
    // 选择最佳匹配
    const bestPrompt = this.selectBestPrompt(matchedPrompts, requirements);
    
    // 优化提示词
    const optimizedPrompt = this.optimizePrompt(bestPrompt, requirements);
    
    // 生成完整提示词
    const fullPrompt = this.constructFullPrompt(optimizedPrompt, requirements);
    
    // 记录使用
    this.recordPromptUsage(bestPrompt.id);
    
    return {
      success: true,
      prompt: fullPrompt,
      source_prompt: bestPrompt,
      matched_keywords: keywords,
      confidence_score: this.calculateConfidenceScore(bestPrompt, keywords),
      optimization_notes: this.getOptimizationNotes(optimizedPrompt, bestPrompt),
      suggested_parameters: this.generateSuggestedParameters(requirements)
    };
  }

  /**
   * 搜索提示词
   */
  searchPrompts(keywords) {
    const results = [];
    
    Object.values(this.promptCategories).forEach(category => {
      // 搜索主类别提示词
      category.prompts.forEach(prompt => {
        const matchScore = this.calculateMatchScore(prompt, keywords);
        if (matchScore > 0) {
          results.push({
            ...prompt,
            category: category.name,
            match_score: matchScore
          });
        }
      });
      
      // 搜索子类别提示词
      Object.values(category.subcategories).forEach(subcategory => {
        subcategory.prompts.forEach(prompt => {
          const matchScore = this.calculateMatchScore(prompt, keywords);
          if (matchScore > 0) {
            results.push({
              ...prompt,
              category: category.name,
              subcategory: subcategory.name,
              match_score: matchScore
            });
          }
        });
      });
    });
    
    // 按匹配分数排序
    return results.sort((a, b) => b.match_score - a.match_score);
  }

  /**
   * 计算匹配分数
   */
  calculateMatchScore(prompt, keywords) {
    let score = 0;
    const textToSearch = `${prompt.description} ${prompt.chinese_name} ${prompt.english_name} ${prompt.tags.join(' ')}`.toLowerCase();
    
    keywords.forEach(keyword => {
      const keywordLower = keyword.toLowerCase();
      
      if (textToSearch.includes(keywordLower)) {
        score += 3; // 完全匹配
      } else if (this.hasPartialMatch(textToSearch, keywordLower)) {
        score += 1; // 部分匹配
      }
    });
    
    // 考虑使用频率（更常用的提示词优先）
    score += Math.log10(prompt.usage_count + 1);
    
    return score;
  }

  /**
   * 检查部分匹配
   */
  hasPartialMatch(text, keyword) {
    // 检查同义词或相关词
    const synonymMap = {
      '梦幻': ['梦幻', '唯美', '浪漫', '诗意'],
      '科幻': ['科幻', '未来', '科技', '太空'],
      '现实': ['现实', '写实', '真实', '纪实'],
      '运镜': ['运镜', '镜头', '拍摄', '摄像'],
      '特效': ['特效', '效果', '视觉', '动画']
    };
    
    if (synonymMap[keyword]) {
      return synonymMap[keyword].some(synonym => text.includes(synonym));
    }
    
    return false;
  }

  /**
   * 选择最佳提示词
   */
  selectBestPrompt(prompts, requirements) {
    // 简单选择：取匹配分数最高的
    return prompts[0];
  }

  /**
   * 生成备用提示词
   */
  generateFallbackPrompt(requirements) {
    const { scene_type, style_preference, emotion_tone } = requirements;
    
    const basePrompts = {
      '梦幻': '梦幻唯美风格，柔和光影，诗意氛围',
      '科幻': '未来科技感，冷色调，机械元素',
      '现实': '写实风格，自然光影，真实质感',
      '情感': '情感丰富，温暖色调，人物特写',
      '动作': '动态强烈，快速剪辑，紧张节奏'
    };
    
    const style = style_preference || '梦幻';
    const basePrompt = basePrompts[style] || basePrompts['梦幻'];
    
    return {
      id: 'fallback_prompt',
      description: `${basePrompt}，${scene_type || '通用'}场景`,
      tags: [style, scene_type || '通用'],
      difficulty: '中级',
      is_fallback: true
    };
  }

  /**
   * 优化提示词
   */
  optimizePrompt(prompt, requirements) {
    let optimized = { ...prompt };
    
    // 根据时长调整
    if (requirements.duration) {
      optimized.description = this.adjustForDuration(optimized.description, requirements.duration);
    }
    
    // 根据目标受众调整
    if (requirements.target_audience) {
      optimized.description = this.adjustForAudience(optimized.description, requirements.target_audience);
    }
    
    // 根据情感基调调整
    if (requirements.emotion_tone) {
      optimized.description = this.adjustForEmotion(optimized.description, requirements.emotion_tone);
    }
    
    return optimized;
  }

  /**
   * 根据时长调整
   */
  adjustForDuration(description, duration) {
    if (duration <= 30) {
      return description + '，快速节奏，简洁表达';
    } else if (duration <= 60) {
      return description + '，适中节奏，完整叙事';
    } else {
      return description + '，缓慢节奏，细节丰富';
    }
  }

  /**
   * 根据受众调整
   */
  adjustForAudience(description, audience) {
    const adjustments = {
      '年轻人': '，时尚元素，快节奏',
      '专业人士': '，精致细节，专业感',
      '大众': '，易懂表达，普遍吸引力',
      '儿童': '，明亮色彩，简单有趣'
    };
    
    return description + (adjustments[audience] || '');
  }

  /**
   * 根据情感调整
   */
  adjustForEmotion(description, emotion) {
    const adjustments = {
      '欢乐': '，明亮色调，轻快节奏',
      '悲伤': '，冷色调，缓慢节奏',
      '紧张': '，快速剪辑，不稳定构图',
      '平静': '，稳定构图，柔和过渡'
    };
    
    return description + (adjustments[emotion] || '');
  }

  /**
   * 构建完整提示词
   */
  constructFullPrompt(prompt, requirements) {
    const parts = [];
    
    // 1. 基本描述
    parts.push(prompt.description);
    
    // 2. 技术要求
    if (requirements.camera_technique) {
      parts.push(`运镜技巧：${requirements.camera_technique}`);
    }
    
    if (requirements.special_effects) {
      parts.push(`特效要求：${requirements.special_effects}`);
    }
    
    // 3. 风格要求
    if (requirements.style_preference) {
      parts.push(`风格倾向：${requirements.style_preference}`);
    }
    
    // 4. 情感基调
    if (requirements.emotion_tone) {
      parts.push(`情感基调：${requirements.emotion_tone}`);
    }
    
    // 5. 技术参数建议
    const params = this.generateSuggestedParameters(requirements);
    if (params) {
      parts.push(`技术参数：${params}`);
    }
    
    return parts.join('，');
  }

  /**
   * 计算置信度分数
   */
  calculateConfidenceScore(prompt, keywords) {
    const maxScore = keywords.length * 3;
    const actualScore = prompt.match_score || 0;
    
    return Math.min(Math.round((actualScore / maxScore) * 100), 100);
  }

  /**
   * 获取优化说明
   */
  getOptimizationNotes(optimized, original) {
    const notes = [];
    
    if (optimized.description !== original.description) {
      notes.push('根据需求调整了描述');
    }
    
    if (optimized.tags && optimized.tags.length > original.tags.length) {
      notes.push('添加了相关标签');
    }
    
    return notes.length > 0 ? notes : ['使用原始提示词'];
  }

  /**
   * 生成建议参数
   */
  generateSuggestedParameters(requirements) {
    const params = [];
    
    // 根据风格建议参数
    if (requirements.style_preference === '梦幻') {
      params.push('柔光滤镜', '低对比度', '暖色调');
    } else if (requirements.style_preference === '科幻') {
      params.push('冷色调', '高对比度', '蓝绿色调');
    } else if (requirements.style_preference === '现实') {
      params.push('自然光', '中等对比度', '真实色彩');
    }
    
    // 根据时长建议帧率
    if (requirements.duration) {
      if (requirements.duration <= 30) {
        params.push('24fps');
      } else {
        params.push('30fps');
      }
    }
    
    return params.join('，');
  }

  /**
   * 记录提示词使用
   */
  recordPromptUsage(promptId) {
    // 简化实现：记录日志
    console.log(`📊 记录提示词使用: ${promptId}`);
  }

  /**
   * 获取提示词类别
   */
  getCategories() {
    if (!this.initialized) {
      return {
        success: false,
        error: '提示词库未初始化'
      };
    }
    
    return {
      success: true,
      categories: Object.keys(this.promptCategories).map(categoryName => ({
        name: categoryName,
        description: this.promptCategories[categoryName].description,
        prompt_count: this.promptCategories[categoryName].prompts.length,
        subcategory_count: Object.keys(this.promptCategories[categoryName].subcategories).length
      })),
      total_categories: Object.keys(this.promptCategories).length
    };
  }

  /**
   * 获取类别详情
   */
  getCategoryDetails(categoryName) {
    if (!this.initialized) {
      return {
        success: false,
        error: '提示词库未初始化'
      };
    }
    
    const category = this.promptCategories[categoryName];
    if (!category) {
      return {
        success: false,
        error: `类别 ${categoryName} 不存在`
      };
    }
    
    return {
      success: true,
      category: {
        name: category.name,
        description: category.description,
        prompts: category.prompts.slice(0, 10), // 只返回前10个
        subcategories: Object.keys(category.subcategories).map(subName => ({
          name: subName,
          prompt_count: category.subcategories[subName].prompts.length
        })),
        total_prompts: category.prompts.length + 
          Object.values(category.subcategories).reduce((sum, sub) => sum + sub.prompts.length, 0)
      }
    };
  }

  /**
   * 搜索提示词
   */
  searchPromptsByKeyword(keyword, limit = 20) {
    if (!this.initialized) {
      return {
        success: false,
        error: '提示词库未初始化'
      };
    }
    
    const results = [];
    const keywordLower = keyword.toLowerCase();
    
    Object.values(this.promptCategories).forEach(category => {
      // 搜索主类别提示词
      category.prompts.forEach(prompt => {
        if (this.doesPromptMatch(prompt, keywordLower)) {
          results.push({
            ...prompt,
            category: category.name,
            match_type: 'primary'
          });
        }
      });
      
      // 搜索子类别提示词
      Object.values(category.subcategories).forEach(subcategory => {
        subcategory.prompts.forEach(prompt => {
          if (this.doesPromptMatch(prompt, keywordLower)) {
            results.push({
              ...prompt,
              category: category.name,
              subcategory: subcategory.name,
              match_type: 'subcategory'
            });
          }
        });
      });
    });
    
    // 按相关性排序
    results.sort((a, b) => {
      const scoreA = this.calculateRelevanceScore(a, keywordLower);
      const scoreB = this.calculateRelevanceScore(b, keywordLower);
      return scoreB - scoreA;
    });
    
    return {
      success: true,
      results: results.slice(0, limit),
      total_matches: results.length,
      keyword: keyword
    };
  }

  /**
   * 检查提示词是否匹配
   */
  doesPromptMatch(prompt, keyword) {
    const searchText = `${prompt.description} ${prompt.chinese_name} ${prompt.english_name} ${prompt.tags.join(' ')}`.toLowerCase();
    return searchText.includes(keyword);
  }

  /**
   * 计算相关性分数
   */
  calculateRelevanceScore(prompt, keyword) {
    let score = 0;
    const searchText = `${prompt.description} ${prompt.chinese_name} ${prompt.english_name} ${prompt.tags.join(' ')}`.toLowerCase();
    
    // 完全匹配
    if (searchText.includes(keyword)) {
      score += 10;
    }
    
    // 在描述中匹配
    if (prompt.description.toLowerCase().includes(keyword)) {
      score += 5;
    }
    
    // 在名称中匹配
    if (prompt.chinese_name.toLowerCase().includes(keyword) || 
        prompt.english_name.toLowerCase().includes(keyword)) {
      score += 8;
    }
    
    // 在标签中匹配
    if (prompt.tags.some(tag => tag.toLowerCase().includes(keyword))) {
      score += 3;
    }
    
    // 考虑使用频率
    score += Math.log10(prompt.usage_count + 1);
    
    return score;
  }

  /**
   * 获取热门提示词
   */
  getPopularPrompts(limit = 10) {
    if (!this.initialized) {
      return {
        success: false,
        error: '提示词库未初始化'
      };
    }
    
    const allPrompts = [];
    
    Object.values(this.promptCategories).forEach(category => {
      category.prompts.forEach(prompt => {
        allPrompts.push({
          ...prompt,
          category: category.name,
          usage_score: prompt.usage_count * 2 // 使用频率权重
        });
      });
      
      Object.values(category.subcategories).forEach(subcategory => {
        subcategory.prompts.forEach(prompt => {
          allPrompts.push({
            ...prompt,
            category: category.name,
            subcategory: subcategory.name,
            usage_score: prompt.usage_count * 2
          });
        });
      });
    });
    
    // 按使用分数排序
    allPrompts.sort((a, b) => b.usage_score - a.usage_score);
    
    return {
      success: true,
      popular_prompts: allPrompts.slice(0, limit),
      total_prompts: allPrompts.length
    };
  }

  /**
   * 获取提示词统计
   */
  getPromptStats() {
    if (!this.initialized) {
      return {
        success: false,
        error: '提示词库未初始化'
      };
    }
    
    let totalPrompts = 0;
    let totalCategories = 0;
    let totalSubcategories = 0;
    let difficultyDistribution = {
      初级: 0,
      中级: 0,
      高级: 0
    };
    
    Object.values(this.promptCategories).forEach(category => {
      totalCategories++;
      totalPrompts += category.prompts.length;
      
      category.prompts.forEach(prompt => {
        difficultyDistribution[prompt.difficulty] = (difficultyDistribution[prompt.difficulty] || 0) + 1;
      });
      
      Object.values(category.subcategories).forEach(subcategory => {
        totalSubcategories++;
        totalPrompts += subcategory.prompts.length;
        
        subcategory.prompts.forEach(prompt => {
          difficultyDistribution[prompt.difficulty] = (difficultyDistribution[prompt.difficulty] || 0) + 1;
        });
      });
    });
    
    return {
      success: true,
      stats: {
        total_prompts: totalPrompts,
        total_categories: totalCategories,
        total_subcategories: totalSubcategories,
        difficulty_distribution: difficultyDistribution,
        average_prompts_per_category: totalCategories > 0 ? Math.round(totalPrompts / totalCategories) : 0,
        library_version: 'Seedance2.0',
        last_parsed: new Date().toISOString()
      }
    };
  }

  /**
   * 集成到工作流
   */
  integrateWithWorkflow(workflowData) {
    if (!this.initialized) {
      return {
        success: false,
        error: '提示词库未初始化，无法集成'
      };
    }
    
    const { project_type, requirements, workflow_stages } = workflowData;
    
    // 为每个工作流阶段生成提示词
    const stagePrompts = {};
    
    if (workflow_stages && Array.isArray(workflow_stages)) {
      workflow_stages.forEach(stage => {
        if (stage.agent_type === 'dreamai' || stage.name.includes('AI生成')) {
          const promptRequirements = {
            scene_type: requirements?.scene_type || '通用',
            style_preference: requirements?.style_preference || '梦幻',
            camera_technique: requirements?.camera_technique,
            special_effects: requirements?.special_effects,
            duration: requirements?.duration,
            target_audience: requirements?.target_audience,
            emotion_tone: requirements?.emotion_tone
          };
          
          const promptResult = this.generatePrompt(promptRequirements);
          
          if (promptResult.success) {
            stagePrompts[stage.name] = {
              stage: stage.name,
              prompt: promptResult.prompt,
              confidence: promptResult.confidence_score,
              source: promptResult.source_prompt,
              optimization_notes: promptResult.optimization_notes
            };
          }
        }
      });
    }
    
    return {
      success: true,
      workflow_integration: {
        project_type: project_type,
        integrated_stages: Object.keys(stagePrompts),
        stage_prompts: stagePrompts,
        total_prompts_generated: Object.keys(stagePrompts).length,
        integration_status: 'complete'
      }
    };
  }
}

module.exports = DreamAIIntegration;