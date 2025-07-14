/**
 * ERP Chat Widget - Embeddable AI Assistant
 * Compact, collapsible chat widget for integration across ERP modules
 */

class ERPChatWidget {
    constructor(options = {}) {
        this.options = {
            apiUrl: options.apiUrl || 'http://127.0.0.1:8000',
            position: options.position || 'bottom-right',
            theme: options.theme || 'professional',
            minimized: options.minimized !== false, // Default to minimized
            ...options
        };

        this.isOpen = !this.options.minimized;
        this.currentChatId = this.generateChatId();
        this.messages = this.loadMessages();
        
        this.init();
    }

    init() {
        this.createWidget();
        this.attachEventListeners();
        this.loadPersistedState();
    }

    generateChatId() {
        return 'chat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    createWidget() {
        // Create widget container
        this.widget = document.createElement('div');
        this.widget.id = 'erp-chat-widget';
        this.widget.className = `erp-chat-widget ${this.options.position} ${this.isOpen ? 'open' : 'minimized'}`;
        
        this.widget.innerHTML = `
            <!-- Chat Toggle Button -->
            <div class="chat-toggle" id="chatToggle">
                <div class="chat-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16Z" fill="currentColor"/>
                        <circle cx="7" cy="9" r="1" fill="currentColor"/>
                        <circle cx="12" cy="9" r="1" fill="currentColor"/>
                        <circle cx="17" cy="9" r="1" fill="currentColor"/>
                    </svg>
                </div>
                <div class="notification-badge" id="notificationBadge" style="display: none;">1</div>
            </div>

            <!-- Chat Window -->
            <div class="chat-window" id="chatWindow">
                <div class="chat-header">
                    <div class="chat-title">
                        <span class="title-text">AI Assistant</span>
                        <span class="status-indicator">●</span>
                    </div>
                    <div class="chat-controls">
                        <button class="control-btn minimize-btn" id="minimizeBtn" title="Minimize">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="M19 13H5V11H19V13Z" fill="currentColor"/>
                            </svg>
                        </button>
                    </div>
                </div>

                <div class="chat-messages" id="chatMessages">
                    <div class="welcome-message">
                        <div class="bot-avatar">💬</div>
                        <div class="welcome-text">
                            <p>Hi! I'm your AI assistant. How can I help you today?</p>
                        </div>
                    </div>
                </div>

                <div class="chat-input-container">
                    <div class="chat-input">
                        <input type="text" id="messageInput" placeholder="Type your message..." maxlength="500">
                        <button class="send-btn" id="sendBtn" disabled>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" fill="currentColor"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Add styles
        this.addStyles();
        
        // Append to body
        document.body.appendChild(this.widget);
    }

    addStyles() {
        if (document.getElementById('erp-chat-widget-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'erp-chat-widget-styles';
        styles.textContent = `
            .erp-chat-widget {
                position: fixed;
                z-index: 10000;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .erp-chat-widget.bottom-right {
                bottom: 20px;
                right: 20px;
            }

            .erp-chat-widget.bottom-left {
                bottom: 20px;
                left: 20px;
            }

            .chat-toggle {
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                transition: all 0.3s ease;
                position: relative;
            }

            .chat-toggle:hover {
                transform: scale(1.05);
                box-shadow: 0 6px 25px rgba(0, 0, 0, 0.2);
            }

            .chat-icon {
                color: white;
                transition: transform 0.3s ease;
            }

            .erp-chat-widget.open .chat-icon {
                transform: rotate(180deg);
            }

            .notification-badge {
                position: absolute;
                top: -5px;
                right: -5px;
                background: #ff4757;
                color: white;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                font-size: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
            }

            .chat-window {
                position: absolute;
                bottom: 70px;
                right: 0;
                width: 350px;
                height: 500px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
                display: flex;
                flex-direction: column;
                opacity: 0;
                transform: translateY(20px) scale(0.95);
                pointer-events: none;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .erp-chat-widget.open .chat-window {
                opacity: 1;
                transform: translateY(0) scale(1);
                pointer-events: all;
            }

            .chat-header {
                padding: 16px 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border-radius: 12px 12px 0 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .chat-title {
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .title-text {
                font-weight: 600;
                font-size: 16px;
            }

            .status-indicator {
                color: #4ade80;
                font-size: 12px;
            }

            .chat-controls {
                display: flex;
                gap: 8px;
            }

            .control-btn {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                border-radius: 6px;
                width: 28px;
                height: 28px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                color: white;
                transition: background 0.2s ease;
            }

            .control-btn:hover {
                background: rgba(255, 255, 255, 0.3);
            }

            .chat-messages {
                flex: 1;
                padding: 16px;
                overflow-y: auto;
                display: flex;
                flex-direction: column;
                gap: 12px;
            }

            .welcome-message {
                display: flex;
                gap: 12px;
                align-items: flex-start;
            }

            .bot-avatar {
                width: 32px;
                height: 32px;
                background: #f1f5f9;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 16px;
                flex-shrink: 0;
            }

            .welcome-text p {
                margin: 0;
                color: #64748b;
                font-size: 14px;
                line-height: 1.5;
            }

            .message {
                display: flex;
                gap: 12px;
                align-items: flex-start;
                animation: fadeInUp 0.3s ease;
            }

            .message.user {
                flex-direction: row-reverse;
            }

            .message-avatar {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                flex-shrink: 0;
            }

            .message.user .message-avatar {
                background: #667eea;
                color: white;
            }

            .message.bot .message-avatar {
                background: #f1f5f9;
                color: #64748b;
            }

            .message-content {
                max-width: 80%;
                background: #f8fafc;
                padding: 12px 16px;
                border-radius: 12px;
                font-size: 14px;
                line-height: 1.5;
                color: #334155;
            }

            .message.user .message-content {
                background: #667eea;
                color: white;
            }

            .chat-input-container {
                padding: 16px;
                border-top: 1px solid #e2e8f0;
            }

            .chat-input {
                display: flex;
                gap: 8px;
                align-items: center;
            }

            .chat-input input {
                flex: 1;
                padding: 12px 16px;
                border: 1px solid #e2e8f0;
                border-radius: 24px;
                font-size: 14px;
                outline: none;
                transition: border-color 0.2s ease;
            }

            .chat-input input:focus {
                border-color: #667eea;
            }

            .send-btn {
                width: 40px;
                height: 40px;
                background: #667eea;
                border: none;
                border-radius: 50%;
                color: white;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
            }

            .send-btn:disabled {
                background: #cbd5e1;
                cursor: not-allowed;
            }

            .send-btn:not(:disabled):hover {
                background: #5a67d8;
                transform: scale(1.05);
            }

            .typing-indicator {
                display: flex;
                gap: 12px;
                align-items: flex-start;
            }

            .typing-dots {
                display: flex;
                gap: 4px;
                padding: 12px 16px;
                background: #f8fafc;
                border-radius: 12px;
            }

            .typing-dot {
                width: 8px;
                height: 8px;
                background: #cbd5e1;
                border-radius: 50%;
                animation: typingPulse 1.4s infinite ease-in-out;
            }

            .typing-dot:nth-child(2) {
                animation-delay: 0.2s;
            }

            .typing-dot:nth-child(3) {
                animation-delay: 0.4s;
            }

            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @keyframes typingPulse {
                0%, 60%, 100% {
                    transform: scale(1);
                    opacity: 0.5;
                }
                30% {
                    transform: scale(1.2);
                    opacity: 1;
                }
            }

            /* Mobile responsiveness */
            @media (max-width: 768px) {
                .erp-chat-widget.bottom-right {
                    bottom: 10px;
                    right: 10px;
                }

                .chat-window {
                    width: calc(100vw - 40px);
                    height: calc(100vh - 120px);
                    max-width: 350px;
                    max-height: 500px;
                }
            }
        `;

        document.head.appendChild(styles);
    }

    attachEventListeners() {
        const chatToggle = this.widget.querySelector('#chatToggle');
        const minimizeBtn = this.widget.querySelector('#minimizeBtn');
        const messageInput = this.widget.querySelector('#messageInput');
        const sendBtn = this.widget.querySelector('#sendBtn');

        chatToggle.addEventListener('click', () => this.toggleWidget());
        minimizeBtn.addEventListener('click', () => this.minimizeWidget());
        
        messageInput.addEventListener('input', () => this.handleInputChange());
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        sendBtn.addEventListener('click', () => this.sendMessage());
    }

    toggleWidget() {
        this.isOpen = !this.isOpen;
        this.widget.classList.toggle('open', this.isOpen);
        this.saveState();
        
        if (this.isOpen) {
            this.widget.querySelector('#messageInput').focus();
        }
    }

    minimizeWidget() {
        this.isOpen = false;
        this.widget.classList.remove('open');
        this.saveState();
    }

    handleInputChange() {
        const input = this.widget.querySelector('#messageInput');
        const sendBtn = this.widget.querySelector('#sendBtn');
        sendBtn.disabled = !input.value.trim();
    }

    async sendMessage() {
        const input = this.widget.querySelector('#messageInput');
        const message = input.value.trim();
        
        if (!message) return;

        // Add user message
        this.addMessage(message, 'user');
        input.value = '';
        this.handleInputChange();

        // Show typing indicator
        this.showTypingIndicator();

        try {
            // Call API
            const response = await fetch(`${this.options.apiUrl}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    session_id: this.currentChatId,
                    include_search: false
                })
            });

            this.hideTypingIndicator();

            if (response.ok) {
                const data = await response.json();
                this.addMessage(data.response, 'bot');
            } else {
                this.addMessage('Sorry, I encountered an error. Please try again.', 'bot');
            }
        } catch (error) {
            this.hideTypingIndicator();
            this.addMessage('Unable to connect to the server. Please check your connection.', 'bot');
        }
    }

    addMessage(text, sender) {
        const messagesContainer = this.widget.querySelector('#chatMessages');
        
        // Remove welcome message if it exists
        const welcomeMessage = messagesContainer.querySelector('.welcome-message');
        if (welcomeMessage && sender === 'user') {
            welcomeMessage.remove();
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                ${sender === 'user' ? '👤' : '🤖'}
            </div>
            <div class="message-content">
                ${text}
            </div>
        `;

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Save message
        this.messages.push({
            text,
            sender,
            timestamp: new Date().toISOString()
        });
        this.saveMessages();
    }

    showTypingIndicator() {
        const messagesContainer = this.widget.querySelector('#chatMessages');
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.id = 'typingIndicator';
        
        typingDiv.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="typing-dots">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;

        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTypingIndicator() {
        const typingIndicator = this.widget.querySelector('#typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    saveState() {
        localStorage.setItem('erp-chat-widget-state', JSON.stringify({
            isOpen: this.isOpen,
            currentChatId: this.currentChatId
        }));
    }

    loadPersistedState() {
        try {
            const saved = localStorage.getItem('erp-chat-widget-state');
            if (saved) {
                const state = JSON.parse(saved);
                this.isOpen = state.isOpen || false;
                this.currentChatId = state.currentChatId || this.currentChatId;
                this.widget.classList.toggle('open', this.isOpen);
            }
        } catch (error) {
            console.warn('Failed to load chat widget state:', error);
        }
    }

    saveMessages() {
        localStorage.setItem(`erp-chat-messages-${this.currentChatId}`, JSON.stringify(this.messages));
    }

    loadMessages() {
        try {
            const saved = localStorage.getItem(`erp-chat-messages-${this.currentChatId}`);
            const messages = saved ? JSON.parse(saved) : [];

            // Restore messages to UI if any exist
            if (messages.length > 0) {
                setTimeout(() => this.restoreMessages(messages), 100);
            }

            return messages;
        } catch (error) {
            console.warn('Failed to load chat messages:', error);
            return [];
        }
    }

    restoreMessages(messages) {
        const messagesContainer = this.widget.querySelector('#chatMessages');
        const welcomeMessage = messagesContainer.querySelector('.welcome-message');

        if (messages.length > 0 && welcomeMessage) {
            welcomeMessage.remove();
        }

        messages.forEach(msg => {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${msg.sender}`;

            messageDiv.innerHTML = `
                <div class="message-avatar">
                    ${msg.sender === 'user' ? '👤' : '🤖'}
                </div>
                <div class="message-content">
                    ${msg.text}
                </div>
            `;

            messagesContainer.appendChild(messageDiv);
        });

        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Public API methods
    open() {
        this.isOpen = true;
        this.widget.classList.add('open');
        this.saveState();
    }

    close() {
        this.isOpen = false;
        this.widget.classList.remove('open');
        this.saveState();
    }

    destroy() {
        if (this.widget && this.widget.parentNode) {
            this.widget.parentNode.removeChild(this.widget);
        }
        const styles = document.getElementById('erp-chat-widget-styles');
        if (styles && styles.parentNode) {
            styles.parentNode.removeChild(styles);
        }
    }
}

// Auto-initialize if not in module environment
if (typeof module === 'undefined') {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.erpChatWidget = new ERPChatWidget();
        });
    } else {
        window.erpChatWidget = new ERPChatWidget();
    }
}

// Export for module environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ERPChatWidget;
}
