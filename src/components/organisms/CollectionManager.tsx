import { useEffect, useState } from "react";
import { createDocument, deleteDocument, updateDocument } from "../../lib/adminLib";
import { useFirebaseAppContext } from "../../context/firebaseAppContext";
import { getDocumentsFromCollection } from "../../lib/firestoreLib";
import { FirestoreDocType } from "../../data/datatypes";
import { ChevronDown, ChevronRight, Pencil, Trash2, Plus, ListChevronsDownUp, ListChevronsUpDown } from "lucide-react";

/**
 * Configuration for a dynamic field within a Firestore collection document.
 */
export type FieldConfig = {
    /** The key name of the field in the Firestore document */
    name: string;
    /** The display label for the field in the UI form */
    label: string;
    /** The data type / input type for the field */
    type: 'string' | 'number' | 'boolean' | 'array' | 'textarea';
    /** Whether the field is required to submit the form */
    required?: boolean;
};

/**
 * Props for the CollectionManager component.
 */
interface CollectionManagerProps {
    collectionName: string;
    fields: FieldConfig[];
    disableAdd?: boolean;
    showDetails?: boolean;
}

export default function CollectionManager({ collectionName, fields, disableAdd = false, showDetails = true }: CollectionManagerProps) {
    const firebaseApp = useFirebaseAppContext();
    const [documents, setDocuments] = useState<FirestoreDocType[]>([]);
    const [loading, setLoading] = useState(true);

    const [isEditing, setIsEditing] = useState(false);
    const [currentDocId, setCurrentDocId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Record<string, unknown>>({});
    const [expandedDocs, setExpandedDocs] = useState<Record<string, boolean>>({});

    const handleExpandAll = () => {
        const newExpanded: Record<string, boolean> = {};
        documents.forEach(doc => {
            newExpanded[doc.id] = true;
        });
        setExpandedDocs(newExpanded);
    };

    const handleContractAll = () => {
        setExpandedDocs({});
    };

    const fetchDocs = async () => {
        setLoading(true);
        const docs = await getDocumentsFromCollection(firebaseApp, collectionName);
        if (docs) {
            setDocuments(docs);
        }
        setLoading(false);
    };

    useEffect(() => {
        let active = true;
        getDocumentsFromCollection(firebaseApp, collectionName).then(docs => {
            if (!active) return;
            if (docs) {
                setDocuments(docs);
            }
            setLoading(false);
        });
        return () => { active = false; }
    }, [collectionName, firebaseApp]);

    const handleAddNew = () => {
        const defaultData: Record<string, unknown> = {};
        fields.forEach(f => {
            if (f.type === 'array') defaultData[f.name] = [];
            else if (f.type === 'boolean') defaultData[f.name] = false;
            else if (f.type === 'number') defaultData[f.name] = 0;
            else defaultData[f.name] = "";
        });
        setFormData(defaultData);
        setCurrentDocId(null);
        setIsEditing(true);
    };

    const handleEdit = (doc: FirestoreDocType) => {
        setFormData(doc.data);
        setCurrentDocId(doc.id);
        setIsEditing(true);
    };

    const handleDelete = async (docId: string) => {
        if (window.confirm("Are you sure you want to delete this document?")) {
            await deleteDocument(firebaseApp, collectionName, docId);
            fetchDocs();
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (currentDocId) {
            await updateDocument(firebaseApp, collectionName, currentDocId, formData);
        } else {
            await createDocument(firebaseApp, collectionName, formData);
        }
        setIsEditing(false);
        fetchDocs();
    };

    const handleFieldChange = (fieldName: string, value: unknown, type: string) => {
        let parsedValue = value;
        if (type === 'number') parsedValue = Number(value);
        if (type === 'array') parsedValue = (value as string).split(',').map((s: string) => s.trim()).filter((s: string) => s !== "");

        setFormData(prev => {
            if (fieldName.includes('.')) {
                const parts = fieldName.split('.');
                const root = parts[0];
                const child = parts[1];
                return {
                    ...prev,
                    [root]: {
                        ...(prev[root] || {}),
                        [child]: parsedValue
                    }
                };
            }
            return { ...prev, [fieldName]: parsedValue };
        });
    };

    if (loading && !isEditing) {
        return <div className="animate-pulse">Loading {collectionName}...</div>;
    }

    if (isEditing) {
        return (
            <div className="bg-[var(--bg-secondary-color)] p-6 rounded-lg shadow-sm border border-[var(--border-color)]">
                <h3 className="text-xl font-bold mb-4 capitalize">{currentDocId ? 'Edit' : 'New'} Document</h3>
                <form onSubmit={handleSave} className="flex flex-col gap-4">
                    {fields.map(field => (
                        <div key={field.name} className="flex flex-col gap-1">
                            <label className="text-sm font-semibold text-[var(--txt-subtitle-color)]">{field.label}</label>
                            {field.type === 'textarea' ? (
                                <textarea
                                    value={field.name.includes('.') ? ((formData[field.name.split('.')[0]] as Record<string, unknown>)?.[field.name.split('.')[1]] as string || "") : (formData[field.name] as string || "")}
                                    onChange={(e) => handleFieldChange(field.name, e.target.value, field.type)}
                                    className="p-2 border border-[var(--border-color)] rounded bg-[var(--bg-color)] min-h-[100px]"
                                    required={field.required ?? true}
                                />
                            ) : field.type === 'boolean' ? (
                                <input
                                    type="checkbox"
                                    checked={field.name.includes('.') ? ((formData[field.name.split('.')[0]] as Record<string, unknown>)?.[field.name.split('.')[1]] as boolean || false) : (formData[field.name] as boolean || false)}
                                    onChange={(e) => handleFieldChange(field.name, e.target.checked, field.type)}
                                    className="w-5 h-5 accent-[var(--txt-title-color)]"
                                />
                            ) : field.type === 'array' ? (
                                <input
                                    type="text"
                                    value={(field.name.includes('.') ? ((formData[field.name.split('.')[0]] as Record<string, unknown>)?.[field.name.split('.')[1]] as string[] || []) : (formData[field.name] as string[] || [])).join(', ')}
                                    onChange={(e) => handleFieldChange(field.name, e.target.value, field.type)}
                                    placeholder="Comma separated values"
                                    className="p-2 border border-[var(--border-color)] rounded bg-[var(--bg-color)]"
                                    required={field.required ?? false}
                                />
                            ) : (
                                <input
                                    type={field.type === 'number' ? 'number' : 'text'}
                                    value={field.name.includes('.') ? ((formData[field.name.split('.')[0]] as Record<string, unknown>)?.[field.name.split('.')[1]] as string | number || (field.type === 'number' ? 0 : "")) : (formData[field.name] as string | number || (field.type === 'number' ? 0 : ""))}
                                    onChange={(e) => handleFieldChange(field.name, e.target.value, field.type)}
                                    className="p-2 border border-[var(--border-color)] rounded bg-[var(--bg-color)]"
                                    required={field.required ?? (field.type !== 'number')}
                                />
                            )}
                        </div>
                    ))}
                    <div className="flex gap-4 mt-4">
                        <button type="submit" className="px-4 py-2 bg-[var(--txt-title-color)] text-[var(--bg-color)] rounded font-semibold transition-colors hover:opacity-90">
                            Save
                        </button>
                        <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 border border-[var(--border-color)] rounded hover:bg-[var(--bg-color)] transition-colors">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    {!disableAdd && (
                        <button
                            onClick={handleAddNew}
                            className="p-2 bg-[var(--txt-title-color)] text-[var(--bg-color)] rounded hover:opacity-90 transition-opacity mr-1"
                            title="Add New"
                        >
                            <Plus size={16} />
                        </button>
                    )}
                    {showDetails && documents.length > 0 && (
                        <>
                            <button
                                onClick={handleExpandAll}
                                className="p-2 bg-[var(--bg-secondary-color)] border border-[var(--border-color)] text-[var(--txt-subtitle-color)] rounded hover:text-[var(--txt-feature-color)] transition-colors"
                                title="Expand All"
                            >
                                <ListChevronsUpDown size={16} />
                            </button>
                            <button
                                onClick={handleContractAll}
                                className="p-2 bg-[var(--bg-secondary-color)] border border-[var(--border-color)] text-[var(--txt-subtitle-color)] rounded hover:text-[var(--txt-feature-color)] transition-colors"
                                title="Contract All"
                            >
                                <ListChevronsDownUp size={16} />
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-3">
                {documents.map(doc => {
                    // Try to find a reasonable title/summary for the list item
                    const summaryField = fields.find(f => f.name === 'title' || f.name === 'name' || f.name === 'school') || fields[0] || doc.id;
                    const summaryText = doc.data[summaryField.name];

                    const isExpanded = expandedDocs[doc.id];
                    return (
                        <div key={doc.id} className="flex flex-col p-4 rounded bg-[var(--bg-secondary-color)]">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3 overflow-hidden max-w-[60%]">
                                    {showDetails && (
                                        <button
                                            onClick={() => setExpandedDocs(prev => ({ ...prev, [doc.id]: !prev[doc.id] }))}
                                            className="text-[var(--txt-subtitle-color)] hover:text-[var(--txt-feature-color)] transition-colors flex-shrink-0"
                                        >
                                            {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                                        </button>
                                    )}
                                    <div className="font-medium text-[var(--txt-feature-color)] truncate">
                                        {summaryText}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(doc)}
                                        className="p-2 text-[var(--txt-subtitle-color)] hover:bg-[var(--txt-highlight-color)] hover:text-[var(--bg-color)] rounded transition-colors"
                                        title="Edit"
                                    >
                                        <Pencil size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(doc.id)}
                                        className="p-2 text-[var(--txt-subtitle-color)] hover:bg-red-500 hover:text-white rounded transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            {showDetails && isExpanded && (
                                <div className="mt-4 pt-4 px-4 border-t border-[var(--border-color)] overflow-x-auto">
                                    <table className="w-full text-left text-sm text-[var(--txt-body-color)]">
                                        <tbody>
                                            {Object.entries(doc.data).map(([key, val]) => (
                                                <tr key={key} className="border-b border-[var(--border-color)] last:border-0">
                                                    <td className="py-2 pr-4 font-semibold align-top">{key}</td>
                                                    <td className="py-2 break-all">{typeof val === 'object' ? JSON.stringify(val, null, 2) : String(val)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    );
                })}
                {documents.length === 0 && (
                    <div className="text-center p-8 text-[var(--txt-subtitle-color)] border border-dashed border-[var(--border-color)] rounded">
                        No documents found in this collection.
                    </div>
                )}
            </div>
        </div>
    );
}
