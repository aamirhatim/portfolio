import { FormEvent } from "react";
import { FieldConfig } from "../../organisms/CollectionManager";
import { getFieldValue } from "../../../lib/fieldUtils";
import { ChevronDown } from "lucide-react";
import ArrayInputField from "./ArrayInputField";
import ProjectPreviewsEditor from "./ProjectPreviewsEditor";

/**
 * Props for the CollectionForm molecule component.
 */
interface CollectionFormProps {
    /** The ID of the document being edited, or null if creating a new document */
    currentDocId: string | null;
    /** The dynamic field schema for the collection */
    fields: FieldConfig[];
    /** Current form field values mapped by field name */
    formData: Record<string, unknown>;
    /** Submit handler triggered on form save */
    onSave: (e: FormEvent) => void;
    /** Cancel handler to exit edit mode */
    onCancel: () => void;
    /** Field change handler to update parent state */
    onFieldChange: (fieldName: string, value: unknown, type: string) => void;
    /** Optional identifier for special modular sections (e.g. project preview images) */
    customSection?: 'project-previews';
    /** Ref callback hook to commit custom section changes (e.g. Storage uploads) upon save */
    previewSaveRef?: React.MutableRefObject<((targetProjectId: string) => Promise<void>) | null>;
    /** Whether the form is currently persisting changes (disables buttons and inputs) */
    isSaving?: boolean;
}

export default function CollectionForm({
    currentDocId,
    fields,
    formData,
    onSave,
    onCancel,
    onFieldChange,
    customSection,
    previewSaveRef,
    isSaving = false
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
                                <ArrayInputField
                                    key={`${field.name}-${currentDocId ?? 'new'}`}
                                    name={field.name}
                                    value={(rawValue as string[]) || []}
                                    onChange={(newArr) => onFieldChange(field.name, newArr, field.type)}
                                    placeholder="Comma separated values"
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

                {/* Optional Custom Sections (e.g. Project Popup Previews under skills) */}
                {customSection === 'project-previews' && (
                    <ProjectPreviewsEditor
                        projectId={currentDocId}
                        saveRef={previewSaveRef}
                        disabled={isSaving}
                    />
                )}

                <div className="flex gap-4 mt-4">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="px-4 py-2 bg-[var(--txt-title-color)] text-[var(--bg-color)] rounded font-semibold transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
                    >
                        {isSaving ? "Saving..." : "Save"}
                    </button>
                    <button
                        type="button"
                        disabled={isSaving}
                        onClick={onCancel}
                        className="px-4 py-2 border border-[var(--border-color)] rounded hover:bg-[var(--bg-color)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
