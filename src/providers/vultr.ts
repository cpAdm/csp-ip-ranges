import { httpRequest } from '../utils/httpClient.ts';
import { type PrefixData } from '../types.ts';

type VultrData = {
	asn: number;
	email: string;
	updated: string;
	subnets: {
		ip_prefix: string;
		alpha2code: string;
		region: string;
		city: string;
		postal_code: string;
	}[];
};

/**
 * Fetch Vultr IP ranges
 * @see https://docs.vultr.com/vultr-ip-space
 */
export async function fetchVultr(): Promise<PrefixData[]> {
	const data = await httpRequest<VultrData>('https://geofeed.constant.com/?json');

	const result: PrefixData[] = [];
	for (const subnet of data.subnets) {
		result.push({
			csp: 'vultr',
			ipPrefix: subnet.ip_prefix,
			meta: {
				region: subnet.region,
				countryCode: subnet.alpha2code,
				city: subnet.city,
				postalCode: subnet.postal_code,
			},
		});
	}

	return result;
}
