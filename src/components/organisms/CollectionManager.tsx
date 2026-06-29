import { useEffect, useState, useMemo } from "react";
import { createDocument, deleteDocument, updateDocument } from "../../lib/adminLib";
import { useFirebaseAppContext } from "../../context/firebaseAppContext";
import { getDocumentsFromCollection } from "../../lib/firestoreLib";
import { FirestoreDocType } from "../../data/datatypes";
import { Plus, ListChevronsDownUp, ListChevronsUpDown, Search } from "lucide-react";
import { setFieldValue } from "../../lib/fieldUtils";

import CollectionForm from "../molecules/collection-manager/CollectionForm";
import CollectionListItem from "../molecules/collection-manager/CollectionListItem";

/**
 * Configuration for a dynamic field within a Firestore collection document.
 */
export type FieldConfig = {
    /** The key name of the field in the Firestore document (supports dot notation) */
    name: string;
    /** The display label for the field in the UI form */
    label: string;
    /** The data type / input type for the field */
    type: 'string' | 'number' | 'boolean' | 'array' | 'textarea' | 'select';
    /** Whether the field is required to submit the form */
    required?: boolean;
    /** Options for 'select' type fields */
    options?: string[];
};

/**
 * Props for the CollectionManager component.
 */
interface CollectionManagerProps {
    collectionName: string;
    fields: FieldConfig[];
    disableAdd?: boolean;
    showDetails?: boolean;
    enableSearch?: boolean;
}

/**
 * CollectionManager manages the fetching, display, and editing of Firestore documents for a given collection.
 * It uses dynamic `FieldConfig` arrays to generate forms and tables for document properties.
 */
export default function CollectionManager({ collectionName, fields, disableAdd = false, showDetails = true, enableSearch = false }: CollectionManagerProps) {
    const firebaseApp = useFirebaseAppContext();
    const [documents, setDocuments] = useState<FirestoreDocType[]>([]);
    const [loading, setLoading] = useState(true);

    const [isEditing, setIsEditing] = useState(false);
    const [currentDocId, setCurrentDocId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Record<string, unknown>>({});
    const [expandedDocs, setExpandedDocs] = useState<Record<string, boolean>>({});
    const [searchQuery, setSearchQuery] = useState("");

    const filteredDocuments = useMemo(() => {
        return documents.filter(doc => {
            if (!searchQuery) return true;
            const searchLower = searchQuery.toLowerCase();
            return JSON.stringify(doc.data).toLowerCase().includes(searchLower);
        });
    }, [documents, searchQuery]);

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
            else if (f.type === 'select') defaultData[f.name] = f.options?.[0] || "";
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

        setFormData(prev => setFieldValue(prev, fieldName, parsedValue));
    };

    if (loading && !isEditing) {
        return <div className="animate-pulse">Loading {collectionName}...</div>;
    }

    if (isEditing) {
        return (
            <CollectionForm
                currentDocId={currentDocId}
                fields={fields}
                formData={formData}
                onSave={handleSave}
                onCancel={() => setIsEditing(false)}
                onFieldChange={handleFieldChange}
            />
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center mb-4 gap-4">
                <div className="flex items-center gap-2 shrink-0">
                    {!disableAdd && (
                        <button
                            onClick={handleAddNew}
                            className="p-2 bg-[var(--txt-title-color)] text-[var(--bg-color)] rounded hover:opacity-90 transition-opacity mr-1 cursor-pointer"
                            title="Add New"
                        >
                            <Plus size={16} />
                        </button>
                    )}
                    {showDetails && documents.length > 0 && (
                        <>
                            <button
                                onClick={handleExpandAll}
                                className="p-2 bg-[var(--bg-secondary-color)] border border-[var(--border-color)] text-[var(--txt-subtitle-color)] rounded hover:text-[var(--txt-feature-color)] transition-colors cursor-pointer"
                                title="Expand All"
                            >
                                <ListChevronsUpDown size={16} />
                            </button>
                            <button
                                onClick={handleContractAll}
                                className="p-2 bg-[var(--bg-secondary-color)] border border-[var(--border-color)] text-[var(--txt-subtitle-color)] rounded hover:text-[var(--txt-feature-color)] transition-colors cursor-pointer"
                                title="Contract All"
                            >
                                <ListChevronsDownUp size={16} />
                            </button>
                        </>
                    )}
                </div>
                {enableSearch && (
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--txt-subtitle-color)]" size={16} />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-[var(--border-color)] bg-transparent rounded-full text-[var(--txt-body-color)] placeholder:text-[var(--txt-subtitle-color)] focus:outline-none focus:border-[var(--txt-title-color)] transition-colors"
                        />
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-3">
                {filteredDocuments.map(doc => {
                    // Try to find a reasonable title/summary for the list item
                    const summaryField = fields.find(f => f.name === 'title' || f.name === 'name' || f.name === 'school') || fields[0] || doc.id;
                    const summaryText = doc.data[summaryField.name] as string;
                    const isExpanded = expandedDocs[doc.id] || false;

                    return (
                        <CollectionListItem
                            key={doc.id}
                            doc={doc}
                            summaryText={summaryText}
                            isExpanded={isExpanded}
                            showDetails={showDetails}
                            onToggleExpand={() => setExpandedDocs(prev => ({ ...prev, [doc.id]: !prev[doc.id] }))}
                            onEdit={() => handleEdit(doc)}
                            onDelete={() => handleDelete(doc.id)}
                        />
                    );
                })}
                {filteredDocuments.length === 0 && (
                    <div className="text-center p-8 text-[var(--txt-subtitle-color)] border border-dashed border-[var(--border-color)] rounded">
                        No documents found in this collection.
                    </div>
                )}
            </div>
        </div>
    );
}
