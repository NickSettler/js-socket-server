require('dotenv').config();
import * as crypto from "crypto";
import express = require("express");
import * as io from "socket.io";
import SocketIO from "socket.io";
import {APP_PORT, routes} from "./consts";
import {Route, SocketClient} from "./types";
import {isFileResponse, isJsonResponse} from "./functions";
import * as path from "path";

const {SHA256_KEY} = process.env;

const app: express.Application = express();

routes.map((route: Route) => app[route.method](route.path, (req, res) => {
    if (isJsonResponse(route.response)) {
        res.json(route.response).status(route.statusCode);
    } else if (isFileResponse(route.response)) {
        res.sendFile(path.join(__dirname, route.response.filename));
    }
}));

const server = app.listen(APP_PORT, () => {
    console.log(`Server is on port ${APP_PORT}`);
});

let clients: Array<SocketClient> = [];

const socketServer: SocketIO.Server = io(server);

socketServer.on("connection", (socket: SocketIO.Socket) => {
    console.log(`New socket connection. ID: ${socket.id}`);

    const number = ~~socket.handshake.query.number || 0;

    clients.push({
        id: socket.id,
        number
    });

    const hash = crypto.createHmac("sha256", SHA256_KEY)
        .update(socket.id)
        .digest("hex");

    socket.emit('connect_success', {
        id: socket.id,
        hash,
    });

    socket.on('number_change', (data) => {
        const {number}: { number: number } = data;

        clients.find((client: SocketClient) => client.id === socket.id).number = number;

        sendClientsChange();
    });

    socket.on('disconnect', () => {
        console.log(`Client disconnected. ID: ${socket.id}`);

        clients = clients.filter((client: SocketClient) => client.id !== socket.id);

        sendClientsChange();
    });

    sendClientsChange();
});

const sendClientsChange = () => {
    const clientsArrayToSend = clients.sort((a: SocketClient, b: SocketClient) => {
        return a.number < b.number ? -1 : a.number > b.number ? 1 : 0;
    });

    console.log(JSON.stringify(clientsArrayToSend));

    socketServer.clients().emit('clients_change', clientsArrayToSend);
};