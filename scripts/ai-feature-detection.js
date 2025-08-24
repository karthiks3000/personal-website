// AI Feature Detection for Chrome's Prompt API
// This module handles detection of Chrome's built-in AI capabilities

class AIFeatureDetector {
    constructor() {
        this.isSupported = false;
        this.capabilities = null;
        this.debugMode = true; // Enable console logging for debugging
    }

    /**
     * Main function to detect Chrome's Prompt API availability
     * @param {Object} options - Optional parameters for availability checking
     * @returns {Promise<boolean>} True if AI features are available
     */
    async detectAICapability(options = {}) {
        this.log('Starting AI capability detection...');
        
        try {
            // Check if the LanguageModel global is available
            if (typeof LanguageModel === 'undefined') {
                this.log('LanguageModel global not available - AI features not supported');
                this.log('💡 To enable Chrome AI features:');
                this.log('   1. Use Chrome Canary or Chrome Dev (version 127+)');
                this.log('   2. Go to chrome://flags/#prompt-api-for-gemini-nano');
                this.log('   3. Set "Prompt API for Gemini Nano" to "Enabled"');
                this.log('   4. Go to chrome://flags/#optimization-guide-on-device-model');
                this.log('   5. Set "Optimization Guide On Device Model" to "Enabled BypassPerfRequirement"');
                this.log('   6. Restart Chrome');
                this.log('   7. Visit chrome://components/ and update "Optimization Guide On Device Model"');
                this.log('   8. Reload this page');
                return false;
            }

            this.log('✅ LanguageModel global found!');

            // Check availability using the correct API with options
            this.log('Checking AI language model availability...', options);
            const availability = await LanguageModel.availability(options);
            
            if (!availability) {
                this.log('Failed to get AI availability - AI features not supported');
                return false;
            }

            this.log('AI availability status received:', availability);
            
            // Store availability info for later use
            this.capabilities = { available: availability, options: options };
            
            switch (availability) {
                case 'available':
                    this.isSupported = true;
                    this.log('✅ AI features are available - no download needed!');
                    return true;
                    
                case 'downloadable':
                    this.log('⏳ AI features available after download - model needs to be downloaded first');
                    this.log('⚠️ User activation will be required to trigger download');
                    this.log('💡 Call testAIDownload() in console to trigger download with progress monitoring');
                    this.isSupported = true;
                    return true;
                    
                case 'downloading':
                    this.log('⏳ AI model is currently downloading - please wait for completion');
                    this.isSupported = true;
                    return true;
                    
                case 'unavailable':
                    this.log('❌ AI features unavailable - not supported on this device/browser');
                    this.log('💡 This could be due to:');
                    this.log('   - Browser version too old');
                    this.log('   - Feature flag not enabled');
                    this.log('   - Device/OS limitations');
                    this.log('   - Requested options not supported');
                    return false;
                    
                default:
                    this.log('❌ Unknown availability status:', availability);
                    this.log('💡 This might be a new status value - check Chrome documentation');
                    return false;
            }

        } catch (error) {
            this.log('Error during AI capability detection:', error);
            return false;
        }
    }



    /**
     * Check if the current browser is Chrome-based
     * @returns {boolean} True if Chrome-based browser
     */
    isChromeBasedBrowser() {
        const userAgent = navigator.userAgent;
        const isChrome = /Chrome/.test(userAgent) && /Google Inc/.test(navigator.vendor);
        const isEdge = /Edg/.test(userAgent);
        const isBrave = navigator.brave !== undefined;
        
        // Chrome, Edge (Chromium), or Brave
        const isChromeBasedBrowser = isChrome || isEdge || isBrave;
        
        this.log(`Browser detection - Chrome-based: ${isChromeBasedBrowser}`, {
            userAgent: userAgent,
            vendor: navigator.vendor,
            isChrome,
            isEdge,
            isBrave
        });
        
        return isChromeBasedBrowser;
    }

    /**
     * Get detailed information about AI capabilities
     * @returns {Object|null} Capabilities object or null if not available
     */
    getCapabilities() {
        return this.capabilities;
    }

    /**
     * Get AI model parameters (topK, temperature limits)
     * @returns {Promise<Object|null>} Model parameters or null if not available
     */
    async getModelParameters() {
        if (!this.isSupported) {
            this.log('Cannot get model parameters - AI not supported');
            return null;
        }

        try {
            this.log('Getting AI model parameters...');
            const params = await LanguageModel.params();
            this.log('Model parameters:', params);
            return params;
        } catch (error) {
            this.log('Error getting model parameters:', error);
            return null;
        }
    }

