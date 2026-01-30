import React, { memo, useCallback } from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';

const NoteNode = ({ id, data }: { id: string, data: { label: string } }) => {
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
        <div className="bg-yellow-100/90 border border-yellow-300 rounded-lg p-4 shadow-sm min-w-[200px] min-h-[100px]">
            <div
                className="text-gray-800 font-handwriting text-sm whitespace-pre-wrap outline-none w-full h-full bg-transparent"
                contentEditable
                suppressContentEditableWarning
                onInput={onLabelChange}
            >
                {data.label || "Click to add a note..."}
            </div>
            {/* Hidden handles to allow connecting if desired, but mostly it's a note */}
            <Handle type="target" position={Position.Top} className="!bg-transparent !border-none" />
            <Handle type="source" position={Position.Bottom} className="!bg-transparent !border-none" />
        </div>
    );
};

export default memo(NoteNode);
