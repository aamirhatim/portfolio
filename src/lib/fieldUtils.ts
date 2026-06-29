/**
 * Retrieves a value from an object using a dot-notation path.
 * Supports up to one level of nesting (e.g. "degree.short").
 * 
 * @param data The source object containing the form data.
 * @param path The field name or dot-notation path (e.g., "name" or "degree.short").
 * @returns The value at the specified path, or undefined if not found.
 */
export const getFieldValue = (data: Record<string, unknown>, path: string): unknown => {
    if (!path.includes('.')) {
        return data[path];
    }
    const [root, child] = path.split('.');
    const rootObj = data[root] as Record<string, unknown> | undefined;
    return rootObj ? rootObj[child] : undefined;
};

/**
 * Updates a value in an object using a dot-notation path.
 * Supports up to one level of nesting (e.g. "degree.short").
 * 
 * @param data The previous source object.
 * @param path The field name or dot-notation path (e.g., "name" or "degree.short").
 * @param value The new value to set.
 * @returns A new object with the updated value.
 */
export const setFieldValue = (data: Record<string, unknown>, path: string, value: unknown): Record<string, unknown> => {
    if (!path.includes('.')) {
        return { ...data, [path]: value };
    }
    const [root, child] = path.split('.');
    return {
        ...data,
        [root]: {
            ...(data[root] as Record<string, unknown> || {}),
            [child]: value
        }
    };
};