    /**
     * Test streaming functionality with a session
     * @param {Object} session - AI session object
     * @param {string} prompt - Prompt to test streaming with
     * @param {Function} onChunk - Callback for each chunk (optional)
     * @returns {Promise<string>} Complete response text
     */
    async testStreaming(session, prompt, onChunk = null) {
        if (!session || typeof session.promptStreaming !== 'function') {
            this.log('Session does not support streaming');
            return null;
        }

        try {
            this.log('Testing streaming with prompt:', prompt);
            
            const stream = session.promptStreaming(prompt);
            let fullResponse = '';
            let chunkCount = 0;

            for await (const chunk of stream) {
                chunkCount++;
                fullResponse += chunk;
                
                this.log(`Chunk ${chunkCount}:`, chunk);
                
                // Call custom chunk handler if provided
                if (onChunk && typeof onChunk === 'function') {
                    onChunk(chunk, chunkCount, fullResponse);
                }
            }

            this.log(`✅ Streaming complete. Total chunks: ${chunkCount}`);
            this.log('Full response:', fullResponse);
            
            return fullResponse;
        } catch (error) {
            this.log('Error during streaming:', error);
            return null;
        }
    }

    /**
     * Check if AI features are supported
     * @returns {boolean} True if supported
     */
    isAISupported() {
        return this.isSupported;
    }

    /**
     * Check if user activation is currently active
     * @returns {boolean} True if user activation is active
     */
    isUserActivationActive() {
        const isActive = navigator.userActivation?.isActive || false;
        this.log(`User activation status: ${isActive ? 'ACTIVE' : 'INACTIVE'}`);
        return isActive;
    }

    /**
     * Check if user activation has been used since page load
     * @returns {boolean} True if user has activated
     */
    hasUserActivated() {
        const hasActivated = navigator.userActivation?.hasBeenActive || false;
        this.log(`User has activated since page load: ${hasActivated ? 'YES' : 'NO'}`);
        return hasActivated;
    }

    /**
     * Check availability and user activation requirements for AI session creation
     * @param {Object} options - Session options to check availability for
     * @returns {Promise<Object>} Availability state with user activation info
     */
    async checkAvailabilityWithUserActivation(options = {}) {
        this.log('Checking AI availability with user activation requirements...');
        
        try {
            if (typeof LanguageModel === 'undefined') {
                return {
                    available: 'unavailable',
                    isSupported: false,
                    reason: 'LanguageModel API not available',
                    canProceed: false
                };
            }

            const availability = await LanguageModel.availability(options);
            this.log('Raw availability status:', availability);

            const result = {
                available: availability,
                isSupported: availability !== 'unavailable',
                userActivationActive: this.isUserActivationActive(),
                userHasActivated: this.hasUserActivated(),
                canProceed: false,
                reason: '',
                requiresUserInteraction: false
            };

            switch (availability) {
                case 'available':
                    result.canProceed = true;
                    result.reason = 'AI model is ready, no download needed';
                    break;
                    
                case 'downloadable':
                    result.canProceed = result.userActivationActive;
                    result.requiresUserInteraction = !result.userActivationActive;
                    if (result.canProceed) {
                        result.reason = 'AI model needs download, user activation present';
                    } else {
                        result.reason = 'AI model needs download, user interaction required';
                    }
                    break;
                    
                case 'downloading':
                    result.canProceed = false;
                    result.reason = 'AI model is currently downloading, please wait';
                    break;
                    
                case 'unavailable':
                    result.canProceed = false;
                    result.reason = 'AI features not supported on this device/browser';
                    break;
                    
                default:
                    result.canProceed = false;
                    result.reason = `Unknown availability status: ${availability}`;
                    break;
            }

            this.log('Availability check result:', result);
            return result;
            
        } catch (error) {
            this.log('Error checking availability with user activation:', error);
            return {
                available: 'unavailable',
                isSupported: false,
                reason: `Error: ${error.message}`,
                canProceed: false,
                userActivationActive: false,
                userHasActivated: false,
                requiresUserInteraction: false
            };
        }
    }

    /**
     * Create AI session with user activation validation
     * @param {Object} options - Session creation options
     * @returns {Promise<Object|null>} AI session or null if failed
     */
    async createSessionWithUserActivation(options = {}) {
        this.log('Creating AI session with user activation validation...');
        
        // First check availability and user activation requirements
        const availabilityCheck = await this.checkAvailabilityWithUserActivation(options);
        
        if (!availabilityCheck.isSupported) {
            this.log(`❌ Cannot create session: ${availabilityCheck.reason}`);
            throw new Error(`AI not supported: ${availabilityCheck.reason}`);
        }

        if (!availabilityCheck.canProceed) {
            if (availabilityCheck.requiresUserInteraction) {
                this.log('❌ User activation required for AI model download');
                throw new Error('User activation required - this must be called from a user interaction (click, tap, key press)');
            } else {
                this.log(`❌ Cannot proceed: ${availabilityCheck.reason}`);
                throw new Error(availabilityCheck.reason);
            }
        }

        // Proceed with session creation using the existing method
        this.log('✅ Availability check passed, creating session...');
        return await this.createSession(options);
    }

