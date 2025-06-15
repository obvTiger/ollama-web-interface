class OllamaWebInterface {
    constructor() {
        this.currentModel = null;
        this.chatHistory = [];
        this.isLoading = false;
        
        this.initializeElements();
        this.setupEventListeners();
        this.loadModels();
        this.checkHealth();
        
        // Check health every 30 seconds
        setInterval(() => this.checkHealth(), 30000);
    }

    initializeElements() {
        this.modelSelect = document.getElementById('modelSelect');
        this.refreshButton = document.getElementById('refreshModels');
        this.temperatureSlider = document.getElementById('temperature');
        this.tempValue = document.getElementById('tempValue');
        this.maxTokensInput = document.getElementById('maxTokens');
        this.statusIndicator = document.getElementById('statusIndicator');
        this.statusText = document.getElementById('statusText');
        this.chatMessages = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.sendText = document.getElementById('sendText');
        this.sendSpinner = document.getElementById('sendSpinner');
        this.clearButton = document.getElementById('clearChat');
    }

    setupEventListeners() {
        this.modelSelect.addEventListener('change', (e) => {
            this.currentModel = e.target.value;
            this.updateInputState();
        });

        this.refreshButton.addEventListener('click', () => {
            this.loadModels();
        });

        this.temperatureSlider.addEventListener('input', (e) => {
            this.tempValue.textContent = e.target.value;
        });

        this.sendButton.addEventListener('click', () => {
            this.sendMessage();
        });

        this.messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        this.clearButton.addEventListener('click', () => {
            this.clearChat();
        });
    }

    async loadModels() {
        try {
            this.modelSelect.innerHTML = '<option value="">Loading models...</option>';
            this.modelSelect.disabled = true;

            const response = await fetch('/api/models');
            const data = await response.json();

            if (response.ok && data.models) {
                this.modelSelect.innerHTML = '<option value="">Select a model...</option>';
                
                data.models.forEach(model => {
                    const option = document.createElement('option');
                    option.value = model.name;
                    option.textContent = `${model.name} (${this.formatSize(model.size)})`;
                    this.modelSelect.appendChild(option);
                });

                this.modelSelect.disabled = false;
            } else {
                throw new Error(data.error || 'Failed to load models');
            }
        } catch (error) {
            console.error('Error loading models:', error);
            this.modelSelect.innerHTML = '<option value="">Error loading models</option>';
            this.updateStatus('error', 'Failed to load models');
        }
    }

    async checkHealth() {
        try {
            const response = await fetch('/api/health');
            const data = await response.json();

            if (response.ok && data.status === 'healthy') {
                this.updateStatus('healthy', 'Connected to Ollama');
            } else {
                this.updateStatus('error', 'Ollama disconnected');
            }
        } catch (error) {
            this.updateStatus('error', 'Connection error');
        }
    }

    updateStatus(status, message) {
        const dot = this.statusIndicator.querySelector('.status-dot');
        dot.className = `status-dot ${status === 'error' ? 'error' : ''}`;
        this.statusText.textContent = message;
    }

    updateInputState() {
        const hasModel = this.currentModel && this.currentModel.trim() !== '';
        this.messageInput.disabled = !hasModel;
        this.sendButton.disabled = !hasModel || this.isLoading;
        
        if (hasModel) {
            this.messageInput.placeholder = `Type your message for ${this.currentModel}...`;
        } else {
            this.messageInput.placeholder = 'Select a model first...';
        }
    }

    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message || !this.currentModel || this.isLoading) return;

        this.isLoading = true;
        this.updateInputState();
        this.updateSendButton(true);

        // Add user message to chat
        this.addMessage('user', message);
        this.messageInput.value = '';

        // Add user message to history
        this.chatHistory.push({ role: 'user', content: message });

        // Add loading message
        const loadingId = this.addLoadingMessage();

        try {
            const options = {
                temperature: parseFloat(this.temperatureSlider.value),
                num_predict: parseInt(this.maxTokensInput.value)
            };

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: this.currentModel,
                    messages: this.chatHistory,
                    options
                })
            });

            const data = await response.json();

            // Remove loading message
            this.removeLoadingMessage(loadingId);

            if (response.ok && data.message) {
                const assistantMessage = data.message.content;
                this.addMessage('assistant', assistantMessage);
                
                // Add assistant response to history
                this.chatHistory.push({ role: 'assistant', content: assistantMessage });
            } else {
                throw new Error(data.error || 'Failed to get response');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            this.removeLoadingMessage(loadingId);
            this.addMessage('assistant', `Error: ${error.message}`, true);
        } finally {
            this.isLoading = false;
            this.updateInputState();
            this.updateSendButton(false);
        }
    }

    addMessage(role, content, isError = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${role}`;

        const headerDiv = document.createElement('div');
        headerDiv.className = 'message-header';
        headerDiv.textContent = role === 'user' ? 'You' : this.currentModel;

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.textContent = content;

        if (isError) {
            contentDiv.style.color = '#e53e3e';
            contentDiv.style.fontStyle = 'italic';
        }

        messageDiv.appendChild(headerDiv);
        messageDiv.appendChild(contentDiv);

        // Remove welcome message if it exists
        const welcomeMessage = this.chatMessages.querySelector('.welcome-message');
        if (welcomeMessage) {
            welcomeMessage.remove();
        }

        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    addLoadingMessage() {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message assistant loading-message';
        messageDiv.innerHTML = `
            <div class="message-header">${this.currentModel}</div>
            <div class="message-content">
                <div class="loading-message">
                    <div class="spinner"></div>
                    <span>Thinking...</span>
                </div>
            </div>
        `;

        const loadingId = Date.now();
        messageDiv.setAttribute('data-loading-id', loadingId);

        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();

        return loadingId;
    }

    removeLoadingMessage(loadingId) {
        const loadingMessage = this.chatMessages.querySelector(`[data-loading-id="${loadingId}"]`);
        if (loadingMessage) {
            loadingMessage.remove();
        }
    }

    updateSendButton(isLoading) {
        if (isLoading) {
            this.sendText.style.display = 'none';
            this.sendSpinner.style.display = 'block';
        } else {
            this.sendText.style.display = 'block';
            this.sendSpinner.style.display = 'none';
        }
    }

    clearChat() {
        this.chatHistory = [];
        this.chatMessages.innerHTML = `
            <div class="welcome-message">
                <h3>Chat cleared!</h3>
                <p>Start a new conversation with your selected model.</p>
            </div>
        `;
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    formatSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new OllamaWebInterface();
});