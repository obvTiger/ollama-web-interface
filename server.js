const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const OLLAMA_API_URL = 'https://ollama-fast-deployment.onwireway.online';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Get available models
app.get('/api/models', async (req, res) => {
    try {
        const response = await axios.get(`${OLLAMA_API_URL}/api/tags`);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching models:', error.message);
        res.status(500).json({ 
            error: 'Failed to fetch models',
            details: error.message 
        });
    }
});

// Generate completion
app.post('/api/generate', async (req, res) => {
    try {
        const { model, prompt, options = {} } = req.body;
        
        if (!model || !prompt) {
            return res.status(400).json({ 
                error: 'Model and prompt are required' 
            });
        }

        const response = await axios.post(`${OLLAMA_API_URL}/api/generate`, {
            model,
            prompt,
            stream: false,
            options
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error generating completion:', error.message);
        res.status(500).json({ 
            error: 'Failed to generate completion',
            details: error.message 
        });
    }
});

// Chat endpoint for conversation-style interactions
app.post('/api/chat', async (req, res) => {
    try {
        const { model, messages, options = {} } = req.body;
        
        if (!model || !messages) {
            return res.status(400).json({ 
                error: 'Model and messages are required' 
            });
        }

        const response = await axios.post(`${OLLAMA_API_URL}/api/chat`, {
            model,
            messages,
            stream: false,
            options
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error in chat:', error.message);
        res.status(500).json({ 
            error: 'Failed to process chat',
            details: error.message 
        });
    }
});

// Health check
app.get('/api/health', async (req, res) => {
    try {
        const response = await axios.get(`${OLLAMA_API_URL}/api/tags`);
        res.json({ 
            status: 'healthy', 
            ollama_status: 'connected',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(503).json({ 
            status: 'unhealthy', 
            ollama_status: 'disconnected',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Open http://localhost:${PORT} to view the application`);
});