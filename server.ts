import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
    const httpServer = createServer(handler);

    const io = new Server(httpServer);

    io.on("connection", (socket) => {
        console.log("Client connected", socket.id);

        // Broadcast changes to all other clients
        socket.on("nodes-change", (changes) => {
            socket.broadcast.emit("nodes-change", changes);
        });

        socket.on("edges-change", (changes) => {
            socket.broadcast.emit("edges-change", changes);
        });

        socket.on("connect-edge", (connection) => {
            socket.broadcast.emit("connect-edge", connection);
        });
    });

    httpServer
        .once("error", (err) => {
            console.error(err);
            process.exit(1);
        })
        .listen(port, () => {
            console.log(`> Ready on http://${hostname}:${port}`);
        });
});
