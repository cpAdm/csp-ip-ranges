import { httpRequest } from '../utils/httpClient.ts';
import { type PrefixData } from '../types.ts';

type CloudflareData = {
	result: {
		etag: string;
		ipv4_cidrs: string[];
		ipv6_cidrs: string[];
		jdcloud_cidrs: string[];
	};
	success: boolean;
	errors: unknown;
	messages: unknown;
};

/**
 * Fetch Cloudflare IP ranges
 * @see https://www.cloudflare.com/ips/
 */
export async function fetchCloudflare(): Promise<PrefixData[]> {
	const data = await httpRequest<CloudflareData>(
		'https://api.cloudflare.com/client/v4/ips?networks=jdcloud'
	);

	const result: PrefixData[] = [];

	for (const prefix of data.result.ipv4_cidrs) {
		result.push({
			csp: 'cloudflare',
			ipPrefix: prefix,
			meta: {
				service: 'CLOUDFLARE',
			},
		});
	}

	for (const prefix of data.result.ipv6_cidrs) {
		result.push({
			csp: 'cloudflare',
			ipPrefix: prefix,
			meta: {
				service: 'CLOUDFLARE',
			},
		});
	}

	for (const prefix of data.result.jdcloud_cidrs) {
		result.push({
			csp: 'cloudflare',
			ipPrefix: prefix,
			meta: {
				service: 'JD_CLOUD',
			},
		});
	}

	return result;
}
