const express = require('express');
const axios = require('axios');
const router = express.Router();

// 本地API代理 - 让前端通过我的服务器访问本地API
const LOCAL_API_BASE = 'http://localhost:3001/api';

// 代理中间件
const proxyRequest = async (req, res) => {
    try {
        const { method, originalUrl, body, headers } = req;
        const targetUrl = `${LOCAL_API_BASE}${originalUrl.replace('/api/proxy', '')}`;
        
        console.log(`🔗 代理请求: ${method} ${targetUrl}`);
        
        // 转发请求
        const response = await axios({
            method: method.toLowerCase(),
            url: targetUrl,
            data: body,
            headers: {
                ...headers,
                'host': 'localhost:3001',
                'x-forwarded-for': req.ip
            },
            timeout: 10000 // 10秒超时
        });
        
        // 转发响应
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error('代理请求失败:', error.message);
        
        if (error.response) {
            // 转发错误响应
            res.status(error.response.status).json(error.response.data);
        } else if (error.request) {
            // 请求发送失败
            res.status(503).json({
                success: false,
                error: '无法连接到本地API服务器',
                message: '请确保本地服务器正在运行'
            });
        } else {
            // 其他错误
            res.status(500).json({
                success: false,
                error: '代理服务器错误',
                message: error.message
            });
        }
    }
};

// 代理所有API请求
router.all('/*', proxyRequest);

module.exports = router;