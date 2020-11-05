import {FileResponse, JsonResponse} from "./types";

export const isFileResponse = (response: FileResponse | JsonResponse): response is FileResponse => {
    return (response as FileResponse).filename !== undefined;
}

export const isJsonResponse = (response: FileResponse | JsonResponse): response is JsonResponse => {
    return (response as JsonResponse).result !== undefined;
}