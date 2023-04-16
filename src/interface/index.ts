import { TablePaginationConfig } from 'antd/es/table';
import { SassString } from 'sass';
import { CookieState, ModeVideo, StatusRender, StatusUpload, StatusVideo } from './enum';

export interface TableParams {
    pagination?: TablePaginationConfig;
    page?: number;
    perPage?: number;
    isDeleted?: boolean;
}
export interface Base {
    id: number | string;
    idDeleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
}
export interface Role extends Base {
    name: string;
    key: string;
    description: string;
    rolePermission?: RolePermisson[];
}
export interface RolePermisson extends Base {
    id: string;
    permission: Permission[];
}
export interface ModelObject extends Base {
    name: string;
    allowAll?: boolean;
    permission: Permission[];
}
export interface ResetPassword {
    keycloackId: string;
    resetPassword: string;
}

export interface Decode {
    exp: number;
    iat: number;
    auth_time: number;
    jti: string;
    iss: string;
    aud: string[];
    sub: string;
    typ: string;
    azp: string;
    session_state: string;
    acr: string;
    realm_access: {
        roles: string[];
    };
    resource_access: {
        [key: string]: {
            roles: string[];
        };
    };
    scope: string;
    sid: string;
    email_verified: boolean;
    name: string;
    preferred_username: string;
    given_name: string;
    email: string;
}
export interface User extends Base {
    email: string;
    username: string;
    password: string;
    keycloakId: string;
    phoneNumber: string;
    lastName: string;
    kind: string;
    avatar: string;
    address: string;
    active: boolean;
    role: Role[];
    manager: User;
    direct: User[];
}

export interface Country extends Base {
    name: string;
    code: string;
    language?: Language[];
}

export interface Topic extends Base {
    name: string;
    code: string;
}
export interface Language extends Base {
    name: string;
    code: string;
    country?: Country;
}

export interface Channel extends Base {
    password: string;
    email: string;
    channelId: string;
    message: string;
    nameOfChannel: string;
    metaData: string;
    publish: string;
    isMoney: boolean;
    isPublishManual: boolean;
    maxVideoPublishPerday: number;
    kidsContent: boolean;
    copyRightContent: boolean;
    channelDetail: string;
    emailContact: string;
    linkSocial: string[];
    keywords: string[];
    cookieState: CookieState;
    channelContent: string;
    youtubeCategory: number;
    cookie: string;
    country?: Country;
    language?: Language;
    user?: User;
    topic?: Topic;
}

export interface Font extends Base {
    name: string;
    path: string;
    thumb: string;
}

export interface Audio extends Base {
    name: string;
    path: string;
    thumb: string;
    kind: string;
    mode: string;
    lyric: string;
    source: string;
    country?: Country;
    language?: Language;
    user?: User;
}
export interface Image extends Base {
    name: string;
    pathFileConfig: string;
    thumb: string;
}

export interface Configvideo extends Base {
    name: string;
    autoName: boolean;
    thumb: string;
    message: string;
    description: string;
    tags: string[];
    mode: ModeVideo;
    timePublic: string;
    statusVideo: StatusVideo;
    pathFileVideo: string;
    statusUpload: StatusUpload;
    kidsContent: boolean;
    videoIdYoutube: string;
    pathFileConfig: string;
    statusRender: StatusRender;
    channel?: Channel;
    language?: Language;
    topic?: Topic;
    user?: User;
}

export interface Template extends Base {
    name: string;
    thumb: string;
    pathFileConfig: string;
    description: string;
    demo: string;
    user?: User;
}

export interface ChatGpt {
    content: string;
}
export interface Permission extends Base {
    id: string;
    isAllowed?: boolean;
    permission?: string;
    des: string;
    break: boolean;
    modelobject: ModelObject;
}
