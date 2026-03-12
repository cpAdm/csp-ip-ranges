export const CSP_OPTIONS = [
	{
		name: 'Amazon Web Services',
		value: 'AWS',
	},
	{
		name: 'Microsoft Azure',
		value: 'azure',
	},
	{
		name: 'Google Cloud Platform',
		value: 'GCP',
	},
	{
		name: 'Cloudflare',
		value: 'cloudflare',
	},
	{
		name: 'Digital Ocean',
		value: 'digital_ocean',
	},
	{
		name: 'IBM Cloud',
		value: 'IBM',
	},
	{
		name: 'Oracle Cloud',
		value: 'oracle_cloud',
	},
	{
		// Choopa was acquired by Vultr
		name: 'Vultr',
		value: 'vultr',
	},
] as const;

export type CSPValue = (typeof CSP_OPTIONS)[number]['value'];

export type PrefixData = {
	csp: CSPValue;
	ipPrefix: string;

	/** Any other information the CSP might provide */
	meta: Partial<{
		/** Also known as 'scope' */
		region: string;
		service: string;
		countryCode: string;
		subdivisionCode: string;
		city: string;
		postalCode: string;
		tags: string[];
	}>;
};