    /**
     * Test AI session creation with download progress monitoring
     * @returns {Promise<boolean>} True if session can be created
     */
    async testSessionCreation() {
        if (!this.isSupported) {
            this.log('Cannot test session creation - AI not supported');
            return false;
        }

        try {
            this.log('Testing AI session creation...');
            
            // Create session with download progress monitoring
            const session = await LanguageModel.create({
                systemPrompt: 'You are a test AI assistant.',
                monitor(m) {
                    m.addEventListener('downloadprogress', (e) => {
                        const progress = Math.round((e.loaded / e.total) * 100);
                        console.log(`[AI Detection] Model download progress: ${progress}%`);
                        
                        // Dispatch custom event for UI updates
                        window.dispatchEvent(new CustomEvent('aiModelDownloadProgress', {
                            detail: {
                                loaded: e.loaded,
                                total: e.total,
                                progress: progress
                            }
                        }));
                    });
                }
            });

            if (session) {
                this.log('✅ AI session created successfully');
                
                // Test a simple prompt
                const response = await session.prompt('Say hello');
                this.log('Test response:', response);
                
                // Clean up
                session.destroy();
                this.log('Test session destroyed');
                
                return true;
            } else {
                this.log('❌ Failed to create AI session');
                return false;
            }
        } catch (error) {
            this.log('Error testing session creation:', error);
            return false;
        }
    }

    /**
     * Create an AI session with advanced options and download progress monitoring
     * @param {Object} options Session options
     * @param {string} [options.systemPrompt] - System prompt for the session
     * @param {number} [options.topK] - Top-K parameter for response generation
     * @param {number} [options.temperature] - Temperature parameter for response generation
     * @param {Array} [options.initialPrompts] - Initial conversation history
     * @param {AbortSignal} [options.signal] - AbortSignal to cancel session creation
     * @param {Function} [options.monitor] - Custom monitor function for download progress
     * @returns {Promise<Object|null>} AI session or null if failed
     */
    async createSession(options = {}) {
        if (!this.isSupported) {
            this.log('Cannot create session - AI not supported');
            return null;
        }

        try {
            this.log('Creating AI session with options:', options);
            
            // Get model parameters to validate custom settings
            const modelParams = await this.getModelParameters();
            
            const sessionOptions = {};

            // Handle system prompt (legacy support)
            if (options.systemPrompt && !options.initialPrompts) {
                sessionOptions.initialPrompts = [
                    { role: 'system', content: options.systemPrompt }
                ];
            }

            // Handle initial prompts for conversation history
            if (options.initialPrompts) {
                sessionOptions.initialPrompts = options.initialPrompts;
                this.log('Using initial prompts:', options.initialPrompts);
            }

            // Handle topK and temperature parameters
            if (modelParams && (options.topK !== undefined || options.temperature !== undefined)) {
                // Both topK and temperature must be specified together
                if (options.topK !== undefined && options.temperature !== undefined) {
                    // Validate parameters against model limits
                    const topK = Math.min(Math.max(options.topK, 1), modelParams.maxTopK);
                    const temperature = Math.min(Math.max(options.temperature, 0.0), modelParams.maxTemperature);
                    
                    sessionOptions.topK = topK;
                    sessionOptions.temperature = temperature;
                    
                    this.log(`Using custom parameters - topK: ${topK}, temperature: ${temperature}`);
                    
                    if (topK !== options.topK) {
                        this.log(`⚠️ topK clamped from ${options.topK} to ${topK} (max: ${modelParams.maxTopK})`);
                    }
                    if (temperature !== options.temperature) {
                        this.log(`⚠️ temperature clamped from ${options.temperature} to ${temperature} (max: ${modelParams.maxTemperature})`);
                    }
                } else {
                    this.log('⚠️ Both topK and temperature must be specified together - using defaults');
                }
            }

            // Handle AbortSignal for cancellation
            if (options.signal) {
                sessionOptions.signal = options.signal;
                this.log('Using AbortSignal for session cancellation');
            }

            // Add download progress monitoring if not already provided
            if (!options.monitor && this.capabilities?.available === 'downloadable') {
                sessionOptions.monitor = (m) => {
                    this.log('📊 Download progress monitor attached - tracking REAL Chrome events only');
                    
                    let eventCount = 0;
                    let startTime = null;
                    
                    // Set up the real progress event listener - NO SIMULATION
                    m.addEventListener('downloadprogress', (e) => {
                        eventCount++;
                        if (!startTime) startTime = Date.now();
                        
                        const progress = Math.round(e.loaded * 100);
                        const elapsed = startTime ? Date.now() - startTime : 0;
                        
                        this.log(`🔄 REAL Chrome Progress Event #${eventCount}:`);
                        this.log(`   Progress: ${progress}% (e.loaded: ${e.loaded}, e.total: ${e.total})`);
                        this.log(`   Time elapsed: ${elapsed}ms`);
                        this.log(`   Raw event object:`, e);
                        
                        // Dispatch custom event for UI updates - ONLY real events
                        const progressEvent = new CustomEvent('aiModelDownloadProgress', {
                            detail: {
                                loaded: e.loaded,
                                total: e.total,
                                progress: progress,
                                eventNumber: eventCount,
                                elapsed: elapsed,
                                real: true // Mark as real event
                            }
                        });
                        
                        this.log('📡 Dispatching REAL progress event to UI:', progressEvent.detail);
                        window.dispatchEvent(progressEvent);
                    });
                    
                    // Log when monitor is ready
                    this.log('✅ Real progress event listener attached - NO simulation, Chrome events only');
                };
            } else if (options.monitor) {
                sessionOptions.monitor = options.monitor;
            }

            this.log('Final session options:', sessionOptions);
            const session = await LanguageModel.create(sessionOptions);
            
            if (session) {
                this.log('✅ AI session created successfully');
                return session;
            } else {
                this.log('❌ Failed to create AI session');
                return null;
            }
        } catch (error) {
            this.log('Error creating AI session:', error);
            
            // Handle specific error cases
            if (error.name === 'AbortError') {
                this.log('Session creation was cancelled');
            } else if (error.message?.includes('topK') || error.message?.includes('temperature')) {
                this.log('Parameter validation error - check topK and temperature values');
            }
            
            return null;
        }
    }

