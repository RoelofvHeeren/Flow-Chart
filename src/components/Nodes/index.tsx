import { memo } from "react";
import { Position } from "reactflow";
import { Play, Activity, Split } from "lucide-react";
import BaseNode from "./BaseNode";

export const TriggerNode = memo(({ data, selected }: any) => {
    return (
        <BaseNode
            selected={selected}
            handles={[{ type: "source", position: Position.Bottom }]}
            className="border-t-4 border-t-teal-accent"
        >
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-teal-accent/20 text-teal-accent">
                    <Play className="w-4 h-4" />
                </div>
                <div>
                    <p className="text-sm font-semibold text-white">{data.label || "Trigger"}</p>
                    <p className="text-xs text-gray-400">{data.description || "Start flow"}</p>
                </div>
            </div>
        </BaseNode>
    );
});

export const ActionNode = memo(({ data, selected }: any) => {
    return (
        <BaseNode
            selected={selected}
            handles={[
                { type: "target", position: Position.Top },
                { type: "source", position: Position.Bottom }
            ]}
        >
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                    <Activity className="w-4 h-4" />
                </div>
                <div>
                    <p className="text-sm font-semibold text-white">{data.label || "Action"}</p>
                    <p className="text-xs text-gray-400">{data.description || "Do something"}</p>
                </div>
            </div>
        </BaseNode>
    );
});

export const ConditionNode = memo(({ data, selected }: any) => {
    return (
        <BaseNode
            selected={selected}
            handles={[
                { type: "target", position: Position.Top },
                { type: "source", position: Position.Bottom, id: "yes" }, // TODO: specific placement for yes/no
                { type: "source", position: Position.Right, id: "no" }
            ]}
        >
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-500/20 text-yellow-400">
                    <Split className="w-4 h-4" />
                </div>
                <div>
                    <p className="text-sm font-semibold text-white">{data.label || "Condition"}</p>
                    <p className="text-xs text-gray-400">{data.description || "Check logic"}</p>
                </div>
            </div>
        </BaseNode>
    );
});
