import { Handle, Position } from "reactflow";
import { ReactNode } from "react";
import clsx from "clsx";

interface BaseNodeProps {
    children: ReactNode;
    selected?: boolean;
    className?: string;
    handles?: {
        type: "source" | "target";
        position: Position;
        id?: string;
    }[];
}

export default function BaseNode({ children, selected, className, handles = [] }: BaseNodeProps) {
    return (
        <div
            className={clsx(
                "relative rounded-xl p-4 min-w-[200px] transition-all duration-300 backdrop-blur-md border",
                selected
                    ? "bg-white/10 border-teal-accent shadow-[0_0_20px_rgba(19,145,135,0.3)] ring-1 ring-teal-accent"
                    : "bg-black/40 border-white/10 hover:bg-black/50 hover:border-white/20 shadow-glass",
                className
            )}
        >
            {/* Render Handles */}
            {handles.map((handle, index) => (
                <Handle
                    key={index}
                    type={handle.type}
                    position={handle.position}
                    id={handle.id}
                    className={clsx(
                        "!w-3 !h-3 !border-2 !transition-all !bg-black",
                        selected ? "!border-teal-accent" : "!border-gray-500",
                        "hover:!bg-teal-accent hover:!border-white"
                    )}
                />
            ))}
            {children}
        </div>
    );
}
