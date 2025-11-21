// WYSIWYG Storefront Editor
// Drag-and-drop visual editor for storefront customization

import { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { GripVertical, Eye, Code, Palette, Type, Image as ImageIcon, Save, Undo, Redo } from 'lucide-react';

// Sortable Section Component
function SortableSection({ section, onEdit }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: section.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const getSectionIcon = (type) => {
        switch (type) {
            case 'hero':
                return <ImageIcon className="w-5 h-5" />;
            case 'products':
                return <span className="text-lg">🛍️</span>;
            case 'about':
                return <Type className="w-5 h-5" />;
            case 'contact':
                return <span className="text-lg">📧</span>;
            default:
                return <span className="text-lg">📄</span>;
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="group relative bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 hover:border-brand-500/50 transition-all"
        >
            {/* Drag Handle */}
            <div
                {...attributes}
                {...listeners}
                className="absolute left-2 top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <GripVertical className="w-5 h-5 text-white/40" />
            </div>

            {/* Section Content */}
            <div className="ml-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-brand-500/20 text-brand-300">
                        {getSectionIcon(section.type)}
                    </div>
                    <div>
                        <h4 className="text-white font-medium">{section.title}</h4>
                        <p className="text-xs text-white/50">{section.description}</p>
                    </div>
                </div>

                {/* Edit Button */}
                <button
                    onClick={() => onEdit(section)}
                    className="px-3 py-1.5 rounded-lg bg-brand-500/20 text-brand-300 hover:bg-brand-500/30 text-sm font-medium transition-all opacity-0 group-hover:opacity-100"
                >
                    Edit
                </button>
            </div>
        </div>
    );
}

// Main WYSIWYG Editor Component
export function WYSIWYGEditor({ storefront, onSave, onClose }) {
    const [sections, setSections] = useState([
        { id: '1', type: 'hero', title: 'Hero Section', description: 'Main banner with title and CTA' },
        { id: '2', type: 'products', title: 'Products Grid', description: 'Display your products' },
        { id: '3', type: 'about', title: 'About Us', description: 'Tell your story' },
        { id: '4', type: 'contact', title: 'Contact', description: 'Get in touch section' },
    ]);

    const [viewMode, setViewMode] = useState('preview'); // 'preview' or 'code'
    const [editingSection, setEditingSection] = useState(null);
    const [history, setHistory] = useState([sections]);
    const [historyIndex, setHistoryIndex] = useState(0);
    const [hasChanges, setHasChanges] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setSections((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                const newSections = arrayMove(items, oldIndex, newIndex);

                // Add to history
                addToHistory(newSections);
                setHasChanges(true);

                return newSections;
            });
        }
    };

    const addToHistory = (newSections) => {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newSections);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    };

    const undo = () => {
        if (historyIndex > 0) {
            setHistoryIndex(historyIndex - 1);
            setSections(history[historyIndex - 1]);
            setHasChanges(true);
        }
    };

    const redo = () => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex(historyIndex + 1);
            setSections(history[historyIndex + 1]);
            setHasChanges(true);
        }
    };

    const handleSave = async () => {
        try {
            // Save the new section order
            await onSave({ sections });
            setHasChanges(false);
        } catch (error) {
            console.error('Error saving:', error);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-slate-800 border-b border-white/10">
                <div className="flex items-center gap-4">
                    <h2 className="text-xl font-bold text-white">Storefront Editor</h2>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={undo}
                            disabled={historyIndex === 0}
                            className="p-2 rounded-lg bg-white/10 text-white/60 hover:bg-white/20 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            title="Undo"
                        >
                            <Undo className="w-4 h-4" />
                        </button>
                        <button
                            onClick={redo}
                            disabled={historyIndex === history.length - 1}
                            className="p-2 rounded-lg bg-white/10 text-white/60 hover:bg-white/20 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            title="Redo"
                        >
                            <Redo className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* View Mode Toggle */}
                    <div className="flex items-center gap-1 bg-white/10 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('preview')}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'preview'
                                    ? 'bg-brand-500 text-white'
                                    : 'text-white/60 hover:text-white'
                                }`}
                        >
                            <Eye className="w-4 h-4" />
                            Preview
                        </button>
                        <button
                            onClick={() => setViewMode('code')}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'code'
                                    ? 'bg-brand-500 text-white'
                                    : 'text-white/60 hover:text-white'
                                }`}
                        >
                            <Code className="w-4 h-4" />
                            Code
                        </button>
                    </div>

                    {/* Save Button */}
                    <button
                        onClick={handleSave}
                        disabled={!hasChanges}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-500 text-white font-medium hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <Save className="w-4 h-4" />
                        Save Changes
                    </button>

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all"
                    >
                        Close
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Panel - Section List */}
                <div className="w-80 bg-slate-800 border-r border-white/10 overflow-y-auto p-4">
                    <div className="mb-4">
                        <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-2">
                            Sections
                        </h3>
                        <p className="text-xs text-white/40">
                            Drag to reorder sections
                        </p>
                    </div>

                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={sections}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="space-y-2">
                                {sections.map((section) => (
                                    <SortableSection
                                        key={section.id}
                                        section={section}
                                        onEdit={setEditingSection}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>

                    {/* Theme Controls */}
                    <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
                        <div className="flex items-center gap-2 mb-3">
                            <Palette className="w-4 h-4 text-brand-300" />
                            <h4 className="text-sm font-semibold text-white">Theme</h4>
                        </div>
                        <div className="space-y-2">
                            <div>
                                <label className="text-xs text-white/60 block mb-1">Primary Color</label>
                                <input
                                    type="color"
                                    defaultValue="#1da0e6"
                                    className="w-full h-8 rounded cursor-pointer"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-white/60 block mb-1">Secondary Color</label>
                                <input
                                    type="color"
                                    defaultValue="#0b233e"
                                    className="w-full h-8 rounded cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Preview */}
                <div className="flex-1 bg-gradient-to-br from-slate-900 to-slate-800 overflow-auto p-8">
                    {viewMode === 'preview' ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden"
                        >
                            {/* Preview Content */}
                            {sections.map((section) => (
                                <div
                                    key={section.id}
                                    className="p-8 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors cursor-pointer"
                                    onClick={() => setEditingSection(section)}
                                >
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                        {section.title}
                                    </h3>
                                    <p className="text-gray-600">{section.description}</p>
                                    <div className="mt-4 text-sm text-gray-400">
                                        Click to edit this section
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="max-w-6xl mx-auto"
                        >
                            <pre className="bg-slate-800 text-green-400 p-6 rounded-xl overflow-auto text-sm font-mono border border-white/10">
                                {JSON.stringify({ sections }, null, 2)}
                            </pre>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Status Bar */}
            <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-t border-white/10 text-xs text-white/50">
                <div>
                    {hasChanges ? '● Unsaved changes' : '✓ All changes saved'}
                </div>
                <div>
                    {sections.length} sections • {viewMode} mode
                </div>
            </div>
        </div>
    );
}

export default WYSIWYGEditor;
