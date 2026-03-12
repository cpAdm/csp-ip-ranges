import { httpRequest } from '../utils/httpClient.ts';
import { type PrefixData } from '../types.ts';

type AwsData = {
	syncToken: string;
	createDate: string;
	prefixes: {
		ip_prefix: string;
		region: string;
		service: string;
		network_border_group: string;
	}[];
	ipv6_prefixes: {
		ipv6_prefix: string;
		region: string;
		service: string;
		network_border_group: string;
	}[];
};

/**
 * Fetch AWS IP ranges
 * @see https://docs.aws.amazon.com/vpc/latest/userguide/aws-ip-ranges.html
 */
export async function fetchAws(): Promise<PrefixData[]> {
	const data = await httpRequest<AwsData>('https://ip-ranges.amazonaws.com/ip-ranges.json');

	const ipv4Data: PrefixData[] = data.prefixes.map((entry) => ({
		csp: 'AWS',
		ipPrefix: entry.ip_prefix,
		meta: {
			region: entry.region,
			service: entry.service,
		},
	}));

	const ipv6Data: PrefixData[] = data.ipv6_prefixes.map((entry) => ({
		csp: 'AWS',
		ipPrefix: entry.ipv6_prefix,
		meta: {
			region: entry.region,
			service: entry.service,
		},
	}));

	return [...ipv4Data, ...ipv6Data];
}
