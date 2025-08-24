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
            console.log('🔄 Lazy loading AI session...');
            
            if (!window.AIFeatureDetector || !window.AIFeatureDetector.isAISupported()) {
                console.log('AI not supported - using keyword-based responses');
                this.isAIEnabled = false;
                return false;
            }

            // Check availability one more time
            const availabilityCheck = await window.AIFeatureDetector.checkAvailabilityWithUserActivation();
            console.log('AI availability check for session creation:', availabilityCheck);
            
            if (!availabilityCheck.canProceed || availabilityCheck.available !== 'available') {
                console.log(`❌ Cannot create AI session: ${availabilityCheck.reason}`);
                this.isAIEnabled = false;
                return false;
            }
            
            const systemPrompt = this.buildSystemPrompt();
            
            this.aiSession = await window.AIFeatureDetector.createSession({
                initialPrompts: [
                    { role: 'system', content: systemPrompt }
                ]
            });
            
            if (this.aiSession) {
                this.isAIEnabled = true;
                console.log('✅ AI session created successfully on-demand');
                return true;
            } else {
                console.log('❌ Failed to create AI session - falling back to keyword responses');
                this.isAIEnabled = false;
                return false;
            }
        } catch (error) {
            console.error('Error creating AI session:', error);
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
        
        console.log('🔄 Opening chat - checking for AI session...');
        
        // Lazy initialize AI session when user first opens chat
        if (!this.aiSession) {
            const sessionReady = await this.initializeAISession();
            if (!sessionReady) {
                console.log('⚠️ AI session not available, proceeding with keyword responses');
            }
        }
        
        // Show chat window
        this.window.classList.remove('hidden');
        this.window.classList.add('show');
        
        // Hide toggle button
        if (this.toggle) {
            this.toggle.style.display = 'none';
        }
        
        // Focus input
        setTimeout(() => {
            if (this.input) {
                this.input.focus();
            }
        }, 100);
        
        this.isOpen = true;
        console.log('Chat opened');
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

// AI Download and Status Management
class AIDownloadManager {
    constructor() {
        this.status = this.getStoredStatus();
        this.progressInterval = null;
        this.downloadStartTime = null;
        this.bindEvents();
    }

    getStoredStatus() {
        const stored = localStorage.getItem('aiChatStatus');
        return stored ? JSON.parse(stored) : {
            userDeclinedDownload: false,
            lastDeclineTime: null,
            downloadAttempted: false
        };
    }

    setStoredStatus(status) {
        this.status = { ...this.status, ...status };
        localStorage.setItem('aiChatStatus', JSON.stringify(this.status));
    }

    bindEvents() {
        console.log('🔗 AIDownloadManager binding events...');
        
        // Download modal events
        const downloadYes = document.getElementById('ai-download-yes');
        const downloadLater = document.getElementById('ai-download-later');
        const modalCloses = document.querySelectorAll('.ai-modal-close');
        const progressBackground = document.getElementById('ai-progress-background');
        const tellMeMore = document.getElementById('ai-tell-me-more');

        if (downloadYes) {
            downloadYes.addEventListener('click', () => this.startDownload());
            console.log('✅ Download Yes button event bound');
        }

        if (downloadLater) {
            downloadLater.addEventListener('click', () => this.declineDownload());
            console.log('✅ Download Later button event bound');
        }

        if (progressBackground) {
            progressBackground.addEventListener('click', () => this.hideProgressModal());
            console.log('✅ Progress background event bound');
        }

        if (tellMeMore) {
            tellMeMore.addEventListener('click', () => this.toggleRequirements());
            console.log('✅ Tell Me More button event bound');
        }

        modalCloses.forEach(close => {
            close.addEventListener('click', (e) => {
                const modal = e.target.closest('.ai-modal');
                if (modal) this.hideModal(modal);
            });
        });
        console.log(`✅ ${modalCloses.length} modal close buttons bound`);

        // Listen for download progress events - handle completion only
        window.addEventListener('aiModelDownloadProgress', (event) => {
            console.log('📥 AIDownloadManager received download event:', event.detail);
            this.handleDownloadEvent(event.detail);
        });
        console.log('✅ Download event listener attached to window');

        // Close modals on backdrop click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('ai-modal-backdrop')) {
                const modal = e.target.closest('.ai-modal');
                if (modal) this.hideModal(modal);
            }
        });

        // Escape key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const openModal = document.querySelector('.ai-modal:not(.hidden)');
                if (openModal) this.hideModal(openModal);
            }
        });
        
        console.log('🎯 All AIDownloadManager events bound successfully');
    }

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
            modal.setAttribute('aria-hidden', 'false');
            
            // Focus management
            const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (firstFocusable) {
                setTimeout(() => firstFocusable.focus(), 100);
            }
        }
    }

    hideModal(modal) {
        if (modal) {
            modal.classList.add('hidden');
            modal.setAttribute('aria-hidden', 'true');
        }
    }

    shouldShowDownloadPrompt() {
        // Don't show if user declined recently (within 24 hours)
        if (this.status.userDeclinedDownload && this.status.lastDeclineTime) {
            const hoursSinceDecline = (Date.now() - this.status.lastDeclineTime) / (1000 * 60 * 60);
            if (hoursSinceDecline < 24) {
                return false;
            }
        }
        return true;
    }

    async startDownload() {
        console.log('Starting AI model download...');
        
        try {
            // Check user activation before proceeding
            if (!window.AIFeatureDetector.isUserActivationActive()) {
                console.log('❌ User activation not active - download must be triggered from user interaction');
                this.showDownloadError('User activation required. Please click the download button again.');
                return;
            }
            
            console.log('✅ User activation confirmed, proceeding with download...');
            this.hideModal(document.getElementById('ai-download-modal'));
            this.showModal('ai-progress-modal');
            
            this.setStoredStatus({ downloadAttempted: true });
            this.downloadStartTime = Date.now();
            
            // Use the user activation-aware session creation method
            // NOTE: Session creation triggers download but doesn't mean it's complete!
            const session = await window.AIFeatureDetector.createSessionWithUserActivation({
                initialPrompts: [
                    { role: 'system', content: 'You are Karthik Subramanian, ready to chat about your professional experience and expertise.' }
                ]
            });

            if (session) {
                console.log('✅ Session creation initiated - download may still be in progress');
                console.log('⏳ Waiting for actual download completion event before enabling chat');
                
                // DO NOT show chat interface here! Wait for the real completion event
                // The handleDownloadEvent() method will handle showing the interface when detail.loaded === 1
                
                // Store the session for later use when download actually completes
                this.pendingSession = session;
            } else {
                throw new Error('Failed to create AI session');
            }
        } catch (error) {
            console.error('Error during AI model download:', error);
            
            // Handle specific user activation errors
            if (error.message?.includes('User activation required')) {
                this.showDownloadError('Please click the download button to start the AI model download.');
            } else if (error.message?.includes('AI not supported')) {
                this.showDownloadError('AI features are not supported on this device or browser.');
            } else {
                this.showDownloadError(error.message);
            }
        }
    }

    handleDownloadEvent(detail) {
        console.log('🔄 AIDownloadManager handling download event:', detail);
        
        const downloadStatus = document.getElementById('download-status');
        
        if (detail.loaded === 0) {
            // Download starting
            console.log('🚀 AI model download starting...');
            if (downloadStatus) {
                downloadStatus.textContent = 'Download starting...';
            }
        } else if (detail.loaded === 1) {
            // Download completed
            console.log('🎯 AI model download completed!');
            if (downloadStatus) {
                downloadStatus.textContent = 'Download completed! Setting up AI chat...';
            }
            
            // Hide progress modal and enable chat
            setTimeout(() => {
                this.hideModal(document.getElementById('ai-progress-modal'));
                this.enableChatInterface();
            }, 1500);
        }
    }

    enableChatInterface() {
        console.log('✅ Enabling AI chat interface after download completion');
        
        // Show chat interface
        const chatInterface = document.getElementById('ai-chat-interface');
        if (chatInterface) {
            chatInterface.style.display = 'block';
            chatInterface.classList.remove('hidden');
        }
        
        // Update teaser message to show AI is now available
        const teaserText = document.getElementById('ai-teaser-inline-text');
        if (teaserText) {
            teaserText.textContent = "Great! AI chat is now ready. Click the floating chat button to get started!";
        }
        
        // Initialize chat interface with the pending session from download
        if (!window.lightweightChat) {
            this.initializeChatInterface(this.pendingSession);
        } else if (this.pendingSession && window.lightweightChat) {
            // If chat interface already exists, just assign the session
            window.lightweightChat.aiSession = this.pendingSession;
            window.lightweightChat.isAIEnabled = true;
            console.log('✅ Assigned pending session to existing chat interface');
        }
        
        // Clear the pending session
        this.pendingSession = null;
        
        // Dispatch completion event for other parts of the app
        window.dispatchEvent(new CustomEvent('aiModelDownloadComplete', {
            detail: {
                success: true,
                timestamp: Date.now()
            }
        }));
        
        console.log('🎉 AI chat interface is now ready!');
    }

    formatBytes(bytes) {
        if (bytes === 0) return '0 MB';
        const mb = bytes / (1024 * 1024);
        return mb.toFixed(1) + ' MB';
    }

    declineDownload() {
        console.log('User declined AI model download');
        this.setStoredStatus({
            userDeclinedDownload: true,
            lastDeclineTime: Date.now()
        });
        this.hideModal(document.getElementById('ai-download-modal'));
        
        // Hide chat interface
        const chatInterface = document.getElementById('ai-chat-interface');
        if (chatInterface) {
            chatInterface.style.display = 'none';
        }
    }

    hideProgressModal() {
        console.log('📤 Hiding progress modal - download continues in background');
        this.hideModal(document.getElementById('ai-progress-modal'));
        
        // DO NOT show chat interface here - it should only appear when download actually completes
        // The download is still in progress, just hidden from view
        console.log('⏳ Download still in progress in background - chat interface remains hidden until completion');
    }

    showDownloadError(message) {
        this.hideModal(document.getElementById('ai-progress-modal'));
        
        // You could show an error modal here
        console.error('Download failed:', message);
        
        // For now, show the unavailable modal
        this.showModal('ai-unavailable-modal');
    }

    /**
     * Show inline teaser with customized messaging based on browser/device info and AI availability
     */
    showTeaserModal(browserInfo, detectionResult = null) {
        const teaserSection = document.getElementById('ai-teaser-section');
        const inlineText = document.getElementById('ai-teaser-inline-text');
        const requirementsSection = document.getElementById('ai-requirements-inline');
        const tellMeMoreBtn = document.getElementById('ai-tell-me-more-inline');
        
        if (!teaserSection) return;
        
        // Reset requirements section to collapsed state
        if (requirementsSection) {
            requirementsSection.classList.add('hidden');
        }
        if (tellMeMoreBtn) {
            tellMeMoreBtn.classList.remove('expanded');
            
            // Clear any existing event listeners
            const newBtn = tellMeMoreBtn.cloneNode(true);
            tellMeMoreBtn.parentNode.replaceChild(newBtn, tellMeMoreBtn);
            
            // Bind click event for inline button
            newBtn.addEventListener('click', () => this.toggleInlineRequirements());
        }
        
        // Check if chat interface is actually visible/available
        const chatInterface = document.getElementById('ai-chat-interface');
        const isChatInterfaceVisible = chatInterface && chatInterface.style.display !== 'none' && !chatInterface.classList.contains('hidden');
        
        // Determine if AI is available and working
        const isAIAvailable = detectionResult?.isSupported && detectionResult?.capabilities?.available === 'available';
        const isCompatible = browserInfo.isCompatibleDevice && browserInfo.isCompatibleBrowser;
        
        let customMessage = '';
        let buttonText = 'Tell me more';
        
        // If chat interface is visible, AI is working - encourage them to try it!
        if (isChatInterfaceVisible || isAIAvailable) {
            customMessage = "Hey! Want to chat with an AI version of me? Click the floating chat button to get started!";
            buttonText = 'About this feature';
        } else if (isCompatible) {
            // Compatible setup but AI features need to be enabled or downloaded
            if (detectionResult?.isSupported) {
                // AI detection succeeded but needs download
                const availability = detectionResult?.capabilities?.available;
                if (availability === 'downloadable') {
                    customMessage = "You can chat with an AI version of me! The AI model just needs to be downloaded first.";
                } else if (availability === 'downloading') {
                    customMessage = "Great! The AI model is downloading. Soon you'll be able to chat with an AI version of me!";
                } else {
                    customMessage = "You could chat with an AI version of me, but it's not quite ready yet.";
                }
            } else {
                // AI detection failed but browser/device is compatible - need to enable features
                if (browserInfo.isChrome) {
                    customMessage = "You can chat with an AI version of me! Just activate chrome://flags/#prompt-api-for-gemini-nano first.";
                } else {
                    customMessage = "You can chat with an AI version of me! You just need to enable Chrome's AI features first.";
                }
            }
            buttonText = 'Tell me more';
        } else {
            // Not compatible device or browser
            if (browserInfo.isMobile || browserInfo.isChromeOS) {
                if (browserInfo.isAndroid) {
                    customMessage = "You could chat with an AI version of me, but it's not available on Android devices yet.";
                } else if (browserInfo.isIOS) {
                    customMessage = "You could chat with an AI version of me, but it's not available on iOS devices yet.";
                } else if (browserInfo.isChromeOS) {
                    customMessage = "You could chat with an AI version of me, but it's not available on ChromeOS yet.";
                } else {
                    customMessage = "You could chat with an AI version of me, but it's not available on mobile devices yet.";
                }
            } else if (!browserInfo.isChrome) {
                if (browserInfo.isSafari) {
                    customMessage = "You could chat with an AI version of me, but it requires Chrome with special features enabled.";
                } else if (browserInfo.isFirefox) {
                    customMessage = "You could chat with an AI version of me, but it requires Chrome with special features enabled.";
                } else if (browserInfo.isEdge) {
                    customMessage = "You could chat with an AI version of me, but it requires Chrome (not Edge) with special features enabled.";
                } else {
                    customMessage = "You could chat with an AI version of me, but it requires Chrome with special features enabled.";
                }
            } else if (browserInfo.isChrome && browserInfo.chromeVersion < 127) {
                customMessage = `You could chat with an AI version of me, but your Chrome version (${browserInfo.chromeVersion}) needs to be updated to 127 or higher.`;
            } else {
                customMessage = "You could chat with an AI version of me, but it requires Chrome with special AI features enabled.";
            }
            buttonText = 'Tell me more';
        }
        
        // Update inline content
        if (inlineText) {
            inlineText.textContent = customMessage;
        }
        
        // Update button text
        const newTellMeMoreBtn = document.getElementById('ai-tell-me-more-inline');
        if (newTellMeMoreBtn) {
            newTellMeMoreBtn.innerHTML = `
                ${buttonText}
                <svg class="w-4 h-4 ml-1 transform transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            `;
        }
        
        // Show the teaser section
        teaserSection.classList.remove('hidden');
        teaserSection.style.display = 'block';
        
        console.log('Showing inline teaser with message:', customMessage);
    }

    /**
     * Toggle the inline requirements section visibility
     */
    toggleInlineRequirements() {
        const requirementsSection = document.getElementById('ai-requirements-inline');
        const tellMeMoreBtn = document.getElementById('ai-tell-me-more-inline');
        const availableContent = document.getElementById('ai-available-content');
        const unavailableContent = document.getElementById('ai-unavailable-content');
        
        if (!requirementsSection || !tellMeMoreBtn) return;
        
        const isExpanded = !requirementsSection.classList.contains('hidden');
        const currentButtonText = tellMeMoreBtn.textContent.trim();
        
        if (isExpanded) {
            // Collapse
            requirementsSection.classList.add('hidden');
            tellMeMoreBtn.classList.remove('expanded');
            
            const buttonText = currentButtonText.includes('feature') ? 'About this feature' : 'Tell me more';
            tellMeMoreBtn.innerHTML = `
                ${buttonText}
                <svg class="w-4 h-4 ml-1 transform transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            `;
            console.log('Inline requirements section collapsed');
        } else {
            // Expand and show appropriate content
            requirementsSection.classList.remove('hidden');
            tellMeMoreBtn.classList.add('expanded');
            
            // Determine which content to show based on current state
            const isAIWorking = window.lightweightChat && document.getElementById('ai-chat-interface').style.display !== 'none';
            
            if (isAIWorking && availableContent && unavailableContent) {
                // Show AI available content
                availableContent.classList.remove('hidden');
                unavailableContent.classList.add('hidden');
                console.log('Showing AI available content');
            } else if (unavailableContent && availableContent) {
                // Show AI unavailable content (requirements)
                unavailableContent.classList.remove('hidden');
                availableContent.classList.add('hidden');
                console.log('Showing AI unavailable content');
            }
            
            tellMeMoreBtn.innerHTML = `
                Show less
                <svg class="w-4 h-4 ml-1 transform transition-transform duration-200 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            `;
            console.log('Inline requirements section expanded');
        }
        
        // Smooth scroll to show expanded content
        if (!isExpanded) {
            setTimeout(() => {
                requirementsSection.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'nearest' 
                });
            }, 200);
        }
    }

    /**
     * Toggle the modal requirements section visibility (kept for modal fallback)
     */
    toggleRequirements() {
        const requirementsSection = document.getElementById('ai-requirements-section');
        const tellMeMoreBtn = document.getElementById('ai-tell-me-more');
        
        if (!requirementsSection || !tellMeMoreBtn) return;
        
        const isExpanded = !requirementsSection.classList.contains('hidden');
        
        if (isExpanded) {
            // Collapse
            requirementsSection.classList.add('hidden');
            tellMeMoreBtn.classList.remove('expanded');
            tellMeMoreBtn.textContent = 'Tell me more';
            console.log('Modal requirements section collapsed');
        } else {
            // Expand
            requirementsSection.classList.remove('hidden');
            tellMeMoreBtn.classList.add('expanded');
            tellMeMoreBtn.textContent = 'Show less';
            console.log('Modal requirements section expanded');
        }
        
        // Smooth scroll to show expanded content
        if (!isExpanded) {
            setTimeout(() => {
                requirementsSection.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'nearest' 
                });
            }, 200);
        }
    }

    initializeChatInterface(aiSession = null) {
        if (window.lightweightChat) {
            console.log('Chat interface already initialized');
            return;
        }

        console.log('Initializing chat interface...');
        lightweightChat = new LightweightChat(aiSession);
        window.lightweightChat = lightweightChat;
        
        const chatInterface = document.getElementById('ai-chat-interface');
        if (chatInterface) {
            chatInterface.style.display = 'block';
        }
    }
}

