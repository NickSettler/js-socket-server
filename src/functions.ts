import {FileResponse, JsonResponse} from "./types";
import * as https from "https";
import * as http from "http";

export const isFileResponse = (response: FileResponse | JsonResponse): response is FileResponse => {
    return (response as FileResponse).filename !== undefined;
}

export const isJsonResponse = (response: FileResponse | JsonResponse): response is JsonResponse => {
    return (response as JsonResponse).result !== undefined;
}

export const createServer = (app: http.RequestListener, options?: https.ServerOptions): http.Server | https.Server => {
    return !!~~process.env.DEV ? http.createServer(app) : https.createServer(options, app);
}