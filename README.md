# 🦙 Ollama Web Interface

A clean, modern web interface for interacting with Ollama API models. This application provides an easy-to-use chat interface where you can select different AI models and have conversations with them.

![Ollama Web Interface](https://img.shields.io/badge/Node.js-v16+-green) ![License](https://img.shields.io/badge/license-MIT-blue)

## Features

- 🎯 **Model Selection**: Choose from available Ollama models
- 💬 **Chat Interface**: Clean, modern chat UI with message history
- ⚙️ **Customizable Settings**: Adjust temperature and max tokens
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🔄 **Real-time Status**: Connection status monitoring
- 🧹 **Clear Chat**: Reset conversation history
- 🚀 **Fast & Lightweight**: Minimal dependencies

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Access to an Ollama API endpoint

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/obvTiger/ollama-web-interface.git
   cd ollama-web-interface
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the application**
   ```bash
   npm start
   ```

   For development with auto-reload:
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## Configuration

The application is configured to use the Ollama API at:
```
https://ollama-fast-deployment.onwireway.online
```

If you need to change the API endpoint, modify the `OLLAMA_API_URL` constant in `server.js`:

```javascript
const OLLAMA_API_URL = 'your-ollama-api-endpoint';
```

You can also set it via environment variable:
```bash
OLLAMA_API_URL=https://your-endpoint.com npm start
```

## Usage

1. **Select a Model**: Choose from the available models in the sidebar
2. **Adjust Settings**: Configure temperature and max tokens as needed
3. **Start Chatting**: Type your message and press Enter or click Send
4. **View Responses**: See AI responses in the chat area
5. **Clear Chat**: Use the Clear Chat button to reset the conversation

### Settings

- **Temperature** (0.0 - 1.0): Controls creativity/randomness of responses
  - Lower values (0.1-0.3): More focused and deterministic
  - Higher values (0.7-1.0): More creative and varied

- **Max Tokens**: Maximum length of the AI response (1-4000)

## API Endpoints

The application provides several API endpoints:

- `GET /api/models` - Get available models
- `POST /api/chat` - Send chat messages
- `POST /api/generate` - Generate completions
- `GET /api/health` - Check API health status

## Project Structure

```
ollama-web-interface/
├── server.js              # Express server
├── package.json           # Dependencies and scripts
├── public/
│   ├── index.html        # Main HTML file
│   ├── styles.css        # CSS styles
│   └── app.js            # Frontend JavaScript
└── README.md             # This file
```

## Development

To contribute to this project:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Adding New Features

The application is structured with a clear separation between frontend and backend:

- **Backend** (`server.js`): Express server handling API requests
- **Frontend** (`public/`): Static files served to the browser

## Deployment

### Environment Variables

- `PORT`: Server port (default: 3000)
- `OLLAMA_API_URL`: Ollama API endpoint URL

### Production Deployment

1. **Using Node.js directly**:
   ```bash
   npm install --production
   NODE_ENV=production npm start
   ```

2. **Using PM2**:
   ```bash
   npm install -g pm2
   pm2 start server.js --name ollama-web-interface
   ```

3. **Using Docker** (create Dockerfile):
   ```dockerfile
   FROM node:16-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm install --production
   COPY . .
   EXPOSE 3000
   CMD ["npm", "start"]
   ```

## Troubleshooting

### Common Issues

1. **Models not loading**
   - Check if the Ollama API endpoint is accessible
   - Verify the API URL in server.js
   - Check network connectivity

2. **Connection errors**
   - Ensure the Ollama service is running
   - Check firewall settings
   - Verify CORS configuration

3. **Slow responses**
   - Check your internet connection
   - Try reducing max tokens
   - Use a faster model if available

### Debug Mode

Set the `DEBUG` environment variable to get more detailed logs:
```bash
DEBUG=* npm start
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Ollama](https://ollama.ai/) for providing the AI model API
- [Express.js](https://expressjs.com/) for the web framework
- [Axios](https://axios-http.com/) for HTTP requests

## Support

If you encounter any issues or have questions, please [open an issue](https://github.com/obvTiger/ollama-web-interface/issues) on GitHub.

---

**Happy chatting with AI! 🤖✨**