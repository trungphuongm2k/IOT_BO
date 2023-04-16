import React from "react";
import classNames from "classnames/bind";
import styles from "./Loading.module.scss";
const cx = classNames.bind(styles);
function Loading() {
    return (
        <>
            <div className={cx("spinner-wrapper")}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src="/loading.svg"
                    className={cx("spinner")}
                    alt="loading"
                />
            </div>
        </>
    );
}

export default Loading;
