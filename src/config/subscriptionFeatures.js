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
    // Basic Tier Features
    [SUBSCRIPTION_TIERS.BASIC]: {
        // Storefront Limits
        maxStorefronts: 1,
        maxProducts: 10,
        maxServices: 5,
        maxProductImages: 3,
        maxServiceImages: 2,

        // Customization
        customThemes: false,
        customDomain: false,
        customBranding: false,
        removeWatermark: false,

        // Analytics
        basicAnalytics: true,
        advancedAnalytics: false,
        customReports: false,
        exportData: false,

        // Features
        inventoryManagement: false,
        orderTracking: false,
        customerManagement: false,
        emailMarketing: false,
        smsNotifications: false,
        multiCurrency: false,
        multiLanguage: false,

        // Support
        emailSupport: true,
        prioritySupport: false,
        phoneSupport: false,
        dedicatedManager: false,

        // Integration
        apiAccess: false,
        webhooks: false,
        customIntegrations: false,
        thirdPartyApps: false,

        // Advanced
        multiUserAccounts: false,
        roleBasedAccess: false,
        whiteLabel: false,
        customCheckout: false,
    },

    // Professional Tier Features
    [SUBSCRIPTION_TIERS.PROFESSIONAL]: {
        // Storefront Limits
        maxStorefronts: 3,
        maxProducts: -1, // Unlimited
        maxServices: -1, // Unlimited
        maxProductImages: 10,
        maxServiceImages: 8,

        // Customization
        customThemes: true,
        customDomain: true,
        customBranding: true,
        removeWatermark: true,

        // Analytics
        basicAnalytics: true,
        advancedAnalytics: true,
        customReports: true,
        exportData: true,

        // Features
        inventoryManagement: true,
        orderTracking: true,
        customerManagement: true,
        emailMarketing: true,
        smsNotifications: false,
        multiCurrency: true,
        multiLanguage: false,

        // Support
        emailSupport: true,
        prioritySupport: true,
        phoneSupport: false,
        dedicatedManager: false,

        // Integration
        apiAccess: true,
        webhooks: true,
        customIntegrations: false,
        thirdPartyApps: true,

        // Advanced
        multiUserAccounts: true,
        roleBasedAccess: true,
        whiteLabel: false,
        customCheckout: true,
    },

    // Enterprise Tier Features
    [SUBSCRIPTION_TIERS.ENTERPRISE]: {
        // Storefront Limits
        maxStorefronts: -1, // Unlimited
        maxProducts: -1, // Unlimited
        maxServices: -1, // Unlimited
        maxProductImages: -1, // Unlimited
        maxServiceImages: -1, // Unlimited

        // Customization
        customThemes: true,
        customDomain: true,
        customBranding: true,
        removeWatermark: true,

        // Analytics
        basicAnalytics: true,
        advancedAnalytics: true,
        customReports: true,
        exportData: true,

        // Features
        inventoryManagement: true,
        orderTracking: true,
        customerManagement: true,
        emailMarketing: true,
        smsNotifications: true,
        multiCurrency: true,
        multiLanguage: true,

        // Support
        emailSupport: true,
        prioritySupport: true,
        phoneSupport: true,
        dedicatedManager: true,

        // Integration
        apiAccess: true,
        webhooks: true,
        customIntegrations: true,
        thirdPartyApps: true,

        // Advanced
        multiUserAccounts: true,
        roleBasedAccess: true,
        whiteLabel: true,
        customCheckout: true,
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
