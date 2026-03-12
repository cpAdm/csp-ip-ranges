import { httpRequest } from '../utils/httpClient.ts';
import { type PrefixData } from '../types.ts';
import { CIDR_REGEX } from '../index.ts';

/**
 * Fetch IBM Cloud IP ranges
 * IBM does not provide simple machine-readable format, so we scrape it from their documentation
 * @see https://cloud.ibm.com/docs/security-groups?topic=security-groups-ibm-cloud-ip-ranges
 */
export async function fetchIBM(): Promise<PrefixData[]> {
	const data = await httpRequest<string>(
		'https://raw.githubusercontent.com/ibm-cloud-docs/infrastructure-hub/refs/heads/master/ips.md'
	);

	// Parse IP prefixes from all the Markdown tables
	const result: PrefixData[] = [];
	for (const line of data.split('\n')) {
		// Check if this is a table data row (starts with |)
		if (line.trim().startsWith('|')) {
			for (const match of line.matchAll(CIDR_REGEX)) {
				if (!match[1]) continue;
				result.push({
					csp: 'IBM',
					ipPrefix: match[1],
					meta: {},
				});
			}
		}
	}

	return result;
}
