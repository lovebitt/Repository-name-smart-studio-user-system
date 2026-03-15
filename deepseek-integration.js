#!/usr/bin/env node

/**
 * DeepSeek API 集成模块
 * 为本地智能工作室添加DeepSeek AI能力
 */

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// 创建Express应用
const app = express();
const PORT = process.env.PORT || 3002;

// 中间件
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DeepSeek API配置
const DEEPSEEK_CONFIG = {
    baseURL: 'https://api.deepseek.com',
    apiKey: process.env.DEEPSEEK_API_KEY || '',
    model: 'deepseek-chat',
    timeout: 30000,
    maxTokens: 4096,
    temperature: 0.7
};

// 智能体角色设定
const AGENT_ROLES = {
    director: {
        name: 'AI导演',
        systemPrompt: `你是一位专业的AI导演，负责视频创作项目的整体规划和协调。
你的职责包括：
1. 项目整体规划和进度管理
2. 协调各个创作环节的协作
3. 质量把控和创意指导
4. 解决创作过程中的问题
5. 提供专业的创作建议

请以专业、有创意的方式回应用户的需求，提供有价值的指导和建议。`,
        temperature: 0.7
    },
    narrative: {
        name: '故事创作智能体',
        systemPrompt: `你是一位专业的故事创作专家，擅长创作各种类型的故事。
你的专长包括：
1. 故事结构和情节设计
2. 角色塑造和人物关系
3. 对话编写和情感表达
4. 故事节奏和悬念设置
5. 各种类型的故事创作（奇幻、科幻、情感、悬疑等）

请以富有创意和情感的方式创作故事，注重细节和情感表达。`,
        temperature: 0.8
    },
    storyboard: {
        name: '分镜设计智能体',
        systemPrompt: `你是一位专业的分镜设计专家，擅长视觉叙事和镜头设计。
你的专长包括：
1. 分镜设计和视觉叙事
2. 镜头语言和画面构图
3. 视觉节奏和画面转换
4. 场景设计和空间布局
5. 视觉风格和美学指导

请以视觉化的方式思考，提供具体的画面描述和镜头建议。`,
        temperature: 0.7
    },
    visual_style: {
        name: '视觉风格智能体',
        systemPrompt: `你是一位专业的视觉风格专家，擅长美学设计和视觉表达。
你的专长包括：
1. 视觉风格和美学设计
2. 色彩理论和色彩搭配
3. 画面构图和视觉焦点
4. 风格统一和视觉一致性
5. 创意视觉表达

请以艺术家的视角思考，提供有创意和美感的视觉建议。`,
        temperature: 0.75
    },
    dreamai: {
        name: 'AI生成专家',
        systemPrompt: `你是一位专业的AI生成专家，擅长提示词工程和AI创作优化。
你的专长包括：
1. 提示词工程和优化
2. AI生成技巧和策略
3. 风格控制和一致性
4. 质量评估和改进
5. 创意生成和灵感激发

请以技术专家的视角，提供专业、实用的AI生成建议。`,
        temperature: 0.6
    }
};

// DeepSeek API客户端
class DeepSeekClient {
    constructor(config) {
        this.config = config;
        this.client = axios.create({
            baseURL: config.baseURL,
            timeout: config.timeout,
            headers: {
                'Authorization': `Bearer ${config.apiKey}`,
                'Content-Type': 'application/json'
            }
        });
    }

    // 测试API连接
    async testConnection() {
        try {
            const response = await this.client.get('/v1/models');
            return {
                success: true,
                message: 'DeepSeek API连接成功',
                models: response.data.data
            };
        } catch (error) {
            console.error('DeepSeek API连接测试失败:', error.message);
            return {
                success: false,
                error: error.message,
                message: 'DeepSeek API连接失败，请检查API密钥和网络连接'
            };
        }
    }

    // 发送聊天消息
    async chat(messages, options = {}) {
        const {
            model = this.config.model,
            temperature = this.config.temperature,
            max_tokens = this.config.maxTokens,
            stream = false
        } = options;

        try {
            const response = await this.client.post('/chat/completions', {
                model,
                messages,
                temperature,
                max_tokens,
                stream
            });

            return {
                success: true,
                data: response.data,
                message: '聊天请求成功'
            };
        } catch (error) {
            console.error('DeepSeek API聊天请求失败:', error.message);
            return {
                success: false,
                error: error.message,
                message: '聊天请求失败'
            };
        }
    }

    // 智能体对话
    async agentChat(agentType, userMessage, context = {}) {
        const agent = AGENT_ROLES[agentType];
        if (!agent) {
            return {
                success: false,
                error: '智能体类型不存在',
                message: `智能体类型 ${agentType} 不存在`
            };
        }

        // 构建消息历史
        const messages = [
            {
                role: 'system',
                content: agent.systemPrompt
            },
            {
                role: 'user',
                content: this.buildUserMessage(userMessage, context, agentType)
            }
        ];

        // 发送请求
        const result = await this.chat(messages, {
            temperature: agent.temperature
        });

        if (result.success) {
            return {
                success: true,
                agent: agent.name,
                response: result.data.choices[0].message.content,
                usage: result.data.usage,
                message: `${agent.name} 响应成功`
            };
        } else {
            return result;
        }
    }

