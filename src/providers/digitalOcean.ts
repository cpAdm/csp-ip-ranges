import { httpRequest } from '../utils/httpClient.ts';
import { type PrefixData } from '../types.ts';

/**
 * Fetch Digital Ocean IP ranges
 * @see https://ideas.digitalocean.com/documentation/p/list-of-digital-ocean-ips-cidrs
 */
export async function fetchDigitalOcean(): Promise<PrefixData[]> {
	const data = await httpRequest<string>('https://digitalocean.com/geo/google.csv');

	// This is a CSV file with rows formatted as: <ip_prefix>,<country_code>,<subdivision_code>,<city>,<postal_code>
	const result: PrefixData[] = [];
	for (const rowRaw of data.split('\n')) {
		const trimmed = rowRaw.trim();
		if (!trimmed) {
			continue; // Skip empty lines
		}

		const [ipPrefix, countryCode, subdivisionCode, city, postalCode] = rowRaw.split(',');
		if (!ipPrefix) continue;
		result.push({
			csp: 'digital_ocean',
			ipPrefix: ipPrefix,
			meta: {
				countryCode,
				subdivisionCode,
				city,
				postalCode,
			},
		});
	}

	return result;
}
