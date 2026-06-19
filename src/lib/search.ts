import tablesData from './data/tables.json';

/** Map of table name -> list of people seated at that table. */
export type Tables = Record<string, string[]>;

export const tables = tablesData as Tables;

export interface SearchResult {
	name: string;
	table: string;
}

/** Flattened list of every person paired with their table. */
const everyone: SearchResult[] = Object.entries(tables).flatMap(([table, names]) =>
	names.map((name) => ({ name, table }))
);

/**
 * Case-insensitive substring search over all names.
 * Returns the matching people together with their table.
 */
export function searchNames(query: string): SearchResult[] {
	const q = query.trim().toLowerCase();
	if (!q) return [];
	return everyone.filter((person) => person.name.toLowerCase().includes(q));
}

/** Everyone seated at a given table. */
export function peopleAtTable(table: string): string[] {
	return tables[table] ?? [];
}

export const tableCount = Object.keys(tables).length;
export const peopleCount = everyone.length;
