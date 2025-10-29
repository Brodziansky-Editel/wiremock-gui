import React from 'react';
import { Form } from 'react-bootstrap';
import Cookies from 'js-cookie';

// Parse WireMock URLs from environment variables
const getWireMockUrls = () => {
    const envValue = process.env.REACT_APP_WIREMOCK_URLS;
    if (!envValue) return [];
    
    return envValue.split(';').map((entry, index) => {
        const [name, url] = entry.split('|');
        return { id: index + 1, name: name.trim(), url: url.trim() };
    }).filter(item => item.name && item.url);
};

const URLSelector = ({ selectedUrl, onUrlChange }) => {
    const urls = getWireMockUrls();
    
    const handleChange = (e) => {
        const selectedId = parseInt(e.target.value);
        const selected = urls.find(u => u.id === selectedId);
        if (selected) {
            // Ensure URL doesn't have /requests or /mappings suffix
            const cleanUrl = {
                ...selected,
                url: selected.url.replace(/\/(requests|mappings)$/, '')
            };
            // Save to cookie
            Cookies.set('selectedWireMockUrl', JSON.stringify(cleanUrl), { expires: 365 });
            onUrlChange(cleanUrl);
        }
    };
    
    return (
        <Form.Select 
            value={selectedUrl?.id || ''} 
            onChange={handleChange}
            size="sm"
        >
            <option value="">Select WireMock Environment</option>
            {urls.map(url => (
                <option key={url.id} value={url.id}>
                    {url.name}
                </option>
            ))}
        </Form.Select>
    );
};

export default URLSelector;
