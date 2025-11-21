// Mobile Preview Component
// Responsive device preview with Desktop/Tablet/Mobile views

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Monitor, Tablet, Smartphone, RotateCw } from 'lucide-react';

const DEVICES = {
    desktop: {
        name: 'Desktop',
        icon: Monitor,
        width: '100%',
        height: '100%',
        scale: 1,
    },
    tablet: {
        name: 'Tablet',
        icon: Tablet,
        width: '768px',
        height: '1024px',
        scale: 0.8,
    },
    mobile: {
        name: 'Mobile',
        icon: Smartphone,
        width: '375px',
        height: '667px',
        scale: 0.9,
    },
};

export function MobilePreview({ children, className = '' }) {
    const [activeDevice, setActiveDevice] = useState('desktop');
    const [isPortrait, setIsPortrait] = useState(true);

    const device = DEVICES[activeDevice];
    const DeviceIcon = device.icon;

    const getDeviceDimensions = () => {
        if (activeDevice === 'desktop') {
            return { width: '100%', height: '100%' };
        }

        const width = isPortrait ? device.width : device.height;
        const height = isPortrait ? device.height : device.width;

        return { width, height };
    };

    const dimensions = getDeviceDimensions();

    return (
        <div className={`flex flex-col h-full ${className}`}>
            {/* Device Selector */}
            <div className="flex items-center justify-between p-4 bg-white/5 border-b border-white/10">
                <div className="flex items-center gap-2">
                    {Object.entries(DEVICES).map(([key, deviceInfo]) => {
                        const Icon = deviceInfo.icon;
                        return (
                            <button
                                key={key}
                                onClick={() => setActiveDevice(key)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${activeDevice === key
                                        ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30'
                                        : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span className="text-sm font-medium hidden sm:inline">
                                    {deviceInfo.name}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Rotation Toggle (only for tablet/mobile) */}
                {activeDevice !== 'desktop' && (
                    <button
                        onClick={() => setIsPortrait(!isPortrait)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white/60 hover:bg-white/20 hover:text-white transition-all"
                        title={isPortrait ? 'Switch to Landscape' : 'Switch to Portrait'}
                    >
                        <RotateCw className="w-4 h-4" />
                        <span className="text-sm font-medium hidden sm:inline">
                            {isPortrait ? 'Portrait' : 'Landscape'}
                        </span>
                    </button>
                )}

                {/* Dimensions Display */}
                <div className="text-xs text-white/50 hidden md:block">
                    {activeDevice === 'desktop' ? (
                        'Responsive'
                    ) : (
                        `${dimensions.width} × ${dimensions.height}`
                    )}
                </div>
            </div>

            {/* Preview Area */}
            <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-slate-900 to-slate-800 overflow-auto">
                <motion.div
                    key={`${activeDevice}-${isPortrait}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: device.scale }}
                    transition={{ duration: 0.3 }}
                    className="relative bg-white rounded-2xl shadow-2xl overflow-hidden"
                    style={{
                        width: dimensions.width,
                        height: dimensions.height,
                        maxWidth: '100%',
                        maxHeight: '100%',
                    }}
                >
                    {/* Device Frame (for mobile/tablet) */}
                    {activeDevice !== 'desktop' && (
                        <>
                            {/* Top Notch/Camera (Mobile) */}
                            {activeDevice === 'mobile' && isPortrait && (
                                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-50" />
                            )}

                            {/* Device Border */}
                            <div className="absolute inset-0 border-8 border-gray-900 rounded-2xl pointer-events-none z-40" />
                        </>
                    )}

                    {/* Content */}
                    <div className="w-full h-full overflow-auto">
                        {children}
                    </div>
                </motion.div>
            </div>

            {/* Info Bar */}
            <div className="flex items-center justify-between p-3 bg-white/5 border-t border-white/10 text-xs text-white/50">
                <div className="flex items-center gap-4">
                    <span>
                        <DeviceIcon className="w-3 h-3 inline mr-1" />
                        {device.name}
                    </span>
                    {activeDevice !== 'desktop' && (
                        <span>{isPortrait ? '📱 Portrait' : '🔄 Landscape'}</span>
                    )}
                </div>
                <div>
                    Preview Mode • Changes are not saved
                </div>
            </div>
        </div>
    );
}

export default MobilePreview;
