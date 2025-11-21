// Conversational Onboarding Component
// AI-powered chat-style storefront creation

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Store, Loader2, CheckCircle2 } from 'lucide-react';
import aiAPI from '../api/ai';
import api from '../api';

const ONBOARDING_STEPS = [
    {
        id: 'welcome',
        question: "Hi! I'm your AI assistant. Let's create your perfect storefront! What would you like to name your store?",
        field: 'name',
        placeholder: 'e.g., Anaya Finds, Tech Haven, Beauty Bliss',
    },
    {
        id: 'niche',
        question: "Great! What type of products will you be selling?",
        field: 'niche',
        options: ['Fashion', 'Electronics', 'Beauty', 'Home & Garden', 'Sports', 'Jewelry', 'Art', 'Food & Beverage', 'Other'],
        placeholder: 'Select or type your niche',
    },
    {
        id: 'vibe',
        question: "Perfect! What vibe or style do you want for your store?",
        field: 'vibe',
        options: ['Minimalist', 'Bold', 'Elegant', 'Playful', 'Professional', 'Luxury'],
        placeholder: 'Choose the style that fits your brand',
    },
    {
        id: 'audience',
        question: "Who is your target audience?",
        field: 'audience',
        placeholder: 'e.g., Young professionals, Parents, Tech enthusiasts',
    },
    {
        id: 'confirm',
        question: "Awesome! Let me create your storefront with AI magic! ✨",
        field: 'confirm',
    },
];