// Initialize chat when DOM is ready AND handle AI availability states
let lightweightChat;
let aiDownloadManager;

// Enhanced browser and device detection
function detectBrowserAndDevice() {
    const userAgent = navigator.userAgent.toLowerCase();
    
    // Mobile detection
    const isMobile = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i.test(userAgent);
    const isAndroid = /android/i.test(userAgent);
    const isIOS = /iphone|ipad|ipod/i.test(userAgent);
    const isChromeOS = /cros/i.test(userAgent);
    
    // Browser detection
    const isChrome = /chrome/i.test(userAgent) && !/edge|edg/i.test(userAgent);
    const isEdge = /edge|edg/i.test(userAgent);
    const isFirefox = /firefox/i.test(userAgent);
    const isSafari = /safari/i.test(userAgent) && !/chrome/i.test(userAgent);
    
    // Chrome version detection
    const chromeMatch = userAgent.match(/chrome\/(\d+)/);
    const chromeVersion = chromeMatch ? parseInt(chromeMatch[1]) : null;
    
    return {
        isMobile,
        isAndroid,
        isIOS,
        isChromeOS,
        isChrome,
        isEdge,
        isFirefox,
        isSafari,
        chromeVersion,
        isCompatibleBrowser: isChrome && chromeVersion >= 127,
        isCompatibleDevice: !isMobile && !isChromeOS
    };
}

