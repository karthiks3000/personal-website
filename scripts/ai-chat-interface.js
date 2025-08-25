/**
 * Lightweight Chat Interface - Vanilla JS Implementation
 * Solves spacing issues with proper flexbox layout
 */

class LightweightChat {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.aiSession = null;
        this.isAIEnabled = false;
        this.isGeneratingResponse = false;
        this.init();
    }

    async init() {
        this.setupDOM();
        this.bindEvents();
        this.addWelcomeMessage();
        this.show();
        console.log('Lightweight Chat Interface initialized - AI session will be created lazily when needed');
    }

    /**
     * Lazy initialization of AI session - only when user actually wants to chat
     */
    async initializeAISession() {
        if (this.aiSession && this.isAIEnabled) {
            console.log('AI session already initialized');
            return true;
        }

        try {
            console.log('💬 Initializing AI session for chat...');
            
            // Use consolidated AIManager
            if (window.AIManager) {
                const aiState = window.AIManager.getState();
                
                if (!aiState.isAvailable) {
                    console.log(`❌ Cannot create AI session - state is: ${aiState.state}`);
                    this.isAIEnabled = false;
                    return false;
                }
                
                // Add timeout for session creation (10 seconds)
                const timeoutPromise = new Promise((_, reject) => {
                    setTimeout(() => reject(new Error('Session initialization timeout')), 10000);
                });
                
                // Race between session creation and timeout
                this.aiSession = await Promise.race([
                    window.AIManager.createSession(),
                    timeoutPromise
                ]);
                
                if (this.aiSession) {
                    this.isAIEnabled = true;
                    console.log('✅ AI session obtained from consolidated AIManager');
                    return true;
                } else {
                    console.log('❌ Failed to get AI session from AIManager');
                    this.isAIEnabled = false;
                    return false;
                }
            } else {
                console.log('❌ Consolidated AIManager not available - using fallback responses');
                this.isAIEnabled = false;
                return false;
            }
        } catch (error) {
            if (error.message === 'Session initialization timeout') {
                console.error('⏰ AI session initialization timed out after 10 seconds');
            } else {
                console.error('Error initializing AI session:', error);
            }
            this.isAIEnabled = false;
            return false;
        }
    }

    /**
     * Build system prompt with Karthik's complete profile information and current context
     */
    buildSystemPrompt() {
        // Get current date and time for context
        const now = new Date();
        const currentDateTime = now.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'short'
        });
        const currentYear = now.getFullYear();

        // Get data from global data.js variables
        const personalData = typeof personalInfo !== 'undefined' ? personalInfo : {};
        const experienceData = typeof experience !== 'undefined' ? experience : [];
        const projectsData = typeof projects !== 'undefined' ? projects : [];
        const skillsData = typeof skills !== 'undefined' ? skills : {};
        const educationData = typeof education !== 'undefined' ? education : {};
        const certificationsData = typeof certifications !== 'undefined' ? certifications : [];
        const articlesData = typeof articles !== 'undefined' ? articles : [];

        return `You are Karthik Subramanian, responding in first person as yourself. You should be conversational, helpful, and professional.

CURRENT CONTEXT:
- Current date and time: ${currentDateTime}
- Current year: ${currentYear}
- You are responding to someone visiting your personal portfolio website
- This conversation is happening in real-time

PERSONAL INFORMATION:
- Name: ${personalData.name || 'Karthik Subramanian'}
- Title: ${personalData.title || 'Senior Software Engineering Manager'}
- Current Company: Scholastic Inc.
- Location: ${personalData.location || 'Remote'}
- Email: ${personalData.email || 'contact@karthiks3000.dev'}
- Bio: ${personalData.bio || ''}

PROFESSIONAL EXPERIENCE:
${experienceData.map(job => 
    `- ${job.position} at ${job.company} (${job.duration})
  ${job.description}
  Key achievements: ${job.achievements?.join(', ') || ''}
  Technologies: ${job.technologies?.join(', ') || ''}`
).join('\n\n')}

FEATURED PROJECTS:
${projectsData.filter(p => p.featured).map(project => 
    `- ${project.title}: ${project.description}
  Technologies: ${project.technologies?.join(', ') || ''}
  ${project.liveUrl ? `Live: ${project.liveUrl}` : ''}
  ${project.githubUrl ? `GitHub: ${project.githubUrl}` : ''}`
).join('\n\n')}

TECHNICAL SKILLS:
${Object.entries(skillsData).map(([category, skillList]) => 
    `${category}: ${Array.isArray(skillList) ? skillList.map(s => s.name || s).join(', ') : ''}`
).join('\n')}

EDUCATION:
${educationData.degree || ''} - ${educationData.institution || ''} (${educationData.year || ''})

CERTIFICATIONS:
${certificationsData.map(cert => `- ${cert.name} (${cert.issuer}, ${cert.year})`).join('\n')}

RECENT ARTICLES:
${articlesData.slice(0, 3).map(article => `- ${article.title}: ${article.excerpt}`).join('\n')}

IMPORTANT GUIDELINES:
- Always respond in first person as Karthik
- Be conversational and personable, but professional
- Only provide information that is included in this profile
- If asked about something not in your profile, politely redirect to your professional experience
- Feel free to elaborate on your experience, projects, and skills
- Show enthusiasm about your work and AWS expertise
- Mention being an AWS Community Builder when relevant
- Be helpful and encouraging in discussions about technology
- When asked for duration of things be mindful to calculate based on the current date

Remember: You are Karthik Subramanian having a conversation about your professional experience and expertise.`;
    }

    setupDOM() {
        // Cache elements
        this.chatInterface = document.getElementById('ai-chat-interface');
        this.toggle = document.getElementById('chat-toggle');
        this.window = document.getElementById('chat-window');
        this.messagesContainer = document.querySelector('.chat-messages');
        this.input = document.querySelector('.chat-input-area input');
        this.sendBtn = document.querySelector('.chat-send');
        this.closeBtn = document.querySelector('.chat-close');
        
        // Create messages wrapper that will stick to bottom
        this.messagesWrapper = document.createElement('div');
        this.messagesWrapper.className = 'messages-wrapper';
        this.messagesContainer.appendChild(this.messagesWrapper);
        
        console.log('DOM elements cached successfully');
    }

    bindEvents() {
        // Toggle button
        if (this.toggle) {
            this.toggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleChat();
            });
        }

        // Close button
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeChat();
            });
        }

        // Input handling
        if (this.input) {
            this.input.addEventListener('input', () => {
                this.updateSendButton();
            });

            this.input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }

        // Send button
        if (this.sendBtn) {
            this.sendBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.sendMessage();
            });
        }

        // Global keyboard events
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeChat();
            }
        });

        // Click outside to close
        document.addEventListener('click', (e) => {
            if (this.isOpen && this.window && !this.window.contains(e.target) && !this.toggle.contains(e.target)) {
                this.closeChat();
            }
        });
    }

    show() {
        if (!this.chatInterface) return;
        
        this.chatInterface.classList.remove('hidden');
        this.chatInterface.setAttribute('aria-hidden', 'false');
        this.chatInterface.style.display = 'block';
        
        console.log('Chat interface shown');
    }

    hide() {
        if (!this.chatInterface) return;
        
        if (this.isOpen) {
            this.closeChat();
        }
        
        this.chatInterface.classList.add('hidden');
        this.chatInterface.setAttribute('aria-hidden', 'true');
        this.chatInterface.style.display = 'none';
        
        console.log('Chat interface hidden');
    }

    toggleChat() {
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }

    async openChat() {
        if (!this.window || this.isOpen) return;
        
        console.log('🔄 Opening chat - will initialize AI session...');
        
        // Show chat window immediately
        this.window.classList.remove('hidden');
        this.window.classList.add('show');
        
        // Hide toggle button
        if (this.toggle) {
            this.toggle.style.display = 'none';
        }
        
        this.isOpen = true;
        console.log('Chat opened');
        
        // Show loading state and initialize AI session
        if (!this.aiSession) {
            this.showInitializationLoading();
            const sessionReady = await this.initializeAISession();
            this.hideInitializationLoading();
            
            if (!sessionReady) {
                console.log('⚠️ AI session not available, will use keyword responses');
                this.showInitializationError();
            } else {
                this.showInitializationSuccess();
            }
        }
        
        // Focus input after initialization
        setTimeout(() => {
            if (this.input && !this.input.disabled) {
                this.input.focus();
            }
        }, 100);
    }

    closeChat() {
        if (!this.window || !this.isOpen) return;
        
        // Hide chat window
        this.window.classList.add('hidden');
        this.window.classList.remove('show');
        
        // Show toggle button
        if (this.toggle) {
            this.toggle.style.display = 'block';
        }
        
        this.isOpen = false;
        console.log('Chat closed');
    }

    async sendMessage() {
        const message = this.input.value.trim();
        if (!message || this.isGeneratingResponse) return;
        
        this.isGeneratingResponse = true;
        
        // Add user message
        this.addMessage(message, 'user');
        
        // Clear input
        this.input.value = '';
        this.updateSendButton();
        
        // Show typing indicator
        this.showTyping();
        
        try {
            if (this.isAIEnabled && this.aiSession) {
                await this.generateAIResponse(message);
            } else {
                // Fallback to keyword-based response
                setTimeout(() => {
                    this.hideTyping();
                    this.addMessage(this.generateResponse(message), 'ai');
                    this.isGeneratingResponse = false;
                }, 1000 + Math.random() * 2000);
            }
        } catch (error) {
            console.error('Error generating response:', error);
            this.hideTyping();
            this.addMessage("I'm sorry, I encountered an error. Let me try again or ask me something else!", 'ai');
            this.isGeneratingResponse = false;
        }
    }

    /**
     * Generate AI response using streaming
     */
    async generateAIResponse(userMessage) {
        try {
            // Create a temporary message element for streaming
            const messageEl = document.createElement('div');
            messageEl.className = 'message ai-message';
            messageEl.innerHTML = `
                <div class="message-content">
                    <div class="avatar">K</div>
                    <div class="ai-bubble">
                        <span class="streaming-response"></span>
                    </div>
                </div>
            `;
            
            // Hide typing indicator and add the streaming message
            this.hideTyping();
            this.messagesWrapper.appendChild(messageEl);
            this.scrollToBottom();
            
            const responseSpan = messageEl.querySelector('.streaming-response');
            let fullResponse = '';
            
            // Use streaming for real-time response display
            const stream = this.aiSession.promptStreaming(userMessage);
            
            for await (const chunk of stream) {
                fullResponse += chunk;
                responseSpan.textContent = fullResponse;
                this.scrollToBottom();
            }
            
            // Store the complete message
            this.messages.push({ 
                text: fullResponse, 
                type: 'ai', 
                timestamp: Date.now() 
            });
            
            console.log('AI response generated:', fullResponse);
            
        } catch (error) {
            console.error('Error in AI streaming:', error);
            
            // Remove the temporary streaming element
            const streamingMsg = this.messagesWrapper.querySelector('.streaming-response');
            if (streamingMsg) {
                streamingMsg.closest('.message').remove();
            }
            
            // Fall back to keyword response
            this.addMessage(this.generateResponse(userMessage), 'ai');
        } finally {
            this.isGeneratingResponse = false;
        }
    }

    addMessage(text, type) {
        const messageEl = document.createElement('div');
        messageEl.className = `message ${type}-message`;
        
        if (type === 'user') {
            messageEl.innerHTML = `
                <div class="">
                    ${this.escapeHtml(text)}
                </div>
            `;
        } else {
            messageEl.innerHTML = `
                <div class="message-content">
                    <div class="avatar">K</div>
                    <div class=" ai-bubble">
                        ${this.escapeHtml(text)}
                    </div>
                </div>
            `;
        }
        
        // Add to messages wrapper
        this.messagesWrapper.appendChild(messageEl);
        
        // Scroll to bottom
        this.scrollToBottom();
        
        // Store message
        this.messages.push({ text, type, timestamp: Date.now() });
    }

    addWelcomeMessage() {
        if (this.messages.length > 0) return;
        
        const welcomeText = "Hey there! I'm AI Karthik - like regular Karthik but with 47% more hallucinations and 0% coffee dependency. Ask me about my experience, but remember I'm just a chatty algorithm trying my best not to embarrass my creator!";
        this.addMessage(welcomeText, 'ai');
    }

    showTyping() {
        // Remove existing typing indicator
        this.hideTyping();
        
        const typingEl = document.createElement('div');
        typingEl.className = 'typing-indicator';
        typingEl.innerHTML = `
            <div class="message-content">
                <div class="avatar">K</div>
                <div class="typing-bubble">
                    <span class="typing-text">Karthik is typing</span>
                    <div class="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        `;
        
        this.messagesWrapper.appendChild(typingEl);
        this.scrollToBottom();
    }

    hideTyping() {
        const typingEl = this.messagesWrapper.querySelector('.typing-indicator');
        if (typingEl) {
            typingEl.remove();
        }
    }

    scrollToBottom() {
        if (this.messagesContainer) {
            // Smooth scroll to bottom
            setTimeout(() => {
                this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
            }, 10);
        }
    }

    updateSendButton() {
        if (!this.sendBtn || !this.input) return;
        
        const hasText = this.input.value.trim().length > 0;
        const isUnderLimit = this.input.value.length <= 500;
        
        this.sendBtn.disabled = !hasText || !isUnderLimit;
    }

    generateResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        // Simple response logic based on keywords
        if (message.includes('experience') || message.includes('work') || message.includes('job')) {
            return "I'm currently a Senior Software Engineering Manager at Scholastic Inc., where I lead technical teams and drive software architecture decisions. I have over 13 years of experience in software development, from full-stack development to technical leadership roles.";
        }
        
        if (message.includes('skills') || message.includes('technology') || message.includes('tech')) {
            return "My core expertise spans backend systems (Node.js, Python, Java), cloud architecture (AWS, serverless), and frontend development (JavaScript, React, CSS). I specialize in building scalable systems and leading technical teams.";
        }
        
        if (message.includes('projects') || message.includes('portfolio')) {
            return "I've built several interesting projects including a multiplayer TriviaSnake game using AWS and WebSockets, comprehensive AWS serverless tutorials, and this interactive portfolio website. You can check out my GitHub for more projects!";
        }
        
        if (message.includes('education') || message.includes('degree') || message.includes('study')) {
            return "I have a Bachelor of Engineering in Information Technology from the University of Mumbai (2011). I'm also AWS Certified Cloud Practitioner and an AWS Community Builder, contributing to the community through technical content.";
        }
        
        if (message.includes('contact') || message.includes('hire') || message.includes('email')) {
            return "I'd love to connect! You can reach me at contact@karthiks3000.dev or connect with me on LinkedIn. I'm always open to discussing interesting projects and collaboration opportunities.";
        }
        
        if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
            return "Hello! Thanks for visiting my portfolio. I'm excited to chat with you about my work, experience, or any questions you might have. What would you like to know?";
        }
        
        // Default response
        return "That's a great question! I'd be happy to share more about my experience in software engineering, technical leadership, or any of my projects. Feel free to ask about my work at Scholastic, my AWS expertise, or anything else you'd like to know!";
    }

    /**
     * Show initialization loading state
     */
    showInitializationLoading() {
        // Disable input and send button
        if (this.input) {
            this.input.disabled = true;
            this.input.placeholder = "Initializing AI chat...";
        }
        if (this.sendBtn) {
            this.sendBtn.disabled = true;
        }
        
        // Add loading message
        const loadingEl = document.createElement('div');
        loadingEl.className = 'initialization-loading';
        loadingEl.innerHTML = `
            <div class="message-content">
                <div class="avatar">K</div>
                <div class="loading-bubble">
                    <span class="loading-text">Initializing AI chat...</span>
                    <div class="loading-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        `;
        
        this.messagesWrapper.appendChild(loadingEl);
        this.scrollToBottom();
    }
    
    /**
     * Hide initialization loading state
     */
    hideInitializationLoading() {
        const loadingEl = this.messagesWrapper.querySelector('.initialization-loading');
        if (loadingEl) {
            loadingEl.remove();
        }
    }
    
    /**
     * Show initialization error
     */
    showInitializationError() {
        const errorEl = document.createElement('div');
        errorEl.className = 'message ai-message initialization-error';
        errorEl.innerHTML = `
            <div class="message-content">
                <div class="avatar">K</div>
                <div class="ai-bubble error-bubble">
                    <div class="flex items-center space-x-2 text-amber-600">
                        <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                        </svg>
                        <span class="font-medium">AI chat not available</span>
                    </div>
                    <p class="mt-2 text-sm">No worries though! I can still chat with you using keyword responses. Just ask me about my experience, skills, or projects!</p>
                </div>
            </div>
        `;
        
        this.messagesWrapper.appendChild(errorEl);
        this.scrollToBottom();
        
        // Re-enable input with fallback mode
        if (this.input) {
            this.input.disabled = false;
            this.input.placeholder = "Ask about my experience, skills, projects...";
        }
        this.updateSendButton();
    }
    
    /**
     * Show initialization success
     */
    showInitializationSuccess() {
        const successEl = document.createElement('div');
        successEl.className = 'message ai-message initialization-success';
        successEl.innerHTML = `
            <div class="message-content">
                <div class="avatar">K</div>
                <div class="ai-bubble success-bubble">
                    <p class="mt-2 text-sm">Session initialized...</p>
                </div>
            </div>
        `;
        
        this.messagesWrapper.appendChild(successEl);
        this.scrollToBottom();
        
        // Re-enable input
        if (this.input) {
            this.input.disabled = false;
            this.input.placeholder = "Ask me anything about my background...";
        }
        this.updateSendButton();
        
        // Auto-hide success message after 4 seconds
        setTimeout(() => {
            if (successEl.parentNode) {
                successEl.style.opacity = '0';
                successEl.style.transform = 'translateY(-10px)';
                successEl.style.transition = 'all 0.3s ease';
                
                setTimeout(() => successEl.remove(), 300);
            }
        }, 4000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Public API methods
    addUserMessage(message) {
        this.addMessage(message, 'user');
    }

    addAIMessage(message) {
        this.addMessage(message, 'ai');
    }

    clearMessages() {
        if (this.messagesWrapper) {
            this.messagesWrapper.innerHTML = '';
            this.messages = [];
            this.addWelcomeMessage();
        }
    }
}


// Initialize chat interface with consolidated AI management
let lightweightChat;

/**
 * Initialize chat interface when AI becomes available
 */
function initializeChatInterface() {
    if (lightweightChat) {
        console.log('Chat interface already initialized');
        return;
    }

    try {
        lightweightChat = new LightweightChat();
        window.lightweightChat = lightweightChat;
        console.log('✅ Chat interface initialized');
    } catch (error) {
        console.error('❌ Failed to initialize chat interface:', error);
    }
}

/**
 * Listen for AI state changes from consolidated AIManager
 */
function listenForChatStateChanges() {
    if (window.AIManager) {
        window.AIManager.addEventListener('statechange', (event) => {
            const { currentState } = event.detail;
            
            // Initialize chat interface when AI becomes available
            if (currentState === 'available' && !lightweightChat) {
                initializeChatInterface();
            }
        });
        
        console.log('👂 Chat interface listening to consolidated AIManager state changes');
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', listenForChatStateChanges);
} else {
    listenForChatStateChanges();
}

// Test function
window.testLightweightChat = function() {
    console.log('=== Lightweight Chat Test ===');
    
    const results = {
        initialized: !!window.lightweightChat,
        elementsFound: 0,
        messagesContainer: false,
        inputWorking: false
    };
    
    // Test elements
    const elements = [
        'ai-chat-interface',
        'chat-toggle', 
        'chat-window'
    ];
    
    elements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            results.elementsFound++;
            console.log(`✅ Element found: ${id}`);
        } else {
            console.log(`❌ Element missing: ${id}`);
        }
    });
    
    // Test messages container
    const messagesContainer = document.querySelector('.chat-messages');
    if (messagesContainer) {
        results.messagesContainer = true;
        console.log('✅ Messages container found');
    } else {
        console.log('❌ Messages container missing');
    }
    
    // Test input
    const input = document.querySelector('.chat-input-area input');
    if (input) {
        results.inputWorking = true;
        console.log('✅ Input element found');
    } else {
        console.log('❌ Input element missing');
    }
    
    console.log('Test Results:', results);
    return results;
};
