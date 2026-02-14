export interface TenantMatch {
    name: string;
    phone: string;
    email: string;
    score: string;
    source: string;
    reason: string;
    matchId?: string;
    propertySummary?: string;
}

export const fetchTenantData = async (): Promise<TenantMatch[]> => {
    const SHEET_ID = '1KKlE1No1Se9YRcdEQZ2AkUUqr4U7IxY2Qmrt2UjopsA';
    const SHEET_NAME = 'Result Matched Data';
    const URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(SHEET_NAME)}`;

    try {
        const response = await fetch(URL);
        const text = await response.text();
        return parseCSV(text);
    } catch (error) {
        console.error('Error fetching tenant data:', error);
        return [];
    }
};

const parseCSV = (csvText: string): TenantMatch[] => {
    const tenants: TenantMatch[] = [];

    // Normalize newlines
    const normalizedText = csvText.replace(/\\r\\n/g, '\\n').replace(/\\r/g, '\\n');

    // Find the start of tenant list to avoid header matches
    const startMarker = "Top 5 matching tenants";
    const startIndex = normalizedText.indexOf(startMarker);

    // If marker not found, try to parse anyway (fallback) or return empty
    // But since the erroneous match was BEFORE this marker, using substring is critical.
    if (startIndex === -1) return [];

    const relevantText = normalizedText.substring(startIndex);

    // Stricter regex: Name, Phone, Email, Score should not contain newlines.
    // Disallow "—" in name to avoid capturing too much if formatting is loose, 
    // but the main protection is disallowing newlines.
    const tenantRegex = /(?:^|\n)(\d+)\)\s+([^\n—]+?)\s+[—–-]\s+Phone:\s*([^\n—]*?)\s+[—–-]\s+Email:\s*([^\n—]*?)\s+[—–-]\s+Score:\s*(\d+%?)\s*\n\s*Source:\s*(https?:\/\/[^\s\n]+)\s*\n\s*Why:\s*([\s\S]+?)(?=\n\n\d+\)|\nNotes|\n\"|$)/g;

    let match;
    while ((match = tenantRegex.exec(relevantText)) !== null) {
        const [_, id, namePart, phonePart, emailPart, scorePart, sourcePart, whyPart] = match;

        tenants.push({
            name: namePart.trim(),
            phone: phonePart.trim() || 'Not provided',
            email: emailPart.trim() || 'Not provided',
            score: scorePart.trim(),
            source: sourcePart.trim(),
            reason: whyPart.trim().replace(/\\n/g, ' '),
            matchId: id
        });
    }

    return tenants.sort((a, b) => {
        const scoreA = parseInt(a.score) || 0;
        const scoreB = parseInt(b.score) || 0;
        return scoreB - scoreA;
    });
};
