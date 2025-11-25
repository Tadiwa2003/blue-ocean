/**
 * Performance Monitoring Utilities
 * Track and optimize application performance
 */

/**
 * Measure component render time
 */
export function measureRenderTime(componentName, callback) {
    const startTime = performance.now();
    const result = callback();
    const endTime = performance.now();
    const duration = endTime - startTime;

    if (import.meta.env.DEV && duration > 16) {
        // Warn if render takes longer than one frame (16ms at 60fps)
        console.warn(`⚠️ Slow render: ${componentName} took ${duration.toFixed(2)}ms`);
    }

    return result;
}

/**
 * Debounce function for performance optimization
 */
export function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function for performance optimization
 */
export function throttle(func, limit = 100) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

/**
 * Lazy load images with Intersection Observer
 */
export function lazyLoadImage(img, options = {}) {
    const {
        rootMargin = '50px',
        threshold = 0.01,
        onLoad = () => { },
        onError = () => { },
    } = options;

    if (!('IntersectionObserver' in window)) {
        // Fallback for browsers without Intersection Observer
        img.src = img.dataset.src;
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const lazyImage = entry.target;
                lazyImage.src = lazyImage.dataset.src;

                lazyImage.addEventListener('load', () => {
                    lazyImage.classList.add('loaded');
                    onLoad();
                });

                lazyImage.addEventListener('error', onError);

                observer.unobserve(lazyImage);
            }
        });
    }, { rootMargin, threshold });

    observer.observe(img);

    return () => observer.disconnect();
}

/**
 * Measure page load performance
 */
export function measurePageLoad() {
    if (typeof window === 'undefined' || !window.performance) return null;

    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    const connectTime = perfData.responseEnd - perfData.requestStart;
    const renderTime = perfData.domComplete - perfData.domLoading;

    return {
        pageLoadTime,
        connectTime,
        renderTime,
        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.navigationStart,
        timeToFirstByte: perfData.responseStart - perfData.navigationStart,
    };
}

/**
 * Log performance metrics
 */
export function logPerformanceMetrics() {
    if (import.meta.env.DEV) {
        const metrics = measurePageLoad();
        if (metrics) {
            console.group('📊 Performance Metrics');
            console.log(`Page Load Time: ${metrics.pageLoadTime}ms`);
            console.log(`Connection Time: ${metrics.connectTime}ms`);
            console.log(`Render Time: ${metrics.renderTime}ms`);
            console.log(`DOM Content Loaded: ${metrics.domContentLoaded}ms`);
            console.log(`Time to First Byte: ${metrics.timeToFirstByte}ms`);
            console.groupEnd();
        }
    }
}

/**
 * Monitor bundle size
 */
export function getBundleSize() {
    if (typeof window === 'undefined') return null;

    const resources = performance.getEntriesByType('resource');
    const scripts = resources.filter(r => r.name.endsWith('.js'));
    const styles = resources.filter(r => r.name.endsWith('.css'));

    const totalScriptSize = scripts.reduce((sum, s) => sum + (s.transferSize || 0), 0);
    const totalStyleSize = styles.reduce((sum, s) => sum + (s.transferSize || 0), 0);

    return {
        scripts: {
            count: scripts.length,
            size: totalScriptSize,
            sizeKB: (totalScriptSize / 1024).toFixed(2),
        },
        styles: {
            count: styles.length,
            size: totalStyleSize,
            sizeKB: (totalStyleSize / 1024).toFixed(2),
        },
        total: {
            size: totalScriptSize + totalStyleSize,
            sizeKB: ((totalScriptSize + totalStyleSize) / 1024).toFixed(2),
        },
    };
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion() {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get connection speed
 */
export function getConnectionSpeed() {
    if (typeof navigator === 'undefined' || !navigator.connection) {
        return 'unknown';
    }

    const connection = navigator.connection;
    const effectiveType = connection.effectiveType; // '4g', '3g', '2g', 'slow-2g'

    return {
        effectiveType,
        downlink: connection.downlink, // Mbps
        rtt: connection.rtt, // Round trip time in ms
        saveData: connection.saveData, // User has data saver enabled
    };
}

/**
 * Optimize images based on connection speed
 */
export function getOptimalImageQuality() {
    const connection = getConnectionSpeed();

    if (connection === 'unknown') return 'high';

    if (connection.saveData) return 'low';

    switch (connection.effectiveType) {
        case '4g':
            return 'high';
        case '3g':
            return 'medium';
        case '2g':
        case 'slow-2g':
            return 'low';
        default:
            return 'medium';
    }
}

/**
 * Request Idle Callback wrapper with fallback
 */
export function requestIdleCallback(callback, options = {}) {
    if (typeof window === 'undefined') return;

    if ('requestIdleCallback' in window) {
        return window.requestIdleCallback(callback, options);
    }

    // Fallback for browsers without requestIdleCallback
    return setTimeout(() => {
        const start = Date.now();
        callback({
            didTimeout: false,
            timeRemaining: () => Math.max(0, 50 - (Date.now() - start)),
        });
    }, 1);
}

/**
 * Cancel Idle Callback wrapper
 */
export function cancelIdleCallback(id) {
    if (typeof window === 'undefined') return;

    if ('cancelIdleCallback' in window) {
        window.cancelIdleCallback(id);
    } else {
        clearTimeout(id);
    }
}

/**
 * Preload critical resources
 */
export function preloadResource(href, as = 'script') {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = as;
    link.href = href;
    document.head.appendChild(link);
}

/**
 * Monitor memory usage (if available)
 */
export function getMemoryUsage() {
    if (typeof performance === 'undefined' || !performance.memory) {
        return null;
    }

    const memory = performance.memory;
    return {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
        usedJSHeapSizeMB: (memory.usedJSHeapSize / 1048576).toFixed(2),
        totalJSHeapSizeMB: (memory.totalJSHeapSize / 1048576).toFixed(2),
    };
}

/**
 * Initialize performance monitoring
 */
export function initPerformanceMonitoring() {
    if (import.meta.env.DEV) {
        // Log metrics on page load
        window.addEventListener('load', () => {
            setTimeout(() => {
                logPerformanceMetrics();

                const bundleSize = getBundleSize();
                if (bundleSize) {
                    console.group('📦 Bundle Size');
                    console.log(`Scripts: ${bundleSize.scripts.sizeKB} KB (${bundleSize.scripts.count} files)`);
                    console.log(`Styles: ${bundleSize.styles.sizeKB} KB (${bundleSize.styles.count} files)`);
                    console.log(`Total: ${bundleSize.total.sizeKB} KB`);
                    console.groupEnd();
                }

                const memory = getMemoryUsage();
                if (memory) {
                    console.log(`💾 Memory Usage: ${memory.usedJSHeapSizeMB} MB / ${memory.totalJSHeapSizeMB} MB`);
                }

                const connection = getConnectionSpeed();
                if (connection !== 'unknown') {
                    console.log(`🌐 Connection: ${connection.effectiveType} (${connection.downlink} Mbps, ${connection.rtt}ms RTT)`);
                }
            }, 1000);
        });
    }
}

// Auto-initialize in development
if (import.meta.env.DEV && typeof window !== 'undefined') {
    initPerformanceMonitoring();
}