    /**
     * Get browser compatibility information
     * @returns {Object} Browser compatibility details
     */
    getBrowserCompatibilityInfo() {
        const userAgent = navigator.userAgent;
        const isChrome = /Chrome/.test(userAgent) && /Google Inc/.test(navigator.vendor);
        
        const info = {
            userAgent: userAgent,
            isChromeBasedBrowser: this.isChromeBasedBrowser(),
            hasLanguageModelGlobal: typeof LanguageModel !== 'undefined',
            chromeVersion: this.getChromeVersion(),
            isChromeVersionSupported: this.isChromeVersionSupported(),
            isAISupported: this.isSupported,
            capabilities: this.capabilities,
            isChrome: isChrome
        };

        this.log('Browser compatibility info:', info);
        
        // Show Chrome-specific instructions if on Chrome but AI not working
        if (isChrome && info.isChromeVersionSupported && !info.isAISupported) {
            this.showChromeActivationInstructions();
        }
        
        return info;
    }

    /**
     * Show Chrome-specific activation instructions
     */
    showChromeActivationInstructions() {
        console.log('🔧 Chrome AI Activation Required');
        console.log('You\'re using Chrome but AI features need to be activated:');
        console.log('');
        console.log('👉 Quick Setup:');
        console.log('1. Go to: chrome://flags/#prompt-api-for-gemini-nano');
        console.log('2. Set "Prompt API for Gemini Nano" to "Enabled"');
        console.log('3. Go to: chrome://flags/#optimization-guide-on-device-model');
        console.log('4. Set "Optimization Guide On Device Model" to "Enabled BypassPerfRequirement"');
        console.log('5. Restart Chrome');
        console.log('6. Refresh this page');
        console.log('');
        console.log('💡 For detailed instructions, run: showAISetupInstructions()');
    }

    /**
     * Get Chrome version number
     * @returns {string|null} Chrome version or null if not Chrome
     */
    getChromeVersion() {
        const userAgent = navigator.userAgent;
        const chromeMatch = userAgent.match(/Chrome\/(\d+)/);
        return chromeMatch ? chromeMatch[1] : null;
    }

    /**
     * Check if Chrome version supports AI features
     * @returns {boolean} True if version is sufficient
     */
    isChromeVersionSupported() {
        const version = this.getChromeVersion();
        if (!version) return false;
        
        const versionNumber = parseInt(version, 10);
        const minVersion = 127; // Chrome 127+ required for AI features
        
        this.log(`Chrome version: ${version}, minimum required: ${minVersion}`);
        return versionNumber >= minVersion;
    }

    /**
     * Initialize AI feature detection with graceful handling
     * @returns {Promise<Object>} Detection results
     */
    async initialize() {
        this.log('Initializing AI feature detection...');
        
        const startTime = performance.now();
        const isSupported = await this.detectAICapability();
        const endTime = performance.now();
        
        const results = {
            isSupported,
            detectionTime: Math.round(endTime - startTime),
            browserInfo: this.getBrowserCompatibilityInfo(),
            capabilities: this.capabilities,
            timestamp: new Date().toISOString()
        };

        this.log('AI feature detection completed:', results);
        
        // Dispatch custom event for other parts of the application
        window.dispatchEvent(new CustomEvent('aiFeatureDetectionComplete', {
            detail: results
        }));

        return results;
    }

