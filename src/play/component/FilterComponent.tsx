import * as React from "react";
import Select, { MultiValue } from "react-select";

export type Item = {
    value: string;
    label: string;
};

export const FilterComponent = (props: {
    items: Item[];
    onChange: (values: string[]) => void;
}) => {
    const handleChange = (items: MultiValue<Item>) => {
        props.onChange(items.map((it) => it.value));
    };
    const customStyles = {
        control: (base: any) => ({
            ...base,
            background: "#1e90ff",
        }),
        placeholder: (base: any) => ({
            ...base,
            color: "#fff",
        }),
        clearIndicator: (base: any) => ({
            ...base,
            color: "#fff",
        }),
        dropdownIndicator: (base: any) => ({
            ...base,
            color: "#fff",
        }),
    };
    return (
        <div
            style={{
                padding: "0 10px",
            }}
        >
            <Select
                options={props.items}
                styles={customStyles}
                placeholder="Filter"
                onChange={handleChange}
                isMulti
            />
        </div>
    );
};
