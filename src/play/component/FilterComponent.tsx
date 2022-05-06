import * as React from "react";
import Select, { MultiValue } from "react-select";

export type OptionItem = {
    value: string;
    label: string;
};

export const FilterComponent = (props: {
    options: OptionItem[];
    onChange: (values: string[]) => void;
}) => {
    const handleChange = (items: MultiValue<OptionItem>) => {
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
                options={props.options}
                styles={customStyles}
                placeholder="Filter"
                onChange={handleChange}
                isMulti
            />
        </div>
    );
};
