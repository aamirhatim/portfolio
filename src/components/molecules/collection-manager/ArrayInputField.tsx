import { useState } from "react";

interface ArrayInputFieldProps {
    name?: string;
    value?: string[];
    onChange: (value: string[]) => void;
    placeholder?: string;
    required?: boolean;
    className?: string;
}

/**
 * Parses a comma-separated string into a clean array of trimmed, non-empty strings.
 */
const parseArray = (str: string): string[] => {
    return str
        .split(',')
        .map(s => s.trim())
        .filter(s => s !== "");
};

/**
 * ArrayInputField allows editing an array of strings via a comma-separated text input.
 * It maintains local string state to prevent commas and spaces from being wiped during typing.
 */
export default function ArrayInputField({
    name,
    value = [],
    onChange,
    placeholder = "Comma separated values (e.g. React, TypeScript, Tailwind CSS)",
    required = false,
    className = "p-2 border border-[var(--border-color)] rounded bg-[var(--bg-color)] text-[var(--txt-body-color)] placeholder:text-[var(--txt-subtitle-color)]"
}: ArrayInputFieldProps) {
    const [prevValue, setPrevValue] = useState<string[]>(value);
    const [text, setText] = useState<string>(() => Array.isArray(value) ? value.join(', ') : "");

    // Adjust state during render if external value changed independently (e.g. form reset or document switch)
    if (value !== prevValue) {
        setPrevValue(value);
        const currentParsed = parseArray(text);
        const isSame = 
            Array.isArray(value) &&
            value.length === currentParsed.length &&
            value.every((v, i) => v === currentParsed[i]);

        if (!isSame) {
            setText(Array.isArray(value) ? value.join(', ') : "");
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newText = e.target.value;
        setText(newText);
        onChange(parseArray(newText));
    };

    const handleBlur = () => {
        const parsed = parseArray(text);
        const formatted = parsed.join(', ');
        setText(formatted);
        onChange(parsed);
    };

    return (
        <input
            type="text"
            name={name}
            value={text}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={placeholder}
            className={className}
            required={required}
        />
    );
}
