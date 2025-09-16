document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const chatContainer = document.querySelector('.chat-container');
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const quickActionBtns = document.querySelectorAll('.quick-action-btn');
    const typingIndicator = document.getElementById('typing-indicator');
    const themeToggle = document.getElementById('theme-toggle');
    const minimizeBtn = document.getElementById('minimize-btn');
    const closeBtn = document.getElementById('close-btn');
    const openChatBtn = document.getElementById('open-chat-btn');
    const chatWidget = document.getElementById('chat-widget');
    
    // Chatbot responses
    const responses = {
        "hello": "Hello! How can I assist you today?",
        "hi": "Hi there! What can I do for you?",
        "how are you": "I'm just a bot, but I'm functioning perfectly! How about you?",
        "what is your name": "I'm SupportBot, your virtual assistant.",
        "where is my order": "To check your order status, please provide your order number. I'll help you track it right away!",
        "how do i return an item": "You can return items within 30 days of purchase. Just go to 'My Orders' and select the item you want to return. Would you like more details about the return process?",
        "talk to a human agent": "I'll connect you with a human agent shortly. Please hold on while I transfer your chat.",
        "default": "I'm not sure how to respond to that. Could you try rephrasing your question or ask something else?",
        "thanks": "You're welcome! Is there anything else I can help you with?",
        "thank you": "You're welcome! Is there anything else I can help you with?",
        "bye": "Goodbye! Feel free to come back if you have more questions.",
        "goodbye": "Goodbye! Feel free to come back if you have more questions."
    };
    
    // Initialize chat
    function initChat() {
        // Check for saved theme
        const savedTheme = localStorage.getItem('chat-theme');
        if (savedTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
        
        // Check if chat was minimized
        const isMinimized = localStorage.getItem('chat-minimized') === 'true';
        if (isMinimized) {
            chatContainer.classList.add('minimized');
            chatWidget.classList.remove('minimized');
        }
        
        // Load chat history
        loadChatHistory();
    }
    
    // Load chat history from localStorage
    function loadChatHistory() {
        const chatHistory = localStorage.getItem('chat-history');
        if (chatHistory) {
            const messages = JSON.parse(chatHistory);
            messages.forEach(msg => {
                addMessageToChat(msg.content, msg.sender, false);
            });
        }
    }
    
    // Save chat to localStorage
    function saveChatToHistory(content, sender) {
        let chatHistory = localStorage.getItem('chat-history');
        if (!chatHistory) {
            chatHistory = [];
        } else {
            chatHistory = JSON.parse(chatHistory);
        }
        
        chatHistory.push({
            content,
            sender,
            timestamp: new Date().toISOString()
        });
        
        // Keep only the last 50 messages
        if (chatHistory.length > 50) {
            chatHistory = chatHistory.slice(chatHistory.length - 50);
        }
        
        localStorage.setItem('chat-history', JSON.stringify(chatHistory));
    }
    
    // Add message to chat
    function addMessageToChat(message, sender, save = true) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);
        
        const avatar = document.createElement('div');
        avatar.classList.add('message-avatar');
        avatar.innerHTML = sender === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
        
        const content = document.createElement('div');
        content.classList.add('message-content');
        
        const messageText = document.createElement('p');
        messageText.textContent = message;
        
        const time = document.createElement('div');
        time.classList.add('message-time');
        time.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        content.appendChild(messageText);
        content.appendChild(time);
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        if (save) {
            saveChatToHistory(message, sender);
        }
    }
    
    // Show typing indicator
    function showTypingIndicator() {
        typingIndicator.style.display = 'flex';
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Hide typing indicator
    function hideTypingIndicator() {
        typingIndicator.style.display = 'none';
    }
    
    // Get bot response
    function getBotResponse(userMessage) {
        const lowerCaseMessage = userMessage.toLowerCase();
        
        // Check for exact matches first
        if (responses[lowerCaseMessage]) {
            return responses[lowerCaseMessage];
        }
        
        // Check for partial matches
        for (const key in responses) {
            if (key !== 'default' && lowerCaseMessage.includes(key)) {
                return responses[key];
            }
        }
        
        // Return default response if no match found
        return responses.default;
    }
    
    // Handle user message
    function handleUserMessage() {
        const message = userInput.value.trim();
        if (message === '') return;
        
        addMessageToChat(message, 'user');
        userInput.value = '';
        
        showTypingIndicator();
        
        // Simulate bot thinking time
        setTimeout(() => {
            hideTypingIndicator();
            const botResponse = getBotResponse(message);
            addMessageToChat(botResponse, 'bot');
            
            // If user wants to talk to a human agent
            if (message.toLowerCase().includes('human agent')) {
                setTimeout(() => {
                    addMessageToChat('A human agent will join the chat shortly. Please wait a moment...', 'bot');
                }, 1500);
            }
        }, 1000);
    }
    
    // Event Listeners
    sendBtn.addEventListener('click', handleUserMessage);
    
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleUserMessage();
        }
    });
    
    quickActionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const message = this.getAttribute('data-message');
            userInput.value = message;
            handleUserMessage();
        });
    });
    
    // Theme toggle
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        this.innerHTML = newTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        
        localStorage.setItem('chat-theme', newTheme);
    });
    
    // Minimize chat
    minimizeBtn.addEventListener('click', function() {
        chatContainer.classList.add('minimized');
        chatWidget.classList.remove('minimized');
        localStorage.setItem('chat-minimized', 'true');
    });
    
    // Close chat
    closeBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to close the chat? Your conversation history will be saved.')) {
            chatContainer.classList.add('minimized');
            chatWidget.classList.remove('minimized');
            localStorage.setItem('chat-minimized', 'true');
        }
    });
    
    // Open chat
    openChatBtn.addEventListener('click', function() {
        chatContainer.classList.remove('minimized');
        chatWidget.classList.add('minimized');
        localStorage.setItem('chat-minimized', 'false');
        userInput.focus();
    });
    
    // Initialize chat
    initChat();
});
