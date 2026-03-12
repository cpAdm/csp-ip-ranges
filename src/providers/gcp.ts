import { httpRequest } from '../utils/httpClient.ts';
import { type PrefixData } from '../types.ts';

type GcpData = {
	syncToken: string;
	creationTime: string;
	prefixes: (
		| {
				ipv4Prefix: string;
				service: string;
				scope: string;
		  }
		| {
				ipv6Prefix: string;
				service: string;
				scope: string;
		  }
	)[];
};

/**
 * Fetch Google Cloud Platform IP ranges
 * @see https://support.google.com/a/answer/10026322?hl=en-419
 */
export async function fetchGcp(): Promise<PrefixData[]> {
	const data = await httpRequest<GcpData>('https://www.gstatic.com/ipranges/cloud.json');

	return data.prefixes.map((entry) => ({
		csp: 'GCP',
		ipPrefix: 'ipv4Prefix' in entry ? entry.ipv4Prefix : entry.ipv6Prefix,
		meta: {
			region: entry.scope,
			service: entry.service,
		},
	}));
}
