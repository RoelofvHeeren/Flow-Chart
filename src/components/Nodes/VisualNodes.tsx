import React, { memo, useCallback } from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';
import clsx from 'clsx';

export const ShapeNode = memo(({ id, data, selected }: any) => {
    const { setNodes } = useReactFlow();
    const shape = data.shape || 'rectangle';
    const label = data.label || '';

    const onLabelChange = useCallback((evt: any) => {
        const newLabel = evt.target.innerText;
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === id) {
                    node.data = { ...node.data, label: newLabel };
                }
                return node;
            })
        );
    }, [id, setNodes]);

    // Basic styles for different shapes
    const shapeStyles: Record<string, string> = {
        rectangle: 'rounded-md',
        circle: 'rounded-full aspect-square',
        diamond: 'rotate-45', // Content needs to be counter-rotated if we put text inside
        parallelogram: '-skew-x-12',
        rounded: 'rounded-2xl',
    };

    return (
        <div className={clsx(
            "relative flex items-center justify-center p-4 min-w-[100px] min-h-[100px] transition-all border-2",
            selected ? "border-teal-accent bg-teal-accent/10" : "border-white/20 bg-black/20",
            shape === 'diamond' ? 'w-32 h-32' : '', // Diamonds need explicit size usually
            shapeStyles[shape] || 'rounded-md'
        )}>
            <div className={clsx(
                "text-white text-sm font-medium text-center outline-none w-full h-full flex items-center justify-center bg-transparent",
                shape === 'diamond' ? '-rotate-45' : ''
            )} contentEditable suppressContentEditableWarning onInput={onLabelChange}>
                {label}
            </div>

            {/* Handles for connections - generic positions */}
            <Handle type="target" position={Position.Top} className="!bg-transparent !border-none" />
            <Handle type="source" position={Position.Bottom} className="!bg-transparent !border-none" />
            <Handle type="source" position={Position.Right} className="!bg-transparent !border-none" />
            <Handle type="target" position={Position.Left} className="!bg-transparent !border-none" />
        </div>
    );
});

export const TextNode = memo(({ id, data, selected }: any) => {
    const { setNodes } = useReactFlow();

    const onLabelChange = useCallback((evt: any) => {
        const newLabel = evt.target.innerText;
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === id) {
                    node.data = { ...node.data, label: newLabel };
                }
                return node;
            })
        );
    }, [id, setNodes]);

    return (
        <div className={clsx(
            "p-2 min-w-[150px] transition-all border border-transparent hover:border-white/10 rounded",
            selected ? "border-teal-accent/50" : ""
        )}>
            <div
                className="text-white text-lg font-medium outline-none bg-transparent"
                contentEditable
                suppressContentEditableWarning
                onInput={onLabelChange}
            >
                {data.label || "Type something..."}
            </div>
            {/* Hidden handles for flexibility if needed */}
            <Handle type="source" position={Position.Bottom} className="opacity-0" />
            <Handle type="target" position={Position.Top} className="opacity-0" />
        </div>
    );
});
