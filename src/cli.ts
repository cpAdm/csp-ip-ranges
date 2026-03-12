import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import type { AnySchema } from 'ajv';
import { fetchAllProviders } from './index.ts';
import { loadJsonFile, saveJsonFile } from './utils/storage.ts';

const __filename = fileURLToPath(import.meta.url);
const ROOT_DIR = join(dirname(__filename), '..');
const DATA_DIR = join(ROOT_DIR, 'data');
const PACKAGE_JSON_PATH = join(ROOT_DIR, 'package.json');
const CSP_SCHEMA_PATH = join(ROOT_DIR, 'csp.schema.json');

async function main() {
	console.log('Fetching all CSP IP ranges...\n');
	const result = await fetchAllProviders();
	console.log(`\n✓ Total prefixes fetched: ${result.success.length}`);

	// Save combined file
	const { version } = await loadJsonFile<{ version: string }>(PACKAGE_JSON_PATH);
	const cspSchema = await loadJsonFile<AnySchema>(CSP_SCHEMA_PATH);
	const timestamp = new Date().toISOString();
	const filename = `${timestamp.split('T')[0]}.json`;

	const output = {
		repositoryVersion: version,
		timestamp: timestamp,
		totalPrefixes: result.success.length,
		successCount: result.success.length,
		failureCount: result.failed.length,
		failed: result.failed,
		prefixes: result.success,
	};

	// Make sure the output adheres to the schema
	const ajv = new Ajv2020({ allErrors: true, strict: false });
	addFormats(ajv);
	const validate = ajv.compile(cspSchema);
	if (!validate(output)) {
		throw new Error(
			`Output validation failed: ${ajv.errorsText(validate.errors, { separator: '; ' })}`
		);
	}

	await saveJsonFile(join(DATA_DIR, filename), output);
	console.log(`✓ Saved to ${filename}`);

	if (result.failed.length > 0) {
		console.error(`✗ Failed providers: ${result.failed.length}`);
		process.exit(1);
	}
}

main().catch((error) => {
	console.error('Unexpected error:', error instanceof Error ? error.message : String(error));
	process.exit(1);
});
