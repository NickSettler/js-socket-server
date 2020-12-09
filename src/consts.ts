import {Route} from "./types";
import {apiLocationHandler} from "./handlers";

export const APP_PORT = 3000;

export enum JSON_RESPONSES {
    SUCCESS = "success",
    ERROR = "error",
}

export enum EXPRESS_METHODS {
    GET = 'get',
    POST = 'post',
    ALL = 'all'
}

export const routes: Array<Route> = [
    {
        path: '/',
        method: EXPRESS_METHODS.GET,
        response: {
            result: JSON_RESPONSES.SUCCESS
        },
        statusCode: 200,
    },
    {
        path: '/api/location/',
        method: EXPRESS_METHODS.POST,
        handler: apiLocationHandler
    }
]