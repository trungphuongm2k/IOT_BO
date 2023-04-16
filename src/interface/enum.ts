// channel
export enum CookieState {
    ready = 'READY',
    none = 'NONE',
    unset = 'UNSET',
}
// video
export enum StatusRender {
    done = 'DONE',
    wait = 'WAIT',
    fail = 'FAIL',
    render = 'RENDER',
}
export enum StatusUpload {
    auto = 'AUTO',
    handmade = 'HANDMADE',
}

export enum ModeVideo {
    public = 'PUBLIC',
    notpublic = 'NOT_PUBLIC',
    private = 'PRIVATE',
    timer = 'TIMER',
}

export enum StatusVideo {
    create = 'CREATE',
    ready = 'READY',
    repair = 'REPAIR',
    delete = 'DELETE',
    toolDelete = 'TOOL_DELETE',
    uploadSuccessful = 'UPLOAD_SUCCESSFUL',
    uploadFail = 'UPLOAD_FAIL',
    processing = 'PROCESSING',
}