    /**
     * Enable or disable debug logging
     * @param {boolean} enabled Whether to enable debug logging
     */
    setDebugMode(enabled) {
        this.debugMode = enabled;
        this.log(`Debug mode ${enabled ? 'enabled' : 'disabled'}`);
    }

    /**
     * Log messages with timestamp (only if debug mode is enabled)
     * @param {string} message Log message
     * @param {*} data Optional data to log
     */
    log(message, data = null) {
        if (!this.debugMode) return;
        
        const timestamp = new Date().toISOString();
        const prefix = `[AI Detection ${timestamp}]`;
        
        if (data !== null) {
            console.log(`${prefix} ${message}`, data);
        } else {
            console.log(`${prefix} ${message}`);
        }
    }
}

// Global AI feature detector instance
window.AIFeatureDetector = new AIFeatureDetector();

// Auto-initialize when DOM is loaded (if not already loaded)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', async () => {
        await window.AIFeatureDetector.initialize();
    });
} else {
    // DOM already loaded, initialize immediately
    window.AIFeatureDetector.initialize();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIFeatureDetector;
}

// Global helper functions for testing
window.testAIFeatures = async function() {
    console.log('=== AI Feature Test ===');
    
    if (window.AIFeatureDetector) {
        const results = await window.AIFeatureDetector.initialize();
        console.log('Detection Results:', results);
        
        if (results.isSupported) {
            console.log('Testing session creation...');
            const sessionTest = await window.AIFeatureDetector.testSessionCreation();
            console.log('Session test result:', sessionTest);
        }
        
        return results;
    } else {
        console.error('AIFeatureDetector not available');
        return null;
    }
};

window.testAIDownload = async function() {
    console.log('=== AI Download Test ===');
    
    if (window.AIFeatureDetector && window.AIFeatureDetector.isAISupported()) {
        console.log('Creating AI session to trigger download...');
        const session = await window.AIFeatureDetector.createSession({
            initialPrompts: [
                { role: 'system', content: 'You are a helpful assistant for testing download functionality.' }
            ]
        });
        
        if (session) {
            console.log('Session created successfully!');
            const response = await session.prompt('Hello, can you confirm you are working?');
            console.log('AI Response:', response);
            session.destroy();
            return true;
        } else {
            console.log('Failed to create session');
            return false;
        }
    } else {
        console.log('AI not supported or not initialized');
        return false;
    }
};

window.testAIParameters = async function() {
    console.log('=== AI Parameters Test ===');
    
    if (window.AIFeatureDetector && window.AIFeatureDetector.isAISupported()) {
        // Get model parameters
        const params = await window.AIFeatureDetector.getModelParameters();
        console.log('Model Parameters:', params);
        
        if (params) {
            console.log('Testing session with custom parameters...');
            
            // Test with slightly higher temperature
            const customTemp = Math.min(params.defaultTemperature * 1.2, params.maxTemperature);
            const session = await window.AIFeatureDetector.createSession({
                topK: params.defaultTopK,
                temperature: customTemp,
                initialPrompts: [
                    { role: 'system', content: 'You are a creative AI assistant.' },
                    { role: 'user', content: 'Tell me a short creative story.' },
                    { role: 'assistant', content: 'Once upon a time, in a digital realm...' }
                ]
            });
            
            if (session) {
                console.log(`Session created with topK: ${params.defaultTopK}, temperature: ${customTemp}`);
                const response = await session.prompt('Continue the story with an unexpected twist.');
                console.log('Creative AI Response:', response);
                session.destroy();
                return true;
            }
        }
    } else {
        console.log('AI not supported or not initialized');
        return false;
    }
};

window.testInitialPrompts = async function() {
    console.log('=== Initial Prompts Test ===');
    
    if (window.AIFeatureDetector && window.AIFeatureDetector.isAISupported()) {
        console.log('Creating session with conversation history...');
        
        // Example matching the official API documentation
        const session = await window.AIFeatureDetector.createSession({
            initialPrompts: [
                { role: 'system', content: 'You are a helpful and friendly assistant.' },
                { role: 'user', content: 'What is the capital of Italy?' },
                { role: 'assistant', content: 'The capital of Italy is Rome.' },
                { role: 'user', content: 'What language is spoken there?' },
                { 
                    role: 'assistant', 
                    content: 'The official language of Italy is Italian. It is spoken by the vast majority of the population, and Italian is used in government, education, and business throughout the country.' 
                }
            ]
        });
        
        if (session) {
            console.log('✅ Session created with conversation history');
            console.log('Testing continuation of conversation...');
            
            // Continue the conversation - the AI should remember the context
            const response = await session.prompt('What about the food culture there?');
            console.log('AI Response (with context):', response);
            
            // Test another follow-up
            const response2 = await session.prompt('Can you recommend some famous Italian dishes?');
            console.log('AI Follow-up Response:', response2);
            
            session.destroy();
            console.log('Session destroyed');
            return true;
        } else {
            console.log('❌ Failed to create session with initial prompts');
            return false;
        }
    } else {
        console.log('AI not supported or not initialized');
        return false;
    }
};