    // 构建用户消息
    buildUserMessage(userMessage, context, agentType) {
        let message = userMessage;
        
        // 添加上下文信息
        if (context.projectName) {
            message = `项目：${context.projectName}\n${message}`;
        }
        
        if (context.projectType) {
            message = `项目类型：${context.projectType}\n${message}`;
        }
        
        if (context.stage) {
            message = `当前阶段：${context.stage}\n${message}`;
        }
        
        return message;
    }

    // 批量智能体协作
    async collaborativeChat(projectContext, userMessage) {
        const responses = {};
        
        // 依次调用各个智能体
        for (const [agentType, agentConfig] of Object.entries(AGENT_ROLES)) {
            try {
                const result = await this.agentChat(agentType, userMessage, projectContext);
                responses[agentType] = result;
                
                // 添加延迟，避免API限制
                await new Promise(resolve => setTimeout(resolve, 500));
            } catch (error) {
                responses[agentType] = {
                    success: false,
                    error: error.message,
                    message: `${agentConfig.name} 响应失败`
                };
            }
        }
        
        return responses;
    }
}

// 创建DeepSeek客户端
const deepseekClient = new DeepSeekClient(DEEPSEEK_CONFIG);

// API路由
app.get('/', (req, res) => {
    res.json({
        message: 'DeepSeek API 集成服务',
        version: '1.0.0',
        endpoints: {
            test: '/api/deepseek/test',
            chat: '/api/deepseek/chat',
            agent: '/api/deepseek/agent/:type',
            collaborative: '/api/deepseek/collaborative',
            agents: '/api/deepseek/agents'
        },
        agents: Object.keys(AGENT_ROLES)
    });
});

// 测试API连接
app.get('/api/deepseek/test', async (req, res) => {
    try {
        const result = await deepseekClient.testConnection();
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'API测试失败'
        });
    }
});

// 通用聊天接口
app.post('/api/deepseek/chat', async (req, res) => {
    try {
        const { messages, options = {} } = req.body;
        
        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({
                success: false,
                error: '消息格式错误',
                message: 'messages必须是数组'
            });
        }
        
        const result = await deepseekClient.chat(messages, options);
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            message: '聊天请求失败'
        });
    }
});

// 智能体对话接口
app.post('/api/deepseek/agent/:type', async (req, res) => {
    try {
        const { type } = req.params;
        const { message, context = {} } = req.body;
        
        if (!message) {
            return res.status(400).json({
                success: false,
                error: '消息不能为空',
                message: '请提供消息内容'
            });
        }
        
        if (!AGENT_ROLES[type]) {
            return res.status(400).json({
                success: false,
                error: '智能体类型不存在',
                message: `支持的智能体类型: ${Object.keys(AGENT_ROLES).join(', ')}`
            });
        }
        
        const result = await deepseekClient.agentChat(type, message, context);
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            message: '智能体对话失败'
        });
    }
});

// 协作对话接口
app.post('/api/deepseek/collaborative', async (req, res) => {
    try {
        const { message, context = {} } = req.body;
        
        if (!message) {
            return res.status(400).json({
                success: false,
                error: '消息不能为空',
                message: '请提供消息内容'
            });
        }
        
        const result = await deepseekClient.collaborativeChat(context, message);
        res.json({
            success: true,
            data: result,
            message: '协作对话完成'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            message: '协作对话失败'
        });
    }
});

// 获取智能体列表
app.get('/api/deepseek/agents', (req, res) => {
    const agents = Object.entries(AGENT_ROLES).map(([type, config]) => ({
        type,
        name: config.name,
        description: config.systemPrompt.split('\n')[0],
        temperature: config.temperature
    }));
    
    res.json({
        success: true,
        data: agents,
        count: agents.length,
        message: '智能体列表获取成功'
    });
});

// 健康检查
app.get('/api/deepseek/health', (req, res) => {
    res.json({
        success: true,
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// 错误处理中间件
app.use((err, req, res, next) => {
    console.error('服务器错误:', err.stack);
    res.status(err.status || 500).json({
        success: false,
        error: err.message || '内部服务器错误',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// 404处理
app.use((req, res) => {
    res.status(404).json({
        error: '路由未找到',
        path: req.path,
        method: req.method
    });
});

// 启动服务器
if (require.main === module) {
    // 检查API密钥
    if (!DEEPSEEK_CONFIG.apiKey) {
        console.error('❌ 错误: 未设置DeepSeek API密钥');
        console.log('请设置环境变量 DEEPSEEK_API_KEY');
        console.log('或者在项目根目录创建 .env 文件，添加:');
        console.log('DEEPSEEK_API_KEY=你的DeepSeek_API密钥');
        process.exit(1);
    }
    
    app.listen(PORT, () => {
        console.log(`🚀 DeepSeek API集成服务运行在 http://localhost:${PORT}`);
        console.log(`🔗 测试连接: http://localhost:${PORT}/api/deepseek/test`);
        console.log(`🤖 可用智能体: ${Object.keys(AGENT_ROLES).join(', ')}`);
        console.log(`📝 请确保已设置有效的DeepSeek API密钥`);
    });
}

module.exports = {
    app,
    DeepSeekClient,
    AGENT_ROLES
};