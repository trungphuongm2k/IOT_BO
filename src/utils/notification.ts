import { notification } from "antd";

export const notiSuccess = (msg: string) => {
    notification["success"]({
        message: msg,
        placement: "top",
        duration: 2,
    });
};

export const notiWarning = (msg: string) => {
    notification["warning"]({
        message: msg,
        placement: "top",
        duration: 2,
    });
};

export const notiError = (msg: string) => {
    notification["error"]({
        message: msg,
        placement: "top",
        duration: 2,
    });
};
