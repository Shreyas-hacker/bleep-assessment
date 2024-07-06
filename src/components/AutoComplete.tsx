import React, { useState, useRef, useEffect, useCallback } from "react";
import { useFloating, offset, flip } from "@floating-ui/react";

export interface OptionType {
    label: string;
    value: string;
}

interface AutocompleteProps {
    label: string;
    description?: string;
    disabled?: boolean;
    filterOptions?: (options: OptionType[], query: string) => OptionType[];
    loading?: boolean;
    multiple?: boolean;
    onChange: (value: OptionType | OptionType[] | null) => void;
    onInputChange?: (query: string) => void;
    options: OptionType[];
    placeholder?: string;
    renderOption?: (option: OptionType) => React.ReactNode;
    value?: OptionType | OptionType[] | null;
}

export const Autocomplete: React.FC<AutocompleteProps> = ({
    label,
    description,
    disabled = false,
    filterOptions,
    loading = false,
    multiple = false,
    onChange,
    onInputChange,
    options,
    placeholder = "Type to begin searching",
    renderOption,
    value,
}) => {
    const [query, setQuery] = useState("");
    const [filteredOptions, setFilteredOptions] = useState<OptionType[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState<OptionType[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const { x, y, refs, strategy } = useFloating({
        middleware: [offset(5), flip()],
    });

    useEffect(() => {
        setFilteredOptions(
            filterOptions
                ? filterOptions(options, query)
                : options.filter((option) =>
                    option.label.toLowerCase().includes(query.toLowerCase())
                )
        );
    }, [query, options, filterOptions]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newQuery = e.target.value;
        setQuery(newQuery);
        if (onInputChange) {
            onInputChange(newQuery);
        }
        setIsOpen(true);
    };

    const handleOptionClick = useCallback(
        (option: OptionType) => {
            if (multiple) {
                const isSelected = selectedOptions.find(
                    (selected) => selected.value === option.value
                );
                const newSelectedOptions = isSelected
                    ? selectedOptions.filter(
                        (selected) => selected.value !== option.value
                    )
                    : [...selectedOptions, option];
                setSelectedOptions(newSelectedOptions);
                onChange(newSelectedOptions);
            } else {
                setSelectedOptions([option]);
                onChange(option);
            }
        },
        [multiple, onChange, selectedOptions]
    );

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Escape") {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                refs.reference.current &&
                !(refs.reference.current as HTMLElement).contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [refs.reference]);

    return (
        <div className="flex flex-col items-start overflow-visible text-left w-full">
            <label className="text-lg text-gray-500">{label}</label>
            <div ref={refs.setReference} className="relative w-full">
                <div className="relative w-full mt-1 rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400">
                            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path>
                        </svg>
                    </div>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder={placeholder}
                        value={query}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        disabled={disabled}
                        className="block w-full pl-10 pr-3 py-2 form-input sm:text-xl sm:leading-10 rounded-md shadow"
                        onFocus={() => setIsOpen(true)}
                        aria-expanded={isOpen}
                        aria-haspopup="listbox"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-2">
                        {loading && (<span className="flex items-center justify-center w-5 h-5" style={{ display: "none" }}>
                            <div className="w-full h-full border-2 border-gray-200 rounded-full border-t-gray-400 animate-spin"></div>
                        </span>)}
                    </div>
                    {isOpen && (
                        <ul
                            ref={refs.setFloating}
                            className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 overflow-auto max-h-60"
                            style={{ position: strategy, top: y ?? "", left: x ?? "" }}
                            role="listbox"
                        >
                            {filteredOptions.map((option) => (
                                <li
                                    key={option.value}
                                    onClick={() => handleOptionClick(option)}
                                    className="flex  items-center px-3 py-2 cursor-pointer hover:bg-gray-100"
                                >
                                    <span>{option.label}</span>
                                    <style>
                                        {`
                                            /* Custom checkbox style */
                                            .custom-checkbox:checked {
                                                background-color: #3b82f6; /* Tailwind's blue-500 */
                                                border-color: #3b82f6; /* Tailwind's blue-500 */
                                            }
                                            .custom-checkbox:checked + label {
                                                color: #3b82f6; /* Tailwind's blue-500 */
                                            }
                                        `}
                                    </style>
                                    <input
                                        type="checkbox"
                                        checked={selectedOptions.some(
                                            (selected) => selected.value === option.value
                                        )}
                                        onChange={(event) => {
                                            event.stopPropagation();
                                            handleOptionClick(option)
                                        }}
                                        className="ml-8 custom-checkbox"
                                    />
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
            <p className="mt-1 text-xl text-gray-500">{description}</p>
        </div>
    );
};
