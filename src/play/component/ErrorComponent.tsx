import * as React from "react";

export const ErrorComponent = () => {
    return (
        <div
            style={{
                position: "absolute",
                display: "flex",
                right: "84px",
                bottom: "7px",
                color: "red",
                fontWeight: "bold",
            }}
        >
            エラー
        </div>
    );
};
