/**
 * Consolidated AI Manager
 * Handles all AI-related functionality using Chrome's built-in AI API
 */

class AIManager extends EventTarget {
    constructor() {
        super();
        this.state = 'checking'; // checking, available, downloadable, downloading, unavailable
        this.capabilities = null;
        this.session = null;
        this.downloadStartTime = null;
        this.isInitialized = false;
        this.debugMode = true;
        
        console.log('🤖 AIManager initialized');
    }

    /**
     * Initialize AI manager and detect capabilities
     */
    async initialize() {
        if (this.isInitialized) {
            console.log('AIManager already initialized');
            return;
        }

        this.log('🔍 Starting AI initialization...');
        
        try {
            this.setState('checking');
            
            // Check basic browser compatibility
            const browserInfo = this.getBrowserInfo();
            if (!browserInfo.isCompatible) {
                this.setState('unavailable');
                return;
            }

            // Detect AI capabilities
            const isSupported = await this.detectAICapabilities();
            if (!isSupported) {
                this.setState('unavailable');
                return;
            }

            this.isInitialized = true;
            this.log('✅ AI initialization complete');
            
        } catch (error) {
            this.log('❌ AI initialization failed:', error);
            this.setState('unavailable');
        }
    }

    /**
     * Detect AI capabilities using Chrome's LanguageModel API
     */
    async detectAICapabilities() {
        this.log('🔍 Detecting AI capabilities...');
        
        try {
            if (typeof LanguageModel === 'undefined') {
                this.log('❌ LanguageModel API not available');
                this.logSetupInstructions();
                return false;
            }

            this.log('✅ LanguageModel API found');
            
            // Check availability
            const availability = await LanguageModel.availability();
            this.log('📊 AI availability:', availability);
            
            // Store capabilities
            this.capabilities = { available: availability };
            
            // Set appropriate state
            switch (availability) {
                case 'available':
                    this.setState('available');
                    return true;
                case 'downloadable':
                    this.setState('downloadable');
                    return true;
                case 'downloading':
                    this.setState('downloading');
                    // Start polling to detect when download completes
                    this.startAvailabilityPolling();
                    return true;
                case 'unavailable':
                    this.setState('unavailable');
                    return false;
                default:
                    this.log('❌ Unknown availability status:', availability);
                    this.setState('unavailable');
                    return false;
            }
            
        } catch (error) {
            this.log('❌ Error detecting AI capabilities:', error);
            return false;
        }
    }

    /**
     * Get browser compatibility information
     */
    getBrowserInfo() {
        const userAgent = navigator.userAgent.toLowerCase();
        const isChrome = /chrome/i.test(userAgent) && !/edge|edg/i.test(userAgent);
        const chromeMatch = userAgent.match(/chrome\/(\d+)/);
        const chromeVersion = chromeMatch ? parseInt(chromeMatch[1]) : null;
        
        // Mobile detection
        const isMobile = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i.test(userAgent);
        const isAndroid = /android/i.test(userAgent);
        const isIOS = /iphone|ipad|ipod/i.test(userAgent);
        const isChromeOS = /cros/i.test(userAgent);

        return {
            userAgent,
            isChrome,
            chromeVersion,
            isMobile,
            isAndroid,
            isIOS,
            isChromeOS,
            isCompatible: isChrome && chromeVersion >= 127 && !isMobile && !isChromeOS,
            hasLanguageModel: typeof LanguageModel !== 'undefined'
        };
    }

    /**
     * Set AI state and emit change event
     */
    setState(newState) {
        const previousState = this.state;
        this.state = newState;
        
        this.log(`🔄 AI State: ${previousState} → ${newState}`);
        
        // Update teaser UI
        this.updateTeaserUI();
        
        // Update chat button visibility
        this.updateChatButtonVisibility();
        
        // Emit state change event for other components
        this.dispatchEvent(new CustomEvent('statechange', {
            detail: {
                previousState,
                currentState: newState,
                capabilities: this.capabilities,
                timestamp: Date.now()
            }
        }));
    }

