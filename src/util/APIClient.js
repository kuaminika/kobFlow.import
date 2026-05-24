function APIClient({ clientTypeModel, apiKey }) {
    const self = this;
    
    self.url = clientTypeModel.url;
    self.baseUrl = clientTypeModel.baseUrl||"";
    self.fullUrl = self.baseUrl + self.url;
    async function request(method, body) {
        const response = await fetch(self.fullUrl, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: body ? JSON.stringify(body) : undefined
        });

        if (!response.ok) {
            console.log(`API request failed: ${response.status} ${response.statusText}`,response);

            throw new Error(`HTTP ${response.status} — ${method} ${self.fullUrl}`);
        }

        return response.json();
    }
    self.setEndpoint = (endpoint) => {
        self.url = endpoint;
        self.fullUrl = self.baseUrl + self.url;
    };
    self.fetch = () => request('GET');
    self.post     = (body) => request('POST', body);
}

export default APIClient;