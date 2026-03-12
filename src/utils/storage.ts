import { promises as fs } from 'fs';
import { dirname } from 'path';

async function ensureDir(dirPath: string): Promise<void> {
	try {
		await fs.mkdir(dirPath, { recursive: true });
	} catch (error) {
		if (error instanceof Error && 'code' in error && error.code !== 'EEXIST') {
			throw error;
		}
	}
}

export async function saveJsonFile<T>(filePath: string, data: T): Promise<void> {
	await ensureDir(dirname(filePath));
	await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function loadJsonFile<T>(filePath: string): Promise<T> {
	const content = await fs.readFile(filePath, 'utf-8');
	return JSON.parse(content) as T;
}
