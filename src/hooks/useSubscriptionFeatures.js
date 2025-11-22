import { useMemo } from 'react';
import {
    hasFeature,
    canAddMore,
    getRemainingQuota,
    getUpgradeMessage,
    getNextTierWithFeature,
    SUBSCRIPTION_TIERS,
} from '../config/subscriptionFeatures.js';

/**
 * Custom hook for subscription feature checking
 * @param {object} subscription - Current user's subscription object
 * @returns {object} - Feature checking utilities
 */
export function useSubscriptionFeatures(subscription) {
    const tier = useMemo(() => {
        if (!subscription || !subscription.planId) {
            return SUBSCRIPTION_TIERS.BASIC; // Default to basic if no subscription
        }
        return subscription.planId;
    }, [subscription]);

    const features = useMemo(() => {
        return {
            // Check if a feature is available
            has: (feature) => hasFeature(tier, feature),

            // Check if user can add more items
            canAdd: (limitType, currentCount) => canAddMore(tier, limitType, currentCount),

            // Get remaining quota
            remaining: (limitType, currentCount) => getRemainingQuota(tier, limitType, currentCount),

            // Get upgrade message
            upgradeMessage: (feature) => getUpgradeMessage(tier, feature),

            // Get next tier with feature
            nextTier: (feature) => getNextTierWithFeature(tier, feature),

            // Current tier
            currentTier: tier,

            // Tier checks
            isBasic: tier === SUBSCRIPTION_TIERS.BASIC,
            isProfessional: tier === SUBSCRIPTION_TIERS.PROFESSIONAL,
            isEnterprise: tier === SUBSCRIPTION_TIERS.ENTERPRISE,

            // Quick feature checks
            canCreateStorefront: (currentCount) => canAddMore(tier, 'maxStorefronts', currentCount),
            canAddProduct: (currentCount) => canAddMore(tier, 'maxProducts', currentCount),
            canAddService: (currentCount) => canAddMore(tier, 'maxServices', currentCount),

            // Feature availability
            hasCustomThemes: hasFeature(tier, 'customThemes'),
            hasAdvancedAnalytics: hasFeature(tier, 'advancedAnalytics'),
            hasApiAccess: hasFeature(tier, 'apiAccess'),
            hasWhiteLabel: hasFeature(tier, 'whiteLabel'),
            hasPrioritySupport: hasFeature(tier, 'prioritySupport'),
            hasMultiUser: hasFeature(tier, 'multiUserAccounts'),

            // Limits
            limits: {
                storefronts: hasFeature(tier, 'maxStorefronts'),
                products: hasFeature(tier, 'maxProducts'),
                services: hasFeature(tier, 'maxServices'),
                productImages: hasFeature(tier, 'maxProductImages'),
                serviceImages: hasFeature(tier, 'maxServiceImages'),
            },
        };
    }, [tier]);

    return features;
}

export default useSubscriptionFeatures;
