/**
 * ERP Chat Widget Universal Integration Script
 * 
 * This script automatically integrates the chat widget into any ERP page
 * without requiring manual modification of existing HTML files.
 * 
 * Usage:
 * 1. Include this script in your ERP pages
 * 2. The widget will automatically initialize and position itself
 * 3. Customize options by setting window.ERP_CHAT_CONFIG before loading
 */

(function() {
    'use strict';

    // Default configuration
    const defaultConfig = {
        apiUrl: 'http://127.0.0.1:8000',
        position: 'bottom-right',
        minimized: true,
        theme: 'professional',
        autoInit: true,
        zIndex: 10000,
        // ERP-specific settings
        respectExistingUI: true,
        avoidConflicts: true,
        persistAcrossPages: true
    };

    // Merge with user configuration if provided
    const config = Object.assign({}, defaultConfig, window.ERP_CHAT_CONFIG || {});

    // Check if widget is already loaded
    if (window.erpChatWidget) {
        console.log('ERP Chat Widget already initialized');
        return;
    }

    // Utility functions
    const utils = {
        // Check if we're in an iframe or embedded context
        isEmbedded: function() {
            return window !== window.top;
        },

        // Check for conflicting elements in the bottom-right corner
        checkForConflicts: function() {
            const conflicts = [];
            const elements = document.querySelectorAll('*');
            
            elements.forEach(el => {
                const style = window.getComputedStyle(el);
                if (style.position === 'fixed') {
                    const rect = el.getBoundingClientRect();
                    const isBottomRight = rect.right > window.innerWidth - 100 && 
                                         rect.bottom > window.innerHeight - 100;
                    if (isBottomRight) {
                        conflicts.push(el);
                    }
                }
            });

            return conflicts;
        },

        // Adjust position if conflicts detected
        adjustPosition: function(conflicts) {
            if (conflicts.length > 0 && config.avoidConflicts) {
                console.log('ERP Chat: Conflicts detected, adjusting position');
                return 'bottom-left';
            }
            return config.position;
        },

        // Detect ERP system type
        detectERPSystem: function() {
            const indicators = {
                sap: ['sap', 'sapui5', 'fiori'],
                oracle: ['oracle', 'oracleapps'],
                microsoft: ['dynamics', 'nav', 'ax'],
                custom: ['erp', 'enterprise']
            };

            const html = document.documentElement.outerHTML.toLowerCase();
            
            for (const [system, keywords] of Object.entries(indicators)) {
                if (keywords.some(keyword => html.includes(keyword))) {
                    return system;
                }
            }

            return 'unknown';
        },

        // Load external script
        loadScript: function(src, callback) {
            const script = document.createElement('script');
            script.src = src;
            script.onload = callback;
            script.onerror = function() {
                console.error('Failed to load ERP Chat Widget script:', src);
            };
            document.head.appendChild(script);
        },

        // Wait for DOM to be ready
        ready: function(callback) {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', callback);
            } else {
                callback();
            }
        }
    };

    // ERP-specific adaptations
    const erpAdaptations = {
        sap: function() {
            // SAP Fiori specific adjustments
            config.theme = 'sap-fiori';
            config.zIndex = 15000; // Higher z-index for SAP
        },

        oracle: function() {
            // Oracle Apps specific adjustments
            config.theme = 'oracle';
            config.zIndex = 12000;
        },

        microsoft: function() {
            // Microsoft Dynamics specific adjustments
            config.theme = 'microsoft';
            config.zIndex = 11000;
        },

        custom: function() {
            // Generic ERP adjustments
            config.theme = 'professional';
        }
    };

    // Initialize the widget
    function initializeWidget() {
        // Detect ERP system and apply adaptations
        const erpSystem = utils.detectERPSystem();
        console.log('ERP Chat: Detected system type:', erpSystem);
        
        if (erpAdaptations[erpSystem]) {
            erpAdaptations[erpSystem]();
        }

        // Check for conflicts and adjust position
        const conflicts = utils.checkForConflicts();
        config.position = utils.adjustPosition(conflicts);

        // Load the main widget script if not already loaded
        if (typeof ERPChatWidget === 'undefined') {
            // Try to load from same directory first
            const scriptPath = document.currentScript ? 
                document.currentScript.src.replace('erp-chat-integration.js', 'chat-widget.js') :
                'chat-widget.js';

            utils.loadScript(scriptPath, function() {
                createWidget();
            });
        } else {
            createWidget();
        }
    }

    // Create and configure the widget
    function createWidget() {
        try {
            window.erpChatWidget = new ERPChatWidget(config);
            
            // Add ERP-specific event listeners
            addERPEventListeners();
            
            // Mark as successfully initialized
            window.erpChatWidgetReady = true;
            
            // Dispatch custom event for other scripts
            const event = new CustomEvent('erpChatWidgetReady', {
                detail: { widget: window.erpChatWidget, config: config }
            });
            document.dispatchEvent(event);
            
            console.log('ERP Chat Widget initialized successfully');
            
        } catch (error) {
            console.error('Failed to initialize ERP Chat Widget:', error);
        }
    }

    // Add ERP-specific event listeners
    function addERPEventListeners() {
        // Listen for page navigation in SPAs
        let currentUrl = window.location.href;
        
        const observer = new MutationObserver(function() {
            if (window.location.href !== currentUrl) {
                currentUrl = window.location.href;
                // Page changed, ensure widget persists
                if (window.erpChatWidget && config.persistAcrossPages) {
                    console.log('ERP Chat: Page navigation detected, maintaining widget state');
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Listen for window resize to adjust position if needed
        window.addEventListener('resize', function() {
            if (window.erpChatWidget && config.avoidConflicts) {
                const conflicts = utils.checkForConflicts();
                const newPosition = utils.adjustPosition(conflicts);
                if (newPosition !== config.position) {
                    // Update widget position
                    window.erpChatWidget.widget.className = 
                        window.erpChatWidget.widget.className.replace(config.position, newPosition);
                    config.position = newPosition;
                }
            }
        });

        // Handle visibility changes (tab switching)
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                // Page is hidden, save state
                if (window.erpChatWidget) {
                    window.erpChatWidget.saveState();
                }
            }
        });
    }

    // Auto-initialize when DOM is ready
    if (config.autoInit) {
        utils.ready(function() {
            // Small delay to ensure other scripts have loaded
            setTimeout(initializeWidget, 100);
        });
    }

    // Expose initialization function for manual control
    window.initERPChatWidget = initializeWidget;

    // Expose configuration for runtime changes
    window.ERPChatConfig = config;

})();

