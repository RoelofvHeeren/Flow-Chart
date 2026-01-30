import { create } from 'zustand';
import { socket } from '@/lib/socket';
import {
    Connection,
    Edge,
    EdgeChange,
    Node,
    NodeChange,
    addEdge,
    OnNodesChange,
    OnEdgesChange,
    OnConnect,
    applyNodeChanges,
    applyEdgeChanges,
} from 'reactflow';

type RFState = {
    flowId: string | null;
    nodes: Node[];
    edges: Edge[];
    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    onConnect: OnConnect;
    setNodes: (nodes: Node[]) => void;
    setEdges: (edges: Edge[]) => void;
    setFlowId: (id: string) => void;
    applyRemoteNodeChanges: (changes: NodeChange[]) => void;
    applyRemoteEdgeChanges: (changes: EdgeChange[]) => void;
    addRemoteEdge: (connection: Connection) => void;
    addNode: (node: Node) => void;
};

// Simple debounce function
const debounceSave = (fn: Function, ms: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), ms);
    };
};

const saveFlow = async (id: string, nodes: Node[], edges: Edge[]) => {
    if (!id) return;
    try {
        await fetch(`/api/flows/${id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nodes, edges })
        });
        console.log('Auto-saved flow', id);
    } catch (e) {
        console.error("Auto-save failed", e);
    }
};

const debouncedSave = debounceSave(saveFlow, 1000);

// Initial state
const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

export const useStore = create<RFState>((set, get) => ({
    flowId: null,
    nodes: initialNodes,
    edges: initialEdges,
    setFlowId: (id) => {
        set({ flowId: id });
        socket.emit('join-room', id);
    },
    onNodesChange: (changes: NodeChange[]) => {
        set({
            nodes: applyNodeChanges(changes, get().nodes),
        });
        const flowId = get().flowId;
        if (changes.length > 0 && flowId) {
            socket.emit('nodes-change', { changes, roomId: flowId });
            debouncedSave(flowId, get().nodes, get().edges);
        }
    },
    onEdgesChange: (changes: EdgeChange[]) => {
        set({
            edges: applyEdgeChanges(changes, get().edges),
        });
        const flowId = get().flowId;
        if (changes.length > 0 && flowId) {
            socket.emit('edges-change', { changes, roomId: flowId });
            debouncedSave(flowId, get().nodes, get().edges);
        }
    },
    onConnect: (connection: Connection) => {
        set({
            edges: addEdge(connection, get().edges),
        });
        const flowId = get().flowId;
        if (flowId) {
            socket.emit('connect-edge', { connection, roomId: flowId });
            debouncedSave(flowId, get().nodes, get().edges);
        }
    },
    setNodes: (nodes: Node[]) => {
        set({ nodes });
    },
    setEdges: (edges: Edge[]) => {
        set({ edges });
    },
    applyRemoteNodeChanges: (changes: NodeChange[]) => {
        set({
            nodes: applyNodeChanges(changes, get().nodes),
        });
    },
    applyRemoteEdgeChanges: (changes: EdgeChange[]) => {
        set({
            edges: applyEdgeChanges(changes, get().edges),
        });
    },
    addRemoteEdge: (connection: Connection) => {
        set({
            edges: addEdge(connection, get().edges),
        });
    },
    addNode: (node: Node) => {
        set({ nodes: [...get().nodes, node] });
        const flowId = get().flowId;
        if (flowId) {
            socket.emit('nodes-change', { changes: [{ type: 'add', item: node }], roomId: flowId });
            debouncedSave(flowId, get().nodes, get().edges);
        }
    }
}));
