import * as React from "react";
import { Mylist } from "../model/Mylist";

export const TagComponent = (props: { mylists: Mylist[] }) => {
    return (
        <div
            style={{
                position: "absolute",
                display: "flex",
                right: "84px",
                bottom: "7px",
            }}
        >
            {props.mylists.map((mylist) => (
                <div
                    style={{
                        fontSize: "12px",
                        backgroundColor: "#1e90ff",
                        padding: "4px 4px",
                        color: "#fff",
                        textAlign: "center",
                        lineHeight: 1,
                        margin: "4px 2px",
                        borderRadius: "4px",
                    }}
                >
                    {mylist.mylist_name}
                </div>
            ))}
        </div>
    );
};
