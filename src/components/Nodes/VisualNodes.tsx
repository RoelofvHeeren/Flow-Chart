import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import clsx from 'clsx';

export const ShapeNode = memo(({ data, selected }: any) => {
    const shape = data.shape || 'rectangle';
    const label = data.label || '';

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
                "text-white text-sm font-medium text-center outline-none",
                shape === 'diamond' ? '-rotate-45' : ''
            )} contentEditable suppressContentEditableWarning>
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

export const TextNode = memo(({ data, selected }: any) => {
    return (
        <div className={clsx(
            "p-2 min-w-[150px] transition-all border border-transparent hover:border-white/10 rounded",
            selected ? "border-teal-accent/50" : ""
        )}>
            <div
                className="text-white text-lg font-medium outline-none bg-transparent"
                contentEditable
                suppressContentEditableWarning
            >
                {data.label || "Type something..."}
            </div>
            {/* Hidden handles for flexibility if needed */}
            <Handle type="source" position={Position.Bottom} className="opacity-0" />
            <Handle type="target" position={Position.Top} className="opacity-0" />
        </div>
    );
});
