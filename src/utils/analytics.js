/**
 * Analytics Tracking Utilities
 * Track user interactions and template usage for insights
 */

class Analytics {
    constructor() {
        this.events = [];
        this.sessionId = this.generateSessionId();
        this.startTime = Date.now();
    }

    generateSessionId() {
        return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Track a custom event
     */
    track(eventName, properties = {}) {
        const event = {
            name: eventName,
            properties,
            timestamp: new Date().toISOString(),
            sessionId: this.sessionId,
            url: window.location.href,
            userAgent: navigator.userAgent,
        };

        this.events.push(event);

        // Log in development
        if (import.meta.env.DEV) {
            console.log('📊 Analytics Event:', eventName, properties);
        }

        // Send to analytics service in production
        if (import.meta.env.PROD) {
            this.sendToAnalytics(event);
        }

        // Store locally for insights
        this.storeLocally(event);
    }

    /**
     * Track template selection
     */
    trackTemplateSelection(templateId, templateName) {
        this.track('template_selected', {
            templateId,
            templateName,
            category: 'storefront_creation',
        });
    }

    /**
     * Track template application
     */
    trackTemplateApplied(templateId, templateName, customizations = {}) {
        this.track('template_applied', {
            templateId,
            templateName,
            customizations,
            category: 'storefront_creation',
        });
    }

    /**
     * Track storefront creation
     */
    trackStorefrontCreated(storefrontData) {
        this.track('storefront_created', {
            storefrontId: storefrontData.id,
            storefrontName: storefrontData.name,
            template: storefrontData.design?.template,
            type: storefrontData.type,
            category: 'storefront',
        });
    }

    /**
     * Track page view
     */
    trackPageView(pageName, properties = {}) {
        this.track('page_view', {
            pageName,
            ...properties,
            category: 'navigation',
        });
    }

    /**
     * Track user action
     */
    trackAction(actionName, properties = {}) {
        this.track('user_action', {
            actionName,
            ...properties,
            category: 'interaction',
        });
    }

    /**
     * Track error
     */
    trackError(error, context = {}) {
        this.track('error', {
            message: error.message,
            stack: error.stack,
            context,
            category: 'error',
        });
    }

    /**
     * Track performance metric
     */
    trackPerformance(metricName, value, unit = 'ms') {
        this.track('performance', {
            metricName,
            value,
            unit,
            category: 'performance',
        });
    }

    /**
     * Get template usage statistics
     */
    getTemplateStats() {
        const templateEvents = this.events.filter(
            e => e.name === 'template_selected' || e.name === 'template_applied'
        );

        const stats = {};
        templateEvents.forEach(event => {
            const templateId = event.properties.templateId;
            if (!stats[templateId]) {
                stats[templateId] = {
                    templateId,
                    templateName: event.properties.templateName,
                    selections: 0,
                    applications: 0,
                };
            }

            if (event.name === 'template_selected') {
                stats[templateId].selections += 1;
            } else if (event.name === 'template_applied') {
                stats[templateId].applications += 1;
            }
        });

        return Object.values(stats).sort((a, b) => b.applications - a.applications);
    }

    /**
     * Get popular templates
     */
    getPopularTemplates(limit = 5) {
        const stats = this.getTemplateStats();
        return stats.slice(0, limit);
    }

    /**
     * Get session duration
     */
    getSessionDuration() {
        return Date.now() - this.startTime;
    }

    /**
     * Get all events
     */
    getAllEvents() {
        return this.events;
    }

    /**
     * Get events by category
     */
    getEventsByCategory(category) {
        return this.events.filter(e => e.properties.category === category);
    }

    /**
     * Send event to analytics service
     */
    async sendToAnalytics(event) {
        try {
            // TODO: Replace with your analytics endpoint
            // await fetch('/api/analytics', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify(event),
            // });

            // Placeholder for analytics integration
            // Examples: Google Analytics, Mixpanel, Amplitude, etc.
        } catch (error) {
            console.error('Failed to send analytics:', error);
        }
    }

    /**
     * Store event locally for offline analysis
     */
    storeLocally(event) {
        try {
            const stored = localStorage.getItem('brightpath_analytics') || '[]';
            const events = JSON.parse(stored);
            events.push(event);

            // Keep only last 100 events
            if (events.length > 100) {
                events.shift();
            }

            localStorage.setItem('brightpath_analytics', JSON.stringify(events));
        } catch (error) {
            // Ignore localStorage errors
        }
    }

    /**
     * Get locally stored events
     */
    getLocalEvents() {
        try {
            const stored = localStorage.getItem('brightpath_analytics') || '[]';
            return JSON.parse(stored);
        } catch (error) {
            return [];
        }
    }

    /**
     * Clear local events
     */
    clearLocalEvents() {
        try {
            localStorage.removeItem('brightpath_analytics');
        } catch (error) {
            // Ignore
        }
    }

    /**
     * Export analytics data
     */
    exportData() {
        const data = {
            sessionId: this.sessionId,
            sessionDuration: this.getSessionDuration(),
            events: this.events,
            templateStats: this.getTemplateStats(),
            popularTemplates: this.getPopularTemplates(),
            timestamp: new Date().toISOString(),
        };

        return data;
    }

    /**
     * Download analytics data as JSON
     */
    downloadData() {
        const data = this.exportData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `brightpath-analytics-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Create singleton instance
const analytics = new Analytics();

// Export singleton and class
export { Analytics };
export default analytics;

// Convenience methods
export const trackTemplateSelection = (templateId, templateName) =>
    analytics.trackTemplateSelection(templateId, templateName);

export const trackTemplateApplied = (templateId, templateName, customizations) =>
    analytics.trackTemplateApplied(templateId, templateName, customizations);

export const trackStorefrontCreated = (storefrontData) =>
    analytics.trackStorefrontCreated(storefrontData);

export const trackPageView = (pageName, properties) =>
    analytics.trackPageView(pageName, properties);

export const trackAction = (actionName, properties) =>
    analytics.trackAction(actionName, properties);

export const trackError = (error, context) =>
    analytics.trackError(error, context);

export const trackPerformance = (metricName, value, unit) =>
    analytics.trackPerformance(metricName, value, unit);

export const getTemplateStats = () =>
    analytics.getTemplateStats();

export const getPopularTemplates = (limit) =>
    analytics.getPopularTemplates(limit);
