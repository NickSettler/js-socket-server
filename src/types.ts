import {EXPRESS_METHODS, JSON_RESPONSES} from "./consts";

export type Route = {
    path: string;
    method: EXPRESS_METHODS;
    statusCode: number;
    response: JsonResponse | FileResponse;
}

export type JsonResponse = {
    result: JSON_RESPONSES;
    message?: string;
}

export type FileResponse = {
    filename: string;
}

export type SocketClient = {
    id: string;
    number: number;
}