    /**
     * Start AI model download
     */
    async startDownload() {
        if (this.state !== 'downloadable') {
            this.log('❌ Cannot start download - current state:', this.state);
            return false;
        }

        try {
            this.log('📥 Starting AI model download...');
            this.setState('downloading');
            this.downloadStartTime = Date.now();

            // Check user activation
            if (!navigator.userActivation?.isActive) {
                throw new Error('User activation required - this must be called from a user interaction');
            }

            // Use official Chrome API pattern for download with progress monitoring
            const session = await LanguageModel.create({
                initialPrompts: [
                    { role: 'system', content: 'Temporary session to trigger download.' }
                ],
                monitor: (m) => {
                    this.log('📊 Download monitor attached');
                    
                    m.addEventListener('downloadprogress', (e) => {
                        // e.loaded ranges from 0 to 1, e.total is always 1
                        const percentComplete = Math.round(e.loaded * 100);
                        this.log(`📥 Download progress: ${percentComplete}% (loaded: ${e.loaded})`);
                        
                        // Update downloading indicator in teaser
                        this.updateDownloadProgress(e.loaded);
                        
                        // Check for completion (e.loaded === 1)
                        if (e.loaded === 1) {
                            this.log('🎉 Download progress shows completion!');
                            // Don't immediately transition - wait for availability to change
                        }
                    });
                }
            });

            // Destroy the temporary session immediately
            if (session) {
                session.destroy();
                this.log('🗑️ Temporary download trigger session destroyed');
                
                // Start polling availability until it changes to 'available'
                this.startAvailabilityPolling();
                return true;
            } else {
                throw new Error('Failed to create download trigger session');
            }

        } catch (error) {
            this.log('❌ Download failed:', error);
            this.setState('downloadable');
            
            // Show error in teaser
            this.showDownloadError(error.message);
            
            return false;
        }
    }

    /**
     * Poll LanguageModel.availability() until download completes
     */
    startAvailabilityPolling() {
        this.log('🔄 Starting availability polling...');
        
        const pollInterval = setInterval(async () => {
            try {
                const availability = await LanguageModel.availability();
                this.log('📊 Polling availability:', availability);
                
                if (availability === 'available') {
                    this.log('🎉 Availability changed to "available" - download complete!');
                    clearInterval(pollInterval);
                    this.handleDownloadComplete();
                } else if (availability === 'unavailable') {
                    this.log('❌ Availability became unavailable');
                    clearInterval(pollInterval);
                    this.setState('unavailable');
                }
                
            } catch (error) {
                this.log('Error polling availability:', error);
                clearInterval(pollInterval);
                this.setState('downloadable');
            }
        }, 2000);

        // Timeout after 10 minutes
        setTimeout(() => {
            clearInterval(pollInterval);
            if (this.state === 'downloading') {
                this.log('⏰ Download timeout');
                this.setState('downloadable');
            }
        }, 600000);
    }

    /**
     * Handle download completion
     */
    handleDownloadComplete() {
        this.setState('available');
        
        const downloadTime = this.downloadStartTime ? Date.now() - this.downloadStartTime : 0;
        this.log(`✅ Download completed in ${Math.round(downloadTime/1000)}s`);
        
        // Show completion notification
        this.showDownloadCompleteNotification();
    }

    /**
     * Create AI session (only when chat is opened)
     */
    async createSession() {
        if (this.state !== 'available') {
            this.log('❌ Cannot create session - state:', this.state);
            return null;
        }

        if (this.session) {
            this.log('♻️ Using existing AI session');
            return this.session;
        }

        try {
            this.log('🤖 Creating AI session for chat...');
            
            this.session = await LanguageModel.create({
                initialPrompts: [
                    { role: 'system', content: this.buildSystemPrompt() }
                ]
            });
            
            if (this.session) {
                this.log('✅ AI session created successfully');
                return this.session;
            }
            
        } catch (error) {
            this.log('❌ Failed to create AI session:', error);
        }
        
        return null;
    }