// Enhanced chat initialization that handles all AI availability states
function initializeChatWhenReady() {
    // Initialize download manager
    aiDownloadManager = new AIDownloadManager();
    window.aiDownloadManager = aiDownloadManager;

    // Check browser and device compatibility first
    const browserInfo = detectBrowserAndDevice();
    console.log('Browser and device info:', browserInfo);
    
    // Always show teaser - even for compatible setups
    setTimeout(() => {
        aiDownloadManager.showTeaserModal(browserInfo, null); // Pass null for initial detection
    }, 500);

    // Listen for AI feature detection completion
    window.addEventListener('aiFeatureDetectionComplete', (event) => {
        console.log('AI feature detection completed:', event.detail);
        handleAIAvailabilityState(event.detail, browserInfo);
    });
    
    // If AI detection has already completed, handle the current state
    if (window.AIFeatureDetector) {
        const capabilities = window.AIFeatureDetector.getCapabilities();
        if (capabilities) {
            handleAIAvailabilityState({
                isSupported: window.AIFeatureDetector.isAISupported(),
                capabilities: capabilities
            }, browserInfo);
        }
    }
}

function handleAIAvailabilityState(detectionResult, browserInfo) {
    const { isSupported, capabilities } = detectionResult;
    const chatInterface = document.getElementById('ai-chat-interface');
    
    // Always update teaser with availability info
    setTimeout(() => {
        aiDownloadManager.showTeaserModal(browserInfo, detectionResult);
    }, 100);
    
    if (!isSupported) {
        console.log('AI not supported - chat interface hidden');
        if (chatInterface) {
            chatInterface.style.display = 'none';
        }
        return;
    }

    const availability = capabilities?.available;
    console.log('AI availability state:', availability);

    switch (availability) {
        case 'available':
            console.log('AI is available - showing chat button (lazy loading)');
            if (chatInterface) {
                chatInterface.style.display = 'block';
                chatInterface.classList.remove('hidden');
            }
            
            // Initialize the basic chat interface (without AI session) - session created on first click
            if (!window.lightweightChat) {
                aiDownloadManager.initializeChatInterface();
            }
            break;

        case 'downloadable':
            console.log('AI model needs to be downloaded - hiding chat button');
            if (chatInterface) {
                chatInterface.style.display = 'none';
            }
            
            if (aiDownloadManager.shouldShowDownloadPrompt()) {
                aiDownloadManager.showModal('ai-download-modal');
            } else {
                console.log('User declined download recently - hiding chat interface');
            }
            break;

        case 'downloading':
            console.log('AI model is currently downloading - hiding chat button');
            if (chatInterface) {
                chatInterface.style.display = 'none';
            }
            aiDownloadManager.showModal('ai-progress-modal');
            
            // Show initial download starting message
            const downloadStatus = document.getElementById('download-status');
            if (downloadStatus) {
                downloadStatus.textContent = 'AI model download in progress...';
            }
            break;

        default:
            console.log('AI unavailable - hiding chat button');
            if (chatInterface) {
                chatInterface.style.display = 'none';
            }
            break;
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeChatWhenReady);
} else {
    initializeChatWhenReady();
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
