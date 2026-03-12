import { httpRequest } from '../utils/httpClient.ts';
import { type PrefixData } from '../types.ts';

type OracleCloudData = {
	last_updated_timestamp: string;
	regions: {
		region: string;
		cidrs: {
			cidr: string;
			tags: string[];
		}[];
	}[];
};

/**
 * Fetch Oracle Cloud IP ranges
 * @see https://docs.oracle.com/en-us/iaas/Content/General/Concepts/addressranges.htm
 */
export async function fetchOracleCloud(): Promise<PrefixData[]> {
	const data = await httpRequest<OracleCloudData>(
		'https://docs.oracle.com/en-us/iaas/tools/public_ip_ranges.json'
	);

	const result: PrefixData[] = [];
	for (const region of data.regions) {
		for (const cidr of region.cidrs) {
			result.push({
				csp: 'oracle_cloud',
				ipPrefix: cidr.cidr,
				meta: {
					region: region.region,
					tags: cidr.tags,
				},
			});
		}
	}

	return result;
}