window.testAIStreaming = async function() {
    console.log('=== AI Streaming Test ===');
    
    if (window.AIFeatureDetector && window.AIFeatureDetector.isAISupported()) {
        console.log('Creating session for streaming test...');
        
        const session = await window.AIFeatureDetector.createSession({
            initialPrompts: [
                { role: 'system', content: 'You are a creative writing assistant.' }
            ]
        });
        
        if (session) {
            console.log('✅ Session created, testing streaming...');
            
            // Test streaming with a prompt that should generate a longer response
            const prompt = 'Write me a short poem about artificial intelligence and the future of technology.';
            
            let chunkCount = 0;
            const startTime = performance.now();
            
            const fullResponse = await window.AIFeatureDetector.testStreaming(
                session, 
                prompt,
                (chunk, count, accumulated) => {
                    chunkCount = count;
                    // Show progress in console
                    console.log(`📝 Chunk ${count} (${chunk.length} chars): "${chunk}"`);
                    console.log(`📊 Accumulated so far (${accumulated.length} chars): "${accumulated.substring(0, 100)}${accumulated.length > 100 ? '...' : ''}"`);
                }
            );
            
            const endTime = performance.now();
            const duration = Math.round(endTime - startTime);
            
            if (fullResponse) {
                console.log('✅ Streaming test completed successfully!');
                console.log(`📈 Stats: ${chunkCount} chunks, ${fullResponse.length} total characters, ${duration}ms duration`);
                console.log('📄 Final response:', fullResponse);
            } else {
                console.log('❌ Streaming test failed');
            }
            
            session.destroy();
            console.log('Session destroyed');
            return fullResponse !== null;
        } else {
            console.log('❌ Failed to create session for streaming test');
            return false;
        }
    } else {
        console.log('AI not supported or not initialized');
        return false;
    }
};

window.testStreamingWithParams = async function() {
    console.log('=== AI Streaming with Parameters Test ===');
    
    if (window.AIFeatureDetector && window.AIFeatureDetector.isAISupported()) {
        // Get model parameters first
        const params = await window.AIFeatureDetector.getModelParameters();
        console.log('Model parameters:', params);
        
        if (!params) {
            console.log('❌ Could not get model parameters');
            return false;
        }
        
        // Create session with custom parameters for more creative output
        const customTemp = Math.min(params.defaultTemperature * 1.5, params.maxTemperature);
        const session = await window.AIFeatureDetector.createSession({
            topK: params.defaultTopK,
            temperature: customTemp,
            initialPrompts: [
                { role: 'system', content: 'You are a creative storyteller who writes engaging narratives.' }
            ]
        });
        
        if (session) {
            console.log(`✅ Session created with temperature: ${customTemp}, topK: ${params.defaultTopK}`);
            
            const prompt = 'Write me an extra-long poem about a robot discovering emotions for the first time!';
            console.log('Testing streaming with creative prompt...');
            
            let wordCount = 0;
            const startTime = performance.now();
            
            const fullResponse = await window.AIFeatureDetector.testStreaming(
                session,
                prompt,
                (chunk, count, accumulated) => {
                    wordCount = accumulated.split(/\s+/).length;
                    console.log(`🎨 Creative chunk ${count}: "${chunk}"`);
                    console.log(`📊 Progress: ${wordCount} words so far...`);
                }
            );
            
            const endTime = performance.now();
            const duration = Math.round(endTime - startTime);
            
            if (fullResponse) {
                const finalWordCount = fullResponse.split(/\s+/).length;
                console.log('✅ Creative streaming test completed!');
                console.log(`📈 Final stats: ${finalWordCount} words, ${fullResponse.length} characters, ${duration}ms`);
                console.log('🎭 Creative poem:', fullResponse);
            }
            
            session.destroy();
            return fullResponse !== null;
        }
    } else {
        console.log('AI not supported or not initialized');
        return false;
    }
};

