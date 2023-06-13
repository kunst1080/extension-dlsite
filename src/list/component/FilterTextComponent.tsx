import * as React from "react";

export const FilterTextComponnet = (props: {
    children: string;
    onUpdate: (text: string) => void;
}) => {
    const id = React.useId();
    const [text, setText] = React.useState("");
    React.useEffect(() => {
        props.onUpdate(text);
    });
    return (
        <label htmlFor={id}>
            {props.children}
            <input
                id={id}
                type="text"
                className="short"
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
        </label>
    );
};
