'use client';

import React, { useCallback, useRef, useState } from 'react';
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useStore } from '@/lib/store';
import { useShallow } from 'zustand/react/shallow';
import { useSocket } from '@/hooks/useSocket';
import { nodeTypes } from '@/lib/nodeTypes';

const selector = (state: any) => ({
    nodes: state.nodes,
    edges: state.edges,
    onNodesChange: state.onNodesChange,
    onEdgesChange: state.onEdgesChange,
    onConnect: state.onConnect,
    addNode: state.addNode,
});

function CanvasContent() {
    const { nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode } = useStore(useShallow(selector));
    useSocket(); // Initialize socket listeners

    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();

            const type = event.dataTransfer.getData('application/reactflow');

            // check if the dropped element is valid
            if (typeof type === 'undefined' || !type) {
                return;
            }

            const position = reactFlowInstance.screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });
            const newNode = {
                id: `${type}-${Date.now()}`,
                type,
                position,
                data: { label: `${type} node` },
            };

            addNode(newNode);
        },
        [reactFlowInstance, addNode],
    );

    return (
        <div ref={reactFlowWrapper} className="w-full h-full bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden shadow-glass">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                onInit={setReactFlowInstance}
                onDrop={onDrop}
                onDragOver={onDragOver}
                fitView
                proOptions={{ hideAttribution: true }}
            >
                <Background className="bg-transparent" color="#139187" gap={20} size={1} />
                <Controls className="!bg-white/5 !border !border-white/10 !text-white !fill-white" />
                <MiniMap
                    className="!bg-black/50 !border !border-white/10"
                    nodeColor="#139187"
                    maskColor="rgba(0,0,0, 0.3)"
                />
            </ReactFlow>
        </div>
    );
}

export default function Canvas() {
    return (
        <ReactFlowProvider>
            <CanvasContent />
        </ReactFlowProvider>
    );
}
