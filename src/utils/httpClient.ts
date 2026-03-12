export async function httpRequest<T = unknown>(url: string, options?: RequestInit): Promise<T> {
	try {
		const response = await fetch(url, {
			method: 'GET',
			...options,
		});

		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText} for ${url}`);
		}

		const contentType = response.headers.get('content-type');
		if (contentType?.includes('application/json')) {
			return (await response.json()) as T;
		} else {
			return (await response.text()) as T;
		}
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(`Failed to fetch from ${url}: ${error.message}`);
		}
		throw error;
	}
}