window.testAIWithAbort = async function() {
    console.log('=== AI Abort Signal Test ===');
    
    if (window.AIFeatureDetector && window.AIFeatureDetector.isAISupported()) {
        const controller = new AbortController();
        
        // Cancel after 2 seconds for demonstration
        setTimeout(() => {
            console.log('Aborting session creation...');
            controller.abort();
        }, 2000);
        
        try {
            const session = await window.AIFeatureDetector.createSession({
                signal: controller.signal,
                initialPrompts: [
                    { role: 'system', content: 'You are a test assistant.' }
                ]
            });
            
            if (session) {
                console.log('Session created before abort');
                session.destroy();
                return true;
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                console.log('✅ Session creation successfully aborted');
                return true;
            } else {
                console.log('❌ Unexpected error:', error);
                return false;
            }
        }
    } else {
        console.log('AI not supported or not initialized');
        return false;
    }
};

window.getAIStatus = function() {
    return {
        supported: window.aiSupported,
        capabilities: window.aiCapabilities,
        detector: window.AIFeatureDetector
    };
};

// Test functions for user activation functionality
window.testUserActivation = function() {
    console.log('=== User Activation Test ===');
    
    if (window.AIFeatureDetector) {
        const isActive = window.AIFeatureDetector.isUserActivationActive();
        const hasActivated = window.AIFeatureDetector.hasUserActivated();
        
        console.log('User Activation Status:');
        console.log('- Currently Active:', isActive ? '✅ YES' : '❌ NO');
        console.log('- Has Been Active:', hasActivated ? '✅ YES' : '❌ NO');
        
        if (navigator.userActivation) {
            console.log('- Native isActive:', navigator.userActivation.isActive);
            console.log('- Native hasBeenActive:', navigator.userActivation.hasBeenActive);
        } else {
            console.log('❌ navigator.userActivation not available');
        }
        
        return { isActive, hasActivated };
    } else {
        console.error('AIFeatureDetector not available');
        return null;
    }
};

window.testAvailabilityWithUserActivation = async function() {
    console.log('=== Availability with User Activation Test ===');
    
    if (window.AIFeatureDetector) {
        try {
            const result = await window.AIFeatureDetector.checkAvailabilityWithUserActivation();
            console.log('Availability Check Result:', result);
            
            console.log('Summary:');
            console.log('- Available:', result.available);
            console.log('- Is Supported:', result.isSupported ? '✅' : '❌');
            console.log('- Can Proceed:', result.canProceed ? '✅' : '❌');
            console.log('- Requires User Interaction:', result.requiresUserInteraction ? '⚠️ YES' : '✅ NO');
            console.log('- Reason:', result.reason);
            
            return result;
        } catch (error) {
            console.error('Error checking availability:', error);
            return null;
        }
    } else {
        console.error('AIFeatureDetector not available');
        return null;
    }
};

window.testSessionWithUserActivation = async function() {
    console.log('=== Session Creation with User Activation Test ===');
    
    if (window.AIFeatureDetector && window.AIFeatureDetector.isAISupported()) {
        try {
            console.log('Attempting to create session with user activation validation...');
            
            const session = await window.AIFeatureDetector.createSessionWithUserActivation({
                initialPrompts: [
                    { role: 'system', content: 'You are a test assistant for user activation validation.' }
                ]
            });
            
            if (session) {
                console.log('✅ Session created successfully with user activation!');
                
                // Test a simple prompt
                const response = await session.prompt('Hello! Can you confirm user activation worked?');
                console.log('AI Response:', response);
                
                // Clean up
                session.destroy();
                console.log('Session destroyed');
                
                return true;
            } else {
                console.log('❌ Failed to create session');
                return false;
            }
        } catch (error) {
            console.error('Error creating session with user activation:', error);
            
            if (error.message?.includes('User activation required')) {
                console.log('💡 This error is expected if you run this test without a user interaction (click, tap, key press)');
                console.log('💡 Try clicking a button on the page first, then immediately run this test');
            }
            
            return false;
        }
    } else {
        console.log('AI not supported or not initialized');
        return false;
    }
};

window.testUserActivationWorkflow = async function() {
    console.log('=== Complete User Activation Workflow Test ===');
    
    // Step 1: Check current user activation status
    console.log('1️⃣ Checking current user activation status...');
    const activationStatus = window.testUserActivation();
    
    // Step 2: Check availability with user activation
    console.log('\n2️⃣ Checking AI availability with user activation...');
    const availabilityCheck = await window.testAvailabilityWithUserActivation();
    
    // Step 3: Attempt session creation if possible
    if (availabilityCheck && availabilityCheck.canProceed) {
        console.log('\n3️⃣ Availability check passed, attempting session creation...');
        const sessionResult = await window.testSessionWithUserActivation();
        
        console.log('\n🎉 Complete workflow test results:');
        console.log('- User activation working:', activationStatus ? '✅' : '❌');
        console.log('- Availability check working:', availabilityCheck ? '✅' : '❌');
        console.log('- Session creation working:', sessionResult ? '✅' : '❌');
        
        return { activationStatus, availabilityCheck, sessionResult };
    } else {
        console.log('\n3️⃣ Cannot proceed with session creation');
        console.log('Reason:', availabilityCheck?.reason || 'Unknown');
        
        if (availabilityCheck?.requiresUserInteraction) {
            console.log('💡 Try clicking somewhere on the page first, then run this test again');
        }
        
        return { activationStatus, availabilityCheck, sessionResult: false };
    }
};

