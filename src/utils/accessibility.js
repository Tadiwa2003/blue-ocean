/**
 * Accessibility Utilities
 * Helpers for improving accessibility throughout the application
 */

/**
 * Generate unique IDs for form elements and ARIA labels
 */
let idCounter = 0;
export function generateId(prefix = 'id') {
    idCounter += 1;
    return `${prefix}-${idCounter}-${Date.now()}`;
}

/**
 * Announce message to screen readers
 */
export function announceToScreenReader(message, priority = 'polite') {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    // Remove after announcement
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

/**
 * Trap focus within a modal or dialog
 */
export function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    function handleTabKey(e) {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
            if (document.activeElement === firstFocusable) {
                e.preventDefault();
                lastFocusable.focus();
            }
        } else {
            if (document.activeElement === lastFocusable) {
                e.preventDefault();
                firstFocusable.focus();
            }
        }
    }

    element.addEventListener('keydown', handleTabKey);

    // Focus first element
    firstFocusable?.focus();

    // Return cleanup function
    return () => {
        element.removeEventListener('keydown', handleTabKey);
    };
}

/**
 * Check if element is visible to screen readers
 */
export function isAccessible(element) {
    if (!element) return false;

    const style = window.getComputedStyle(element);
    return (
        style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        style.opacity !== '0' &&
        element.getAttribute('aria-hidden') !== 'true'
    );
}

/**
 * Get accessible name for an element
 */
export function getAccessibleName(element) {
    // Check aria-label
    if (element.hasAttribute('aria-label')) {
        return element.getAttribute('aria-label');
    }

    // Check aria-labelledby
    if (element.hasAttribute('aria-labelledby')) {
        const labelId = element.getAttribute('aria-labelledby');
        const labelElement = document.getElementById(labelId);
        return labelElement?.textContent || '';
    }

    // Check associated label
    if (element.id) {
        const label = document.querySelector(`label[for="${element.id}"]`);
        if (label) return label.textContent;
    }

    // Check placeholder
    if (element.hasAttribute('placeholder')) {
        return element.getAttribute('placeholder');
    }

    // Check title
    if (element.hasAttribute('title')) {
        return element.getAttribute('title');
    }

    return element.textContent || '';
}

/**
 * Keyboard navigation helper
 */
export function handleArrowNavigation(event, items, currentIndex, onSelect) {
    const { key } = event;
    let newIndex = currentIndex;

    switch (key) {
        case 'ArrowDown':
        case 'ArrowRight':
            event.preventDefault();
            newIndex = (currentIndex + 1) % items.length;
            break;
        case 'ArrowUp':
        case 'ArrowLeft':
            event.preventDefault();
            newIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
            break;
        case 'Home':
            event.preventDefault();
            newIndex = 0;
            break;
        case 'End':
            event.preventDefault();
            newIndex = items.length - 1;
            break;
        case 'Enter':
        case ' ':
            event.preventDefault();
            onSelect?.(items[currentIndex]);
            return currentIndex;
        default:
            return currentIndex;
    }

    // Focus the new item
    items[newIndex]?.focus();
    return newIndex;
}

/**
 * Create skip link for keyboard navigation
 */
export function createSkipLink(targetId, text = 'Skip to main content') {
    const skipLink = document.createElement('a');
    skipLink.href = `#${targetId}`;
    skipLink.textContent = text;
    skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-brand-500 focus:text-white focus:rounded-lg';

    document.body.insertBefore(skipLink, document.body.firstChild);

    return skipLink;
}

/**
 * Check color contrast ratio (WCAG AA requires 4.5:1 for normal text)
 */
export function getContrastRatio(color1, color2) {
    const getLuminance = (color) => {
        // Convert hex to RGB
        const hex = color.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16) / 255;
        const g = parseInt(hex.substr(2, 2), 16) / 255;
        const b = parseInt(hex.substr(4, 2), 16) / 255;

        // Calculate relative luminance
        const [rs, gs, bs] = [r, g, b].map(c => {
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });

        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };

    const l1 = getLuminance(color1);
    const l2 = getLuminance(color2);

    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);

    return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast meets WCAG standards
 */
export function meetsWCAGContrast(foreground, background, level = 'AA', size = 'normal') {
    const ratio = getContrastRatio(foreground, background);

    if (level === 'AAA') {
        return size === 'large' ? ratio >= 4.5 : ratio >= 7;
    }

    // AA level
    return size === 'large' ? ratio >= 3 : ratio >= 4.5;
}

/**
 * Add screen reader only class to global styles
 */
export function addScreenReaderStyles() {
    const style = document.createElement('style');
    style.textContent = `
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border-width: 0;
    }
    
    .sr-only-focusable:focus,
    .sr-only-focusable:active {
      position: static;
      width: auto;
      height: auto;
      overflow: visible;
      clip: auto;
      white-space: normal;
    }
  `;
    document.head.appendChild(style);
}

// Initialize screen reader styles
if (typeof document !== 'undefined') {
    addScreenReaderStyles();
}
