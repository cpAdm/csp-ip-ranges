import { httpRequest } from '../utils/httpClient.ts';
import { type PrefixData } from '../types.ts';

type AzureData = {
	changeNumber: number;
	cloud: 'Public';
	values: {
		name: string;
		id: string;
		properties: {
			changeNumber: number;
			region: string;
			regionId: number;
			platform: string;
			systemService: string;
			addressPrefixes: string[];
			networkFeatures: string[] | null;
		};
	}[];
};

/**
 * Fetch Microsoft Azure IP ranges
 * There is no public REST API, so we find the newest download url via the website
 * @see https://www.microsoft.com/en-us/download/details.aspx?id=56519
 */
export async function fetchAzure(): Promise<PrefixData[]> {
	const url = 'https://www.microsoft.com/en-us/download/details.aspx?id=56519';
	const pageHtml = await httpRequest<string>(url);

	const jsonUrlMatch = pageHtml.match(
		/https:\/\/download\.microsoft\.com\/[^"]*ServiceTags_Public[^"]*\.json/
	);

	if (!jsonUrlMatch) {
		throw new Error(`Failed to find Azure ranges download link on ${url}`);
	}

	const downloadUrl = jsonUrlMatch[0];
	const rawData = await httpRequest<AzureData | string>(downloadUrl);
	// Response is an octet-stream with JSON content
	const data = typeof rawData === 'string' ? (JSON.parse(rawData) as AzureData) : rawData;

	const result: PrefixData[] = [];
	for (const entry of data.values) {
		for (const prefix of entry.properties.addressPrefixes) {
			result.push({
				csp: 'azure',
				ipPrefix: prefix,
				meta: {
					region: entry.properties.region,
					service: entry.name,
				},
			});
		}
	}

	return result;
}
