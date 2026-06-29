import { FormEvent } from "react";
import { FieldConfig } from "../../organisms/CollectionManager";
import { getFieldValue } from "../../../lib/fieldUtils";
import { ChevronDown } from "lucide-react";

interface CollectionFormProps {
    currentDocId: string | null;
    fields: FieldConfig[];
    formData: Record<string, unknown>;
    onSave: (e: FormEvent) => void;
    onCancel: () => void;
    onFieldChange: (fieldName: string, value: unknown, type: string) => void;
}

export default function CollectionForm({
    currentDocId,
    fields,
    formData,
    onSave,
    onCancel,
    onFieldChange
}: CollectionFormProps) {
    return (
        <div className="bg-[var(--bg-secondary-color)] p-6 rounded-lg shadow-sm border border-[var(--border-color)]">
            <h3 className="text-xl font-bold mb-4 capitalize">{currentDocId ? 'Edit' : 'New'} Document</h3>
            <form onSubmit={onSave} className="flex flex-col gap-4">
                {fields.map(field => {
                    const rawValue = getFieldValue(formData, field.name);
                    
                    return (
                        <div key={field.name} className="flex flex-col gap-1">
                            <label className="text-sm font-semibold text-[var(--txt-subtitle-color)]">{field.label}</label>
                            {field.type === 'textarea' ? (
                                <textarea
                                    value={(rawValue as string) || ""}
                                    onChange={(e) => onFieldChange(field.name, e.target.value, field.type)}
                                    className="p-2 border border-[var(--border-color)] rounded bg-[var(--bg-color)] min-h-[100px]"
                                    required={field.required ?? true}
                                />
                            ) : field.type === 'boolean' ? (
                                <input
                                    type="checkbox"
                                    checked={(rawValue as boolean) || false}
                                    onChange={(e) => onFieldChange(field.name, e.target.checked, field.type)}
                                    className="w-5 h-5 accent-[var(--txt-title-color)]"
                                />
                            ) : field.type === 'array' ? (
                                <input
                                    type="text"
                                    value={((rawValue as string[]) || []).join(', ')}
                                    onChange={(e) => onFieldChange(field.name, e.target.value, field.type)}
                                    placeholder="Comma separated values"
                                    className="p-2 border border-[var(--border-color)] rounded bg-[var(--bg-color)]"
                                    required={field.required ?? false}
                                />
                            ) : field.type === 'select' ? (
                                <div className="relative flex items-center">
                                    <select
                                        value={(rawValue as string) || (field.options?.[0] || "")}
                                        onChange={(e) => onFieldChange(field.name, e.target.value, field.type)}
                                        className="w-full p-2 pr-8 border border-[var(--border-color)] rounded bg-[var(--bg-color)] appearance-none cursor-pointer"
                                        required={field.required ?? true}
                                    >
                                        {field.options?.map(opt => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                    <ChevronDown size={16} className="absolute right-3 text-[var(--txt-subtitle-color)] pointer-events-none" />
                                </div>
                            ) : (
                                <input
                                    type={field.type === 'number' ? 'number' : 'text'}
                                    value={(rawValue as string | number) ?? (field.type === 'number' ? 0 : "")}
                                    onChange={(e) => onFieldChange(field.name, e.target.value, field.type)}
                                    className="p-2 border border-[var(--border-color)] rounded bg-[var(--bg-color)]"
                                    required={field.required ?? (field.type !== 'number')}
                                />
                            )}
                        </div>
                    );
                })}
                <div className="flex gap-4 mt-4">
                    <button type="submit" className="px-4 py-2 bg-[var(--txt-title-color)] text-[var(--bg-color)] rounded font-semibold transition-colors hover:opacity-90 cursor-pointer">
                        Save
                    </button>
                    <button type="button" onClick={onCancel} className="px-4 py-2 border border-[var(--border-color)] rounded hover:bg-[var(--bg-color)] transition-colors cursor-pointer">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