export function ConversationalOnboarding({ onComplete, onClose }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [messages, setMessages] = useState([
        {
            id: 'welcome',
            type: 'ai',
            content: ONBOARDING_STEPS[0].question,
            timestamp: new Date(),
        },
    ]);
    const [userInput, setUserInput] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        niche: '',
        vibe: '',
        audience: '',
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        inputRef.current?.focus();
    }, [currentStep]);

    const handleOptionClick = (option) => {
        handleSubmit(null, option);
    };

    const handleSubmit = async (e, optionValue = null) => {
        if (e) e.preventDefault();

        const value = optionValue || userInput.trim();
        if (!value && currentStep < ONBOARDING_STEPS.length - 1) return;

        const step = ONBOARDING_STEPS[currentStep];

        // Add user message
        const userMessage = {
            id: `user-${Date.now()}`,
            type: 'user',
            content: value,
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMessage]);

        // Update form data
        const newFormData = { ...formData, [step.field]: value };
        setFormData(newFormData);
        setUserInput('');

        // Move to next step or generate storefront
        if (currentStep < ONBOARDING_STEPS.length - 1) {
            setTimeout(() => {
                const nextStep = ONBOARDING_STEPS[currentStep + 1];
                const aiMessage = {
                    id: `ai-${Date.now()}`,
                    type: 'ai',
                    content: nextStep.question,
                    timestamp: new Date(),
                };
                setMessages((prev) => [...prev, aiMessage]);
                setCurrentStep(currentStep + 1);
            }, 500);
        } else {
            // Generate storefront with AI
            await generateStorefront(newFormData);
        }
    };

    const generateStorefront = async (data) => {
        setIsGenerating(true);

        try {
            // Add "generating" message
            setMessages((prev) => [
                ...prev,
                {
                    id: `ai-generating`,
                    type: 'ai',
                    content: '🎨 Creating your storefront with AI...',
                    timestamp: new Date(),
                    isGenerating: true,
                },
            ]);

            // Call AI onboarding endpoint
            const result = await aiAPI.completeAIOnboarding(data);
            const { storefrontConfig, copy, palette } = result.data;

            // Create the storefront
            const storefrontResponse = await api.storefronts.create(storefrontConfig);

            if (storefrontResponse.success) {
                setIsComplete(true);

                // Success message
                setMessages((prev) => [
                    ...prev.filter((m) => !m.isGenerating),
                    {
                        id: `ai-success`,
                        type: 'ai',
                        content: `🎉 Your storefront "${data.name}" is ready! I've created a beautiful ${data.vibe.toLowerCase()} design with professional copy and a stunning color palette.`,
                        timestamp: new Date(),
                    },
                ]);

                // Call onComplete after a delay
                setTimeout(() => {
                    onComplete(storefrontResponse.data.storefront);
                }, 2000);
            }
        } catch (error) {
            console.error('Error generating storefront:', error);
            setMessages((prev) => [
                ...prev.filter((m) => !m.isGenerating),
                {
                    id: `ai-error`,
                    type: 'ai',
                    content: `❌ Oops! Something went wrong. ${error.message}. Let's try again!`,
                    timestamp: new Date(),
                },
            ]);
            setCurrentStep(0);
            setFormData({ name: '', niche: '', vibe: '', audience: '' });
        } finally {
            setIsGenerating(false);
        }
    };

    const currentStepData = ONBOARDING_STEPS[currentStep];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-2xl h-[600px] bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl shadow-2xl border border-white/10 flex flex-col overflow-hidden"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-r from-brand-500/20 to-purple-500/20">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-brand-500 to-purple-500">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">AI Storefront Builder</h2>
                            <p className="text-sm text-white/60">Let's create something amazing together</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white"
                    >
                        ✕
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="px-6 pt-4">
                    <div className="flex items-center gap-2">
                        {ONBOARDING_STEPS.map((step, index) => (
                            <div
                                key={step.id}
                                className={`flex-1 h-1 rounded-full transition-all duration-300 ${index <= currentStep
                                        ? 'bg-gradient-to-r from-brand-500 to-purple-500'
                                        : 'bg-white/10'
                                    }`}
                            />
                        ))}
                    </div>
                    <p className="text-xs text-white/50 mt-2">
                        Step {currentStep + 1} of {ONBOARDING_STEPS.length}
                    </p>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    <AnimatePresence>
                        {messages.map((message) => (
                            <motion.div
                                key={message.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${message.type === 'user'
                                            ? 'bg-gradient-to-r from-brand-500 to-purple-500 text-white'
                                            : 'bg-white/10 text-white border border-white/10'
                                        }`}
                                >
                                    {message.isGenerating && (
                                        <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                                    )}
                                    <p className="text-sm leading-relaxed">{message.content}</p>
                                    <p className="text-xs opacity-60 mt-1">
                                        {message.timestamp.toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    <div ref={messagesEndRef} />
                </div>

                {/* Options (if available) */}
                {currentStepData.options && !isGenerating && !isComplete && (
                    <div className="px-6 pb-4">
                        <div className="flex flex-wrap gap-2">
                            {currentStepData.options.map((option) => (
                                <button
                                    key={option}
                                    onClick={() => handleOptionClick(option)}
                                    className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-medium transition-all hover:scale-105"
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Input */}
                {!isGenerating && !isComplete && currentStep < ONBOARDING_STEPS.length - 1 && (
                    <form onSubmit={handleSubmit} className="p-6 border-t border-white/10 bg-white/5">
                        <div className="flex gap-3">
                            <input
                                ref={inputRef}
                                type="text"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                placeholder={currentStepData.placeholder}
                                className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                            />
                            <button
                                type="submit"
                                disabled={!userInput.trim()}
                                className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-purple-500 text-white font-medium hover:shadow-lg hover:shadow-brand-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                <Send className="w-4 h-4" />
                                Send
                            </button>
                        </div>
                    </form>
                )}

                {/* Complete State */}
                {isComplete && (
                    <div className="p-6 border-t border-white/10 bg-gradient-to-r from-emerald-500/20 to-brand-500/20">
                        <div className="flex items-center justify-center gap-3 text-white">
                            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                            <p className="font-medium">Storefront created successfully!</p>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
}

export default ConversationalOnboarding;
