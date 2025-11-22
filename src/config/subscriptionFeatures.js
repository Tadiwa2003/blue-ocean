/**
 * Subscription Feature Configuration
 * Defines what features are available for each subscription tier
 */

export const SUBSCRIPTION_TIERS = {
    BASIC: 'basic',
    PROFESSIONAL: 'professional',
    ENTERPRISE: 'enterprise',
};

export const SUBSCRIPTION_FEATURES = {
    // Basic Tier Features - GOOD (Essential tools to get started)
    [SUBSCRIPTION_TIERS.BASIC]: {
        // Storefront Limits
        maxStorefronts: 1,
        maxProducts: 10,
        maxServices: 5,
        maxProductImages: 3,
        maxServiceImages: 2,
        maxCategories: 5,
        maxOrders: 50, // per month

        // Customization - Basic but functional
        customThemes: false,
        customDomain: false,
        customBranding: true, // Can set colors and logo
        removeWatermark: false,
        customFonts: false,
        advancedStyling: false,

        // Analytics - Essential insights
        basicAnalytics: true,
        advancedAnalytics: false,
        customReports: false,
        exportData: false,
        realTimeAnalytics: false,
        customerInsights: false,
        salesForecasting: false,

        // Features - Core functionality
        inventoryManagement: false,
        orderTracking: true, // Basic tracking
        customerManagement: false,
        emailMarketing: false,
        smsNotifications: false,
        multiCurrency: false,
        multiLanguage: false,
        discountCodes: true, // Basic discounts
        giftCards: false,
        subscriptionProducts: false,

        // Support - Standard support
        emailSupport: true,
        prioritySupport: false,
        phoneSupport: false,
        dedicatedManager: false,
        liveChat: false,
        responseTime: '48 hours',

        // Integration - Limited
        apiAccess: false,
        webhooks: false,
        customIntegrations: false,
        thirdPartyApps: false,
        zapierIntegration: false,

        // Advanced - Not available
        multiUserAccounts: false,
        roleBasedAccess: false,
        whiteLabel: false,
        customCheckout: false,
        automatedWorkflows: false,
        aiAssistant: false,

        // Security & Compliance
        ssl: true,
        backups: 'Weekly',
        dataRetention: '30 days',
        twoFactorAuth: true,
        fraudDetection: false,
        pciCompliance: true,
    },

    // Professional Tier Features - BETTER (Powerful growth tools)
    [SUBSCRIPTION_TIERS.PROFESSIONAL]: {
        // Storefront Limits - Generous
        maxStorefronts: 5, // Increased from 3
        maxProducts: -1, // Unlimited
        maxServices: -1, // Unlimited
        maxProductImages: 15, // Increased from 10
        maxServiceImages: 12, // Increased from 8
        maxCategories: -1, // Unlimited
        maxOrders: -1, // Unlimited

        // Customization - Full control
        customThemes: true,
        customDomain: true,
        customBranding: true,
        removeWatermark: true,
        customFonts: true,
        advancedStyling: true,

        // Analytics - Comprehensive insights
        basicAnalytics: true,
        advancedAnalytics: true,
        customReports: true,
        exportData: true,
        realTimeAnalytics: true,
        customerInsights: true,
        salesForecasting: true,

        // Features - Advanced tools
        inventoryManagement: true,
        orderTracking: true, // Advanced tracking
        customerManagement: true,
        emailMarketing: true,
        smsNotifications: false, // Reserved for Enterprise
        multiCurrency: true,
        multiLanguage: true,
        discountCodes: true,
        giftCards: true,
        subscriptionProducts: true,

        // Support - Priority support
        emailSupport: true,
        prioritySupport: true,
        phoneSupport: false, // Reserved for Enterprise
        dedicatedManager: false,
        liveChat: true,
        responseTime: '12 hours',

        // Integration - Full API access
        apiAccess: true,
        webhooks: true,
        customIntegrations: true,
        thirdPartyApps: true,
        zapierIntegration: true,

        // Advanced - Team collaboration
        multiUserAccounts: true,
        maxUsers: 10,
        roleBasedAccess: true,
        whiteLabel: false, // Reserved for Enterprise
        customCheckout: true,
        automatedWorkflows: true,
        aiAssistant: false, // Reserved for Enterprise

        // Security & Compliance
        ssl: true,
        backups: 'Daily',
        dataRetention: '1 year',
        twoFactorAuth: true,
        fraudDetection: true,
        pciCompliance: true,
    },

    // Enterprise Tier Features - BEST OF THE BEST (Premium everything)
    [SUBSCRIPTION_TIERS.ENTERPRISE]: {
        // Storefront Limits - Unlimited everything
        maxStorefronts: -1, // Unlimited
        maxProducts: -1, // Unlimited
        maxServices: -1, // Unlimited
        maxProductImages: -1, // Unlimited
        maxServiceImages: -1, // Unlimited
        maxCategories: -1, // Unlimited
        maxOrders: -1, // Unlimited

        // Customization - Complete white-label
        customThemes: true,
        customDomain: true,
        customBranding: true,
        removeWatermark: true,
        customFonts: true,
        advancedStyling: true,

        // Analytics - Enterprise-grade insights
        basicAnalytics: true,
        advancedAnalytics: true,
        customReports: true,
        exportData: true,
        realTimeAnalytics: true,
        customerInsights: true,
        salesForecasting: true,
        predictiveAnalytics: true,
        customDashboards: true,
        dataWarehouse: true,

        // Features - Premium everything
        inventoryManagement: true,
        orderTracking: true,
        customerManagement: true,
        emailMarketing: true,
        smsNotifications: true,
        multiCurrency: true,
        multiLanguage: true,
        discountCodes: true,
        giftCards: true,
        subscriptionProducts: true,
        advancedShipping: true,
        dropshipping: true,

        // Support - VIP treatment
        emailSupport: true,
        prioritySupport: true,
        phoneSupport: true,
        dedicatedManager: true,
        liveChat: true,
        responseTime: '1 hour',
        slaGuarantee: '99.9%',
        onboarding: true,
        training: true,

        // Integration - Custom development
        apiAccess: true,
        webhooks: true,
        customIntegrations: true,
        thirdPartyApps: true,
        zapierIntegration: true,
        customApiDevelopment: true,
        graphqlApi: true,

        // Advanced - Enterprise features
        multiUserAccounts: true,
        maxUsers: -1, // Unlimited
        roleBasedAccess: true,
        whiteLabel: true,
        customCheckout: true,
        automatedWorkflows: true,
        aiAssistant: true,
        advancedAutomation: true,
        customReporting: true,

        // Security & Compliance - Maximum security
        ssl: true,
        backups: 'Real-time',
        dataRetention: 'Unlimited',
        twoFactorAuth: true,
        fraudDetection: true,
        pciCompliance: true,
        soc2Compliance: true,
        gdprCompliance: true,
        hipaaCompliance: true,
        customSecurity: true,
        penetrationTesting: true,

        // Exclusive Enterprise Features
        priorityFeatureRequests: true,
        betaAccess: true,
        customDevelopment: true,
        dedicatedInfrastructure: true,
        loadBalancing: true,
        cdn: true,
        customSla: true,
    },
};