window.testCompleteAIWorkflow = async function() {
    console.log('=== Complete AI Workflow Test (Following Official Documentation) ===');
    
    try {
        // Step 1: Get model parameters
        console.log('1️⃣ Getting model parameters...');
        const { defaultTemperature, maxTemperature, defaultTopK, maxTopK } = 
            await LanguageModel.params();
        console.log(`Parameters: topK(${defaultTopK}-${maxTopK}), temp(${defaultTemperature}-${maxTemperature})`);
        
        // Step 2: Check availability
        console.log('2️⃣ Checking availability...');
        const available = await LanguageModel.availability();
        console.log('Availability:', available);
        
        if (available === 'unavailable') {
            console.log('❌ AI unavailable - cannot proceed');
            return false;
        }
        
        // Step 3: Create session
        console.log('3️⃣ Creating AI session...');
        const session = await LanguageModel.create();
        
        if (!session) {
            console.log('❌ Failed to create session');
            return false;
        }
        
        console.log('✅ Session created successfully');
        
        // Step 4: Test regular prompting
        console.log('4️⃣ Testing regular prompt...');
        const regularResponse = await session.prompt('Hello! Can you introduce yourself briefly?');
        console.log('Regular response:', regularResponse);
        
        // Step 5: Test streaming (following official example)
        console.log('5️⃣ Testing streaming with long content...');
        console.log('Prompting: "Write me an extra-long poem!"');
        
        const stream = session.promptStreaming('Write me an extra-long poem!');
        let streamedContent = '';
        let chunkCount = 0;
        
        console.log('📡 Streaming chunks:');
        for await (const chunk of stream) {
            chunkCount++;
            streamedContent += chunk;
            console.log(`Chunk ${chunkCount}:`, chunk);
        }
        
        console.log('✅ Streaming completed!');
        console.log(`📊 Total chunks: ${chunkCount}, Total length: ${streamedContent.length}`);
        console.log('📝 Complete streamed poem:', streamedContent);
        
        // Step 6: Clean up
        console.log('6️⃣ Cleaning up...');
        session.destroy();
        console.log('✅ Session destroyed');
        
        console.log('🎉 Complete AI workflow test successful!');
        return true;
        
    } catch (error) {
        console.error('❌ Error in complete workflow test:', error);
        return false;
    }
};

window.showAISetupInstructions = function() {
    console.log('=== Chrome AI Setup Instructions ===');
    console.log('');
    console.log('1. 📥 Download Chrome Canary or Chrome Dev:');
    console.log('   - Chrome Canary: https://www.google.com/chrome/canary/');
    console.log('   - Chrome Dev: https://www.google.com/chrome/dev/');
    console.log('');
    console.log('2. 🚩 Enable Required Flags:');
    console.log('   a) Go to: chrome://flags/#prompt-api-for-gemini-nano');
    console.log('      Set to: "Enabled"');
    console.log('   b) Go to: chrome://flags/#optimization-guide-on-device-model');
    console.log('      Set to: "Enabled BypassPerfRequirement"');
    console.log('');
    console.log('3. 🔄 Restart Chrome completely');
    console.log('');
    console.log('4. 📦 Download AI Model:');
    console.log('   a) Go to: chrome://components/');
    console.log('   b) Find "Optimization Guide On Device Model"');
    console.log('   c) Click "Check for update"');
    console.log('   d) Wait for download to complete');
    console.log('');
    console.log('5. 🔄 Reload this page and test with available functions:');
    console.log('   - testAIFeatures() - Basic detection');
    console.log('   - testAIStreaming() - Test streaming responses');
    console.log('   - testInitialPrompts() - Test conversation history');
    console.log('   - testCompleteAIWorkflow() - Full API test');
    console.log('');
    console.log('Current Status:');
    const status = window.getAIStatus();
    console.log('- Browser:', navigator.userAgent.includes('Chrome') ? 'Chrome-based ✅' : 'Not Chrome ❌');
    console.log('- Version:', window.AIFeatureDetector?.getChromeVersion() || 'Unknown');
    console.log('- LanguageModel Global:', typeof LanguageModel !== 'undefined' ? 'Available ✅' : 'Not Available ❌');
    console.log('- AI Supported:', status.supported ? 'Yes ✅' : 'No ❌');
};
