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
    nodes: Node[];
    edges: Edge[];
    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    onConnect: OnConnect;
    setNodes: (nodes: Node[]) => void;
    setEdges: (edges: Edge[]) => void;
    applyRemoteNodeChanges: (changes: NodeChange[]) => void;
    applyRemoteEdgeChanges: (changes: EdgeChange[]) => void;
    addRemoteEdge: (connection: Connection) => void;
    addNode: (node: Node) => void;
};


// Initial state
const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

export const useStore = create<RFState>((set, get) => ({
    nodes: initialNodes,
    edges: initialEdges,
    onNodesChange: (changes: NodeChange[]) => {
        set({
            nodes: applyNodeChanges(changes, get().nodes),
        });
        if (changes.length > 0) {
            socket.emit('nodes-change', changes);
        }
    },
    onEdgesChange: (changes: EdgeChange[]) => {
        set({
            edges: applyEdgeChanges(changes, get().edges),
        });
        if (changes.length > 0) {
            socket.emit('edges-change', changes);
        }
    },
    onConnect: (connection: Connection) => {
        set({
            edges: addEdge(connection, get().edges),
        });
        socket.emit('connect-edge', connection);
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
        socket.emit('nodes-change', [{ type: 'add', item: node }]);
    }
}));

