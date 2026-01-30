import { useEffect } from 'react';
import { useStore } from '@/lib/store';
import { socket } from '@/lib/socket';
import { NodeChange, EdgeChange, Connection } from 'reactflow';

export const useSocket = () => {
    const { applyRemoteNodeChanges, applyRemoteEdgeChanges, addRemoteEdge } = useStore();

    useEffect(() => {
        const handleNodeChanges = (changes: NodeChange[]) => {
            applyRemoteNodeChanges(changes);
        };

        const handleEdgeChanges = (changes: EdgeChange[]) => {
            applyRemoteEdgeChanges(changes);
        };

        const handleConnectEdge = (connection: Connection) => {
            addRemoteEdge(connection);
        }

        socket.on('nodes-change', handleNodeChanges);
        socket.on('edges-change', handleEdgeChanges);
        socket.on('connect-edge', handleConnectEdge);

        return () => {
            socket.off('nodes-change', handleNodeChanges);
            socket.off('edges-change', handleEdgeChanges);
            socket.off('connect-edge', handleConnectEdge);
        };
    }, [applyRemoteNodeChanges, applyRemoteEdgeChanges, addRemoteEdge]);
};
