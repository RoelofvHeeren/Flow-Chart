import { TriggerNode, ActionNode, ConditionNode } from "@/components/Nodes";
import NoteNode from "@/components/Nodes/NoteNode"; // Ensure this file exists
import { ShapeNode, TextNode } from "@/components/Nodes/VisualNodes";

export const nodeTypes = {
    trigger: TriggerNode,
    action: ActionNode,
    condition: ConditionNode,
    note: NoteNode,
    shape: ShapeNode,
    text: TextNode,
};