// CSS for ERP-specific themes
(function addERPThemes() {
    const themeStyles = `
        /* SAP Fiori Theme */
        .erp-chat-widget.sap-fiori .chat-toggle {
            background: linear-gradient(135deg, #0070f2 0%, #005cb9 100%);
        }
        
        .erp-chat-widget.sap-fiori .chat-header {
            background: linear-gradient(135deg, #0070f2 0%, #005cb9 100%);
        }

        /* Oracle Theme */
        .erp-chat-widget.oracle .chat-toggle {
            background: linear-gradient(135deg, #ff0000 0%, #cc0000 100%);
        }
        
        .erp-chat-widget.oracle .chat-header {
            background: linear-gradient(135deg, #ff0000 0%, #cc0000 100%);
        }

        /* Microsoft Theme */
        .erp-chat-widget.microsoft .chat-toggle {
            background: linear-gradient(135deg, #0078d4 0%, #106ebe 100%);
        }
        
        .erp-chat-widget.microsoft .chat-header {
            background: linear-gradient(135deg, #0078d4 0%, #106ebe 100%);
        }

        /* Enhanced positioning for ERP environments */
        .erp-chat-widget.bottom-right.erp-adjusted {
            bottom: 30px;
            right: 30px;
        }

        .erp-chat-widget.bottom-left.erp-adjusted {
            bottom: 30px;
            left: 30px;
        }

        /* Ensure widget stays above ERP modals */
        .erp-chat-widget {
            z-index: var(--erp-chat-z-index, 10000) !important;
        }

        /* Mobile adjustments for ERP */
        @media (max-width: 768px) {
            .erp-chat-widget.erp-mobile {
                bottom: 10px;
                right: 10px;
            }
            
            .erp-chat-widget.erp-mobile .chat-window {
                width: calc(100vw - 20px);
                height: calc(100vh - 80px);
                max-width: none;
                max-height: none;
                bottom: 60px;
                right: 0;
            }
        }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.id = 'erp-chat-themes';
    styleSheet.textContent = themeStyles;
    document.head.appendChild(styleSheet);
})();
