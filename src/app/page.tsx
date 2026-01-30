'use client';

import Canvas from "@/components/Canvas/Canvas";
import CommandBar from "@/components/Toolbar/CommandBar";
import { Mic, Send } from "lucide-react";


export default function Home() {
  return (
    <main className="h-screen w-screen p-4 flex gap-4 overflow-hidden relative z-10">
      {/* Sidebar - Node Library */}
      <aside className="w-80 h-full flex flex-col gap-4 hidden lg:flex">
        <div className="flex-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col shadow-video">
          <h2 className="font-serif text-2xl font-bold text-white mb-4">Library</h2>
          <p className="text-sm text-gray-400 mb-6">Drag nodes to the canvas</p>

          <div className="space-y-3">
            <div
              className="p-3 bg-black/20 border border-white/10 rounded-lg cursor-grab hover:bg-white/5 transition-colors"
              onDragStart={(event) => event.dataTransfer.setData('application/reactflow', 'trigger')}
              draggable
            >
              <span className="font-medium text-teal-accent">Trigger</span>
              <p className="text-xs text-gray-400">Starts the flow</p>
            </div>
            <div
              className="p-3 bg-black/20 border border-white/10 rounded-lg cursor-grab hover:bg-white/5 transition-colors"
              onDragStart={(event) => event.dataTransfer.setData('application/reactflow', 'action')}
              draggable
            >
              <span className="font-medium text-white">Action</span>
              <p className="text-xs text-gray-400">Performs a task</p>
            </div>
            <div
              className="p-3 bg-black/20 border border-white/10 rounded-lg cursor-grab hover:bg-white/5 transition-colors"
              onDragStart={(event) => event.dataTransfer.setData('application/reactflow', 'condition')}
              draggable
            >
              <span className="font-medium text-white">Condition</span>
              <p className="text-xs text-gray-400">Splits the path</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Canvas Area */}
      <section className="flex-1 h-full relative flex flex-col min-w-0">
        <Canvas />

        {/* Floating Command Toolbar */}
        <CommandBar />
      </section>
    </main>
  );
}
