import api from './axios';

export async function translateText(text: string, target: string): Promise<string> {
    if (!text || !target) return text;

    try {
        const res = await api.post('/translate', { text, target });
        return res.data.translated;
    } catch (error) {
        return text;
    }
}

export async function translateObject<T extends Record<string, any>>(
    obj: T,
    fields: (keyof T)[],
    targetLang: string
): Promise<T> {
    if (!obj || !targetLang || targetLang === 'uz') return obj;

    const translatedObj = { ...obj };

    await Promise.all(
        fields.map(async (field) => {
            const value = obj[field];
            if (typeof value === 'string' && value) {
                translatedObj[field] = await translateText(value, targetLang);
            }
        })
    );

    return translatedObj;
}

export async function translateArray<T extends Record<string, any>>(
    items: T[],
    fields: (keyof T)[],
    targetLang: string
): Promise<T[]> {
    if (!items || !targetLang || targetLang === 'uz') return items;

    return Promise.all(
        items.map((item) => translateObject(item, fields, targetLang))
    );
}
