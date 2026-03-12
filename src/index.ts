import { CSP_OPTIONS, type CSPValue, type PrefixData } from './types.ts';
import { fetchAws } from './providers/aws.ts';
import { fetchGcp } from './providers/gcp.ts';
import { fetchAzure } from './providers/azure.ts';
import { fetchCloudflare } from './providers/cloudflare.ts';
import { fetchDigitalOcean } from './providers/digitalOcean.ts';
import { fetchIBM } from './providers/ibm.ts';
import { fetchOracleCloud } from './providers/oracleCloud.ts';
import { fetchVultr } from './providers/vultr.ts';

// Matches IPv4: x.x.x.x/xx or IPv6: x:x:x:x:x:x:x:x/xx
export const CIDR_REGEX = /([0-9a-f.:]+\/\d+)/gi;

// Mapping of CSP values to their fetch functions
const PROVIDERS: Record<CSPValue, () => Promise<PrefixData[]>> = {
	AWS: fetchAws,
	azure: fetchAzure,
	GCP: fetchGcp,
	cloudflare: fetchCloudflare,
	digital_ocean: fetchDigitalOcean,
	IBM: fetchIBM,
	oracle_cloud: fetchOracleCloud,
	vultr: fetchVultr,
};

/**
 * Fetch IP ranges for all CSP providers
 * Returns all results, even if some providers fail
 */
export async function fetchAllProviders(): Promise<{
	success: PrefixData[];
	failed: { provider: CSPValue; error: string }[];
}> {
	const success: PrefixData[] = [];
	const failed: { provider: CSPValue; error: string }[] = [];

	for (const { value: provider, name } of CSP_OPTIONS) {
		try {
			console.log(`Fetching ${name}...`);
			const data = await PROVIDERS[provider]();
			success.push(...data);
			console.log(`  ✓ ${data.length} prefixes fetched`);
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			failed.push({ provider, error: message });
			console.error(`  ✗ Failed: ${message}`);
		}
	}

	return { success, failed };
}
