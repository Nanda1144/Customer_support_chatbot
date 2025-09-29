// Chatbot responses based on user input
const botResponses = {
    greeting: [
        "Hello! How can I assist you today?",
        "Hi there! What can I help you with?",
        "Good day! How may I be of service?"
    ],
    "order status": [
        "To check your order status, please provide your order number.",
        "I can help you track your order. Could you please share your order ID?",
        "For order status inquiries, I'll need your order number. Can you provide that?"
    ],
    returns: [
        "Our return policy allows returns within 30 days of purchase. Would you like to initiate a return?",
        "You can return items in their original condition within 30 days. Do you need help with a return?",
        "I can assist you with processing a return. What item would you like to return?"
    ],
    "technical support": [
        "I'm here to help with technical issues. Could you describe the problem you're experiencing?",
        "For technical support, please provide details about the issue you're facing.",
        "I can help troubleshoot technical problems. What seems to be the issue?"
    ],
    billing: [
        "I can assist with billing inquiries. What specific billing question do you have?",
        "For billing questions, please provide your account details and describe the issue.",
        "I'm here to help with billing concerns. How can I assist you today?"
    ],
    default: [
        "I'm not sure how to respond to that. Could you please rephrase your question?",
        "I don't have information about that topic. Is there something else I can help with?",
        "I'm still learning. Could you try asking in a different way?"
    ]
};

// Initialize the chatbot
document.addEventListener('DOMContentLoaded', () => {
    const chatbotContainer = document.getElementById('chatbotContainer');
    const chatbotLauncher = document.getElementById('chatbotLauncher');
    const minimizeBtn = document.getElementById('minimizeBtn');
    const closeBtn = document.getElementById('closeBtn');
    const colorPickerBtn = document.getElementById('colorPickerBtn');
    const colorPicker = document.getElementById('colorPicker');
    const colorOptions = document.querySelectorAll('.color-option');
    const chatbotInput = document.getElementById('chatbotInput');
    
    // Show chatbot when launcher is clicked
    chatbotLauncher.addEventListener('click', () => {
        chatbotContainer.style.display = 'flex';
        chatbotLauncher.style.display = 'none';
        chatbotInput.focus();
    });
    
    // Minimize chatbot
    minimizeBtn.addEventListener('click', () => {
        chatbotContainer.classList.add('minimized');
    });
    
    // Restore chatbot when minimized
    chatbotContainer.addEventListener('click', (e) => {
        if (chatbotContainer.classList.contains('minimized') && 
            !e.target.closest('.chatbot-header')) {
            chatbotContainer.classList.remove('minimized');
        }
    });
    
    // Close chatbot
    closeBtn.addEventListener('click', () => {
        chatbotContainer.style.display = 'none';
        chatbotLauncher.style.display = 'flex';
    });
    
    // Toggle color picker
    colorPickerBtn.addEventListener('click', () => {
        colorPicker.classList.toggle('show');
    });
    
    // Change theme when color is selected
    colorOptions.forEach(option => {
        option.addEventListener('click', () => {
            const color = option.getAttribute('data-color');
            chatbotContainer.className = `chatbot-container theme-${color}`;
            colorPicker.classList.remove('show');
        });
    });
    
    // Close color picker when clicking outside
    document.addEventListener('click', (e) => {
        if (!colorPickerBtn.contains(e.target) && !colorPicker.contains(e.target)) {
            colorPicker.classList.remove('show');
        }
    });
    
    // Add quick reply options to the first bot message
    addQuickReplyOptions();
});

// Add quick reply options to the first bot message
function addQuickReplyOptions() {
    const messages = document.querySelectorAll('.message.bot');
    if (messages.length > 0) {
        const firstBotMessage = messages[0];
        const quickReplyContainer = document.createElement('div');
        quickReplyContainer.className = 'quick-reply-options';
        quickReplyContainer.innerHTML = `
           <br> <button class="quick-reply-btn" onclick="handleQuickReply('Order Status')">Order Status</button><br>
            <button class="quick-reply-btn" onclick="handleQuickReply('Returns')">Returns</button><br>
            <button class="quick-reply-btn" onclick="handleQuickReply('Technical Support')">Technical Support</button><br>
            <button class="quick-reply-btn" onclick="handleQuickReply('Billing')">Billing</button><br>
        `;
        firstBotMessage.appendChild(quickReplyContainer);
    }
}

// Handle quick reply button clicks
function handleQuickReply(option) {
    document.getElementById('chatbotInput').value = option;
    sendMessage();
}

// Handle Enter key press
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// Send user message and get bot response
function sendMessage() {
    const chatbotInput = document.getElementById('chatbotInput');
    const userMessage = chatbotInput.value.trim();
    
    if (userMessage === '') return;
    
    // Add user message to chat
    addMessage('user', userMessage);
    
    // Clear input field
    chatbotInput.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    // Process user message and generate bot response
    setTimeout(() => {
        hideTypingIndicator();
        const botResponse = generateBotResponse(userMessage);
        addMessage('bot', botResponse);
    }, 1500);
}

// Add a message to the chat
function addMessage(sender, content) {
    const chatbotMessages = document.getElementById('chatbotMessages');
    const messageTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    const avatarDiv = document.createElement('div');
    avatarDiv.className = `message-avatar ${sender}-avatar`;
    avatarDiv.innerHTML = sender === 'bot' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
    
    const contentDiv = document.createElement('div');
    contentDiv.innerHTML = `
        <div class="message-content">${content}</div>
        <div class="message-time">${messageTime}</div>
    `;
    
    if (sender === 'bot') {
        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);
    } else {
        messageDiv.appendChild(contentDiv);
        messageDiv.appendChild(avatarDiv);
    }
    
    chatbotMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// Generate bot response based on user input
function generateBotResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    // Check for keywords in the user message
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
        return getRandomResponse(botResponses.greeting);
    } else if (message.includes('order') || message.includes('shipping') || message.includes('delivery')) {
        return getRandomResponse(botResponses["order status"]);
    } else if (message.includes('return') || message.includes('refund')) {
        return getRandomResponse(botResponses.returns);
    } else if (message.includes('technical') || message.includes('issue') || message.includes('problem') || message.includes('help')) {
        return getRandomResponse(botResponses["technical support"]);
    } else if (message.includes('bill') || message.includes('payment') || message.includes('charge')) {
        return getRandomResponse(botResponses.billing);
    } else {
        return getRandomResponse(botResponses.default);
    }
}

// Get a random response from an array of responses
function getRandomResponse(responses) {
    return responses[Math.floor(Math.random() * responses.length)];
}

// Show typing indicator
function showTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    typingIndicator.style.display = 'block';
    
    // Scroll to bottom
    const chatbotMessages = document.getElementById('chatbotMessages');
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// Hide typing indicator
function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    typingIndicator.style.display = 'none';
}