/**
 * Check if a feature is available for a subscription tier
 * @param {string} tier - Subscription tier (basic, professional, enterprise)
 * @param {string} feature - Feature name
 * @returns {boolean|number} - Feature availability or limit (-1 for unlimited)
 */
export function hasFeature(tier, feature) {
    if (!tier || !SUBSCRIPTION_FEATURES[tier]) {
        return false;
    }
    return SUBSCRIPTION_FEATURES[tier][feature] || false;
}

/**
 * Check if user can add more items based on their subscription
 * @param {string} tier - Subscription tier
 * @param {string} limitType - Type of limit (maxProducts, maxServices, etc.)
 * @param {number} currentCount - Current count of items
 * @returns {boolean} - Whether user can add more
 */
export function canAddMore(tier, limitType, currentCount) {
    const limit = hasFeature(tier, limitType);

    // -1 means unlimited
    if (limit === -1) return true;

    // Check if current count is below limit
    return currentCount < limit;
}

/**
 * Get remaining quota for a feature
 * @param {string} tier - Subscription tier
 * @param {string} limitType - Type of limit
 * @param {number} currentCount - Current count
 * @returns {number|string} - Remaining quota or 'unlimited'
 */
export function getRemainingQuota(tier, limitType, currentCount) {
    const limit = hasFeature(tier, limitType);

    if (limit === -1) return 'unlimited';
    if (limit === false || limit === 0) return 0;

    return Math.max(0, limit - currentCount);
}

/**
 * Get upgrade message for a feature
 * @param {string} currentTier - Current subscription tier
 * @param {string} feature - Feature name
 * @returns {string} - Upgrade message
 */
export function getUpgradeMessage(currentTier, feature) {
    const messages = {
        maxStorefronts: 'Upgrade to create more storefronts',
        maxProducts: 'Upgrade to add unlimited products',
        maxServices: 'Upgrade to add unlimited services',
        customThemes: 'Upgrade to Professional for custom themes',
        advancedAnalytics: 'Upgrade to Professional for advanced analytics',
        apiAccess: 'Upgrade to Professional for API access',
        whiteLabel: 'Upgrade to Enterprise for white-label options',
        dedicatedManager: 'Upgrade to Enterprise for a dedicated account manager',
    };

    return messages[feature] || 'Upgrade to unlock this feature';
}

/**
 * Get the next tier that has a feature
 * @param {string} currentTier - Current subscription tier
 * @param {string} feature - Feature name
 * @returns {string|null} - Next tier with feature or null
 */
export function getNextTierWithFeature(currentTier, feature) {
    const tiers = [SUBSCRIPTION_TIERS.BASIC, SUBSCRIPTION_TIERS.PROFESSIONAL, SUBSCRIPTION_TIERS.ENTERPRISE];
    const currentIndex = tiers.indexOf(currentTier);

    for (let i = currentIndex + 1; i < tiers.length; i++) {
        if (hasFeature(tiers[i], feature)) {
            return tiers[i];
        }
    }

    return null;
}

export default {
    SUBSCRIPTION_TIERS,
    SUBSCRIPTION_FEATURES,
    hasFeature,
    canAddMore,
    getRemainingQuota,
    getUpgradeMessage,
    getNextTierWithFeature,
};
