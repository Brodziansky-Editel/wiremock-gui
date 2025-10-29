import React from 'react';
import { Form } from 'react-bootstrap';
import Cookies from 'js-cookie';

// Parse WireMock URLs from environment variables
const getWireMockUrls = () => {
    const urls = [];
    let index = 1;
    
    while (true) {
        const envValue = process.env[`REACT_APP_WIREMOCK_URL_${index}`];
        if (!envValue) break;
        
        const [name, url] = envValue.split('|');
        if (name && url) {
            urls.push({ id: index, name: name.trim(), url: url.trim() });
        }
        index++;
    }
    
    return urls;
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