    /**
     * Build comprehensive system prompt using live profile data
     */
    buildSystemPrompt() {
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

        return `You are ${personalData.name}, responding in first person as yourself. You should be conversational, helpful, and professional.

CURRENT CONTEXT:
- Current date and time: ${currentDateTime}
- Current year: ${currentYear}
- You are responding to someone visiting your personal portfolio website
- This conversation is happening in real-time

PERSONAL INFORMATION:
- Name: ${personalData.name}
- Title: ${personalData.title}
- Current Company: ${personalData.currentCompany}
- Location: ${personalData.location}
- Email: ${personalData.email}
- Bio: ${personalData.bio}

PROFESSIONAL EXPERIENCE:
${experienceData.map(job => 
    `- ${job.position} at ${job.company} (${job.duration}) in ${job.location}
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
- Always respond in first person as ${personalData.name}
- Be conversational and personable, but professional
- Only provide information that is included in this profile
- If asked about something not in your profile, politely redirect to your professional experience
- Feel free to elaborate on your experience, projects, and skills
- Show enthusiasm about your work and AWS expertise
- Mention being an AWS Community Builder when relevant
- Be helpful and encouraging in discussions about technology
- When asked for duration of things be mindful to calculate based on the current date
`;
    }

    /**
     * Update teaser UI based on current state
     */
    updateTeaserUI() {
        const teaserText = document.getElementById('ai-teaser-inline-text');
        const detectionLoading = document.getElementById('ai-detection-loading');
        const downloadingIndicator = document.getElementById('ai-downloading-indicator');
        const downloadBtn = document.getElementById('ai-download-btn');
        const chatReadyBtn = document.getElementById('ai-chat-ready-btn');

        if (!teaserText) return;

        // Update text message
        teaserText.textContent = this.getStateMessage();

        // Update indicators
        this.hideElement(detectionLoading);
        this.hideElement(downloadingIndicator);
        this.hideElement(downloadBtn);
        this.hideElement(chatReadyBtn);

        switch (this.state) {
            case 'checking':
                this.showElement(detectionLoading);
                break;
            case 'downloadable':
                this.showElement(downloadBtn);
                break;
            case 'downloading':
                this.showElement(downloadingIndicator);
                break;
            case 'available':
                this.showElement(chatReadyBtn);
                break;
        }

        // Show teaser section if hidden
        const teaserSection = document.getElementById('ai-teaser-section');
        if (teaserSection) {
            teaserSection.classList.remove('hidden');
        }
    }

    /**
     * Update chat button visibility
     */
    updateChatButtonVisibility() {
        const chatInterface = document.getElementById('ai-chat-interface');
        if (!chatInterface) return;

        if (this.state === 'available') {
            chatInterface.classList.remove('hidden');
            chatInterface.style.display = 'block';
            this.log('👁️ Chat interface shown');
        } else {
            chatInterface.classList.add('hidden');
            chatInterface.style.display = 'none';
            this.log('👁️ Chat interface hidden');
        }
    }

    /**
     * Update download progress in UI
     */
    updateDownloadProgress(loaded) {
        const downloadingIndicator = document.getElementById('ai-downloading-indicator');
        if (!downloadingIndicator) return;

        const progressText = downloadingIndicator.querySelector('span');
        if (progressText) {
            progressText.textContent = `AI model downloading... ${loaded}%`;
        }
    }

    /**
     * Show download error in teaser
     */
    showDownloadError(message) {
        const teaserText = document.getElementById('ai-teaser-inline-text');
        if (teaserText) {
            const originalText = teaserText.textContent;
            teaserText.textContent = `Download failed: ${message}`;
            
            // Reset after 5 seconds
            setTimeout(() => {
                teaserText.textContent = this.getStateMessage();
            }, 5000);
        }
    }

    /**
     * Show download complete notification
     */
    showDownloadCompleteNotification() {
        const notification = document.createElement('div');
        notification.className = 'fixed bottom-24 right-6 bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm animate-bounce';
        notification.innerHTML = `
            <div class="flex items-center space-x-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>AI Chat is ready!</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.opacity = '0';
                notification.style.transform = 'translateY(10px)';
                notification.style.transition = 'all 0.3s ease';
                
                setTimeout(() => notification.remove(), 300);
            }
        }, 4000);
    }

    /**
     * Get user-friendly state message
     */
    getStateMessage() {
        switch (this.state) {
            case 'checking':
                return 'Checking AI capabilities...';
            case 'available':
                return 'Want to chat with an AI version of me? Click the floating chat button!';
            case 'downloadable':
                return 'You can chat with an AI version of me! The model (Google Gemini Nano) just needs to be downloaded first. \n Its roughly 5GB but once downloaded you have your very own private chat model!';
            case 'downloading':
                return "Looks like the model's already downloading! The floating chat button will appear once it's ready.";
            case 'unavailable':
                return 'You could chat with an AI version of me (more fun but less accurate :)), but it requires Chrome with gemini nano downloaded.';
            default:
                return 'AI status unknown';
        }
    }


    /**
     * Get current AI state info
     */
    getState() {
        return {
            state: this.state,
            capabilities: this.capabilities,
            session: this.session,
            isAvailable: this.state === 'available',
            canDownload: this.state === 'downloadable',
            isDownloading: this.state === 'downloading',
            isUnavailable: this.state === 'unavailable'
        };
    }

    /**
     * Destroy AI session
     */
    destroySession() {
        if (this.session && typeof this.session.destroy === 'function') {
            this.session.destroy();
            this.session = null;
            this.log('🗑️ AI session destroyed');
        }
    }

    /**
     * Helper methods
     */
    showElement(element) {
        if (element) {
            element.classList.remove('hidden');
        }
    }

    hideElement(element) {
        if (element) {
            element.classList.add('hidden');
        }
    }

    /**
     * Log setup instructions
     */
    logSetupInstructions() {
        console.log('💡 Chrome AI Setup Required:');
        console.log('1. Use Chrome Canary/Dev (v127+)');
        console.log('2. Enable chrome://flags/#prompt-api-for-gemini-nano');
        console.log('3. Enable chrome://flags/#optimization-guide-on-device-model');
        console.log('4. Restart Chrome');
        console.log('5. Visit chrome://components/ and update "Optimization Guide On Device Model"');
    }

    /**
     * Debug logging
     */
    log(message, data = null) {
        if (!this.debugMode) return;
        
        const timestamp = new Date().toISOString();
        const prefix = `[AI Manager ${timestamp}]`;
        
        if (data !== null) {
            console.log(`${prefix} ${message}`, data);
        } else {
            console.log(`${prefix} ${message}`);
        }
    }
}

// Create global instance
window.AIManager = new AIManager();

// Bind event handlers when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize AI manager
    window.AIManager.initialize();
    
    // Bind download button
    const downloadBtn = document.getElementById('ai-download-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            window.AIManager.startDownload();
        });
    }
    
    
    // Bind chat ready button (just highlights the chat button)
    const chatReadyBtn = document.getElementById('ai-chat-ready-btn');
    if (chatReadyBtn) {
        chatReadyBtn.addEventListener('click', () => {
            const chatToggle = document.getElementById('chat-toggle');
            if (chatToggle) {
                chatToggle.classList.add('animate-pulse');
                setTimeout(() => chatToggle.classList.remove('animate-pulse'), 3000);
                chatToggle.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    }
});

console.log('🚀 Consolidated AI Manager loaded');
