function APIClient({ clientTypeModel, apiKey }) {
    const self = this;

    async function request(method, body) {
        const response = await fetch(clientTypeModel.url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: body ? JSON.stringify(body) : undefined
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status} — ${method} ${clientTypeModel.url}`);
        }

        return response.json();
    }

    self.fetchAll = () => request('GET');
    self.post     = (body) => request('POST', body);
}

export default APIClient;