import { Component } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from './Button.jsx';

/**
 * Global Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree
 */
export class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
            errorCount: 0,
        };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log error to console in development
        if (import.meta.env.DEV) {
            console.error('ErrorBoundary caught an error:', error, errorInfo);
        }

        // Update state with error details
        this.setState(prevState => ({
            error,
            errorInfo,
            errorCount: prevState.errorCount + 1,
        }));

        // Log to error reporting service in production
        if (import.meta.env.PROD) {
            this.logErrorToService(error, errorInfo);
        }
    }

    logErrorToService = (error, errorInfo) => {
        // TODO: Integrate with error tracking service (e.g., Sentry, LogRocket)
        try {
            const errorData = {
                message: error.toString(),
                stack: error.stack,
                componentStack: errorInfo.componentStack,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                url: window.location.href,
            };

            // Send to your error logging endpoint
            // fetch('/api/log-error', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify(errorData),
            // });

            console.log('Error logged:', errorData);
        } catch (loggingError) {
            console.error('Failed to log error:', loggingError);
        }
    };

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    handleGoHome = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            // Custom error UI
            return (
                <div className="min-h-screen bg-gradient-to-br from-midnight via-ocean to-midnight flex items-center justify-center p-6">
                    <div className="max-w-2xl w-full">
                        {/* Error Card */}
                        <div className="rounded-3xl border border-red-500/30 bg-gradient-to-br from-red-500/10 via-red-500/5 to-transparent backdrop-blur-xl p-8 shadow-2xl">
                            {/* Icon */}
                            <div className="flex justify-center mb-6">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-red-500/30 blur-2xl rounded-full" />
                                    <div className="relative bg-red-500/20 rounded-full p-6 border border-red-500/40">
                                        <AlertTriangle className="w-16 h-16 text-red-400" />
                                    </div>
                                </div>
                            </div>

                            {/* Title */}
                            <h1 className="text-3xl font-display font-bold text-white text-center mb-4">
                                Oops! Something went wrong
                            </h1>

                            {/* Description */}
                            <p className="text-white/70 text-center mb-6 leading-relaxed">
                                We encountered an unexpected error. Don't worry, your data is safe.
                                You can try refreshing the page or return to the home page.
                            </p>

                            {/* Error Details (Development Only) */}
                            {import.meta.env.DEV && this.state.error && (
                                <div className="mb-6 rounded-xl bg-black/40 border border-white/10 p-4 overflow-auto max-h-64">
                                    <p className="text-xs font-mono text-red-300 mb-2 font-semibold">
                                        Error Details (Development Mode):
                                    </p>
                                    <p className="text-xs font-mono text-white/80 mb-3">
                                        {this.state.error.toString()}
                                    </p>
                                    {this.state.errorInfo && (
                                        <details className="text-xs font-mono text-white/60">
                                            <summary className="cursor-pointer hover:text-white/80 mb-2">
                                                Component Stack
                                            </summary>
                                            <pre className="whitespace-pre-wrap text-[10px] leading-relaxed">
                                                {this.state.errorInfo.componentStack}
                                            </pre>
                                        </details>
                                    )}
                                </div>
                            )}

                            {/* Error Count Warning */}
                            {this.state.errorCount > 2 && (
                                <div className="mb-6 rounded-xl bg-amber-500/10 border border-amber-500/30 p-4">
                                    <p className="text-sm text-amber-200 text-center">
                                        ⚠️ Multiple errors detected. Consider clearing your browser cache or contacting support.
                                    </p>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Button
                                    onClick={this.handleReset}
                                    className="flex-1 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-semibold py-3"
                                >
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Try Again
                                </Button>
                                <Button
                                    onClick={this.handleGoHome}
                                    variant="ghost"
                                    className="flex-1 border border-white/20 hover:bg-white/10 text-white font-semibold py-3"
                                >
                                    <Home className="w-4 h-4 mr-2" />
                                    Go Home
                                </Button>
                            </div>

                            {/* Support Link */}
                            <div className="mt-6 text-center">
                                <p className="text-xs text-white/50">
                                    Need help?{' '}
                                    <a
                                        href="mailto:support@brightpath.com"
                                        className="text-brand-400 hover:text-brand-300 underline"
                                    >
                                        Contact Support
                                    </a>
                                </p>
                            </div>
                        </div>

                        {/* BrightPath Branding */}
                        <div className="mt-6 text-center">
                            <p className="text-sm text-white/40">
                                BrightPath Marketplace
                            </p>
                        </div>
                    </div>
                </div>
            );
        }

        // Render children normally when there's no error
        return this.props.children;
    }
}

/**
 * Higher-order component to wrap components with error boundary
 */
export function withErrorBoundary(Component, fallback) {
    return function WithErrorBoundaryComponent(props) {
        return (
            <ErrorBoundary fallback={fallback}>
                <Component {...props} />
            </ErrorBoundary>
        );
    };
}
