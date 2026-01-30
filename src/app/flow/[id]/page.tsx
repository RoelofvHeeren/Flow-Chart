'use client';

import React, { useEffect } from 'react'; // Added useEffect
import Canvas from "@/components/Canvas/Canvas";
import CommandBar from "@/components/Toolbar/CommandBar";
import { Mic, Send, Square, Circle, Type, Layout, Play, Activity, Split, StickyNote, Hexagon, Component, ArrowLeft } from "lucide-react";
import Link from 'next/link';
import { useParams } from 'next/navigation'; // Import useParams
import { useStore } from '@/lib/store'; // Import store to set flow ID

export default function FlowPage() {
    const params = useParams();
    const flowId = params.id as string;
    const { setFlowId } = useStore(); // We need to add setFlowId to store

    useEffect(() => {
        if (flowId) {
            setFlowId(flowId);
        }
    }, [flowId, setFlowId]);

    const onDragStart = (event: React.DragEvent, type: string, shape?: string) => {
        event.dataTransfer.setData('application/reactflow', type);
        event.dataTransfer.effectAllowed = 'move';
        // ... existing drag logic ...
    };

    return (
        <main className="h-screen w-screen p-4 flex gap-4 overflow-hidden relative z-10">
            {/* Sidebar - Node Library */}
            <aside className="w-80 h-full flex flex-col gap-4 flex shrink-0">
                <div className="flex-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col shadow-video overflow-y-auto">
                    <div className="flex items-center gap-4 mb-6">
                        <Link href="/" className="p-2 -ml-2 hover:bg-white/10 rounded-lg transition-colors">
                            <ArrowLeft className="w-5 h-5 text-white" />
                        </Link>
                        <h2 className="font-serif text-2xl font-bold text-white">Editor</h2>
                    </div>

                    {/* Visual Primitives */}
                    <div className="mb-8">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Visual Primitives</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <div
                                className="p-3 bg-black/20 border border-white/10 rounded-lg cursor-grab hover:bg-white/5 transition-colors flex flex-col items-center gap-2"
                                onDragStart={(e) => { e.dataTransfer.setData('application/reactflow', JSON.stringify({ type: 'shape', data: { shape: 'rectangle' } })); }}
                                draggable
                            >
                                <Square className="w-6 h-6 text-white" />
                                <span className="text-xs text-gray-400">Box</span>
                            </div>

                            <div
                                className="p-3 bg-black/20 border border-white/10 rounded-lg cursor-grab hover:bg-white/5 transition-colors flex flex-col items-center gap-2"
                                onDragStart={(e) => { e.dataTransfer.setData('application/reactflow', JSON.stringify({ type: 'shape', data: { shape: 'circle' } })); }}
                                draggable
                            >
                                <Circle className="w-6 h-6 text-white" />
                                <span className="text-xs text-gray-400">Circle</span>
                            </div>

                            <div
                                className="p-3 bg-black/20 border border-white/10 rounded-lg cursor-grab hover:bg-white/5 transition-colors flex flex-col items-center gap-2"
                                onDragStart={(e) => { e.dataTransfer.setData('application/reactflow', 'text'); }}
                                draggable
                            >
                                <Type className="w-6 h-6 text-white" />
                                <span className="text-xs text-gray-400">Text</span>
                            </div>

                            <div
                                className="p-3 bg-black/20 border border-white/10 rounded-lg cursor-grab hover:bg-white/5 transition-colors flex flex-col items-center gap-2"
                                onDragStart={(e) => { e.dataTransfer.setData('application/reactflow', 'note'); }}
                                draggable
                            >
                                <StickyNote className="w-6 h-6 text-yellow-200" />
                                <span className="text-xs text-gray-400">Sticky</span>
                            </div>
                        </div>
                    </div>

                    {/* Semantic Elements */}
                    <div>
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Semantic Flow</h3>
                        <div className="space-y-3">
                            <div
                                className="p-3 bg-teal-accent/10 border border-teal-accent/20 rounded-lg cursor-grab hover:bg-teal-accent/20 transition-colors flex items-center gap-3"
                                onDragStart={(e) => e.dataTransfer.setData('application/reactflow', 'trigger')}
                                draggable
                            >
                                <Play className="w-5 h-5 text-teal-accent" />
                                <div>
                                    <span className="font-medium text-teal-accent block">Trigger</span>
                                    <p className="text-[10px] text-gray-400">Starts the flow</p>
                                </div>
                            </div>

                            <div
                                className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg cursor-grab hover:bg-blue-500/20 transition-colors flex items-center gap-3"
                                onDragStart={(e) => e.dataTransfer.setData('application/reactflow', 'action')}
                                draggable
                            >
                                <Activity className="w-5 h-5 text-blue-400" />
                                <div>
                                    <span className="font-medium text-blue-400 block">Action</span>
                                    <p className="text-[10px] text-gray-400">Performs a task</p>
                                </div>
                            </div>

                            <div
                                className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg cursor-grab hover:bg-yellow-500/20 transition-colors flex items-center gap-3"
                                onDragStart={(e) => e.dataTransfer.setData('application/reactflow', 'condition')}
                                draggable
                            >
                                <Split className="w-5 h-5 text-yellow-400" />
                                <div>
                                    <span className="font-medium text-yellow-400 block">Condition</span>
                                    <p className="text-[10px] text-gray-400">Logic check</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </aside>

            {/* Main Canvas Area */}
            <section className="flex-1 h-full relative flex flex-col min-w-0">
                <Canvas />
                <CommandBar />
            </section>
        </main>
    );
}
