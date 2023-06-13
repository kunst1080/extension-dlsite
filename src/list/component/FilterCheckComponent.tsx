import * as React from "react";

export const FilterCheckComponnet = ({
    children,
    onUpdate,
    defaultChecked = false,
}: {
    children: string;
    onUpdate: (checked: boolean) => void;
    defaultChecked?: boolean;
}) => {
    const id = React.useId();
    const [checked, setChecked] = React.useState(defaultChecked);
    React.useEffect(() => {
        onUpdate(checked);
    });
    return (
        <label htmlFor={id}>
            <input
                id={id}
                type="checkbox"
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
            />
            {children}
        </label>
    );
};
