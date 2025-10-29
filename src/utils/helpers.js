// Utility functions for WireMock GUI

// Format date to locale string
export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
};

// Get Bootstrap badge color for HTTP method
export const getMethodColor = (method) => {
    const colors = {
        'GET': 'primary',
        'POST': 'success',
        'PUT': 'warning',
        'DELETE': 'danger',
        'PATCH': 'info'
    };
    return colors[method] || 'secondary';
};

// Get Bootstrap badge color for HTTP status code
export const getStatusColor = (status) => {
    if (status >= 200 && status < 300) return 'success';
    if (status >= 300 && status < 400) return 'info';
    if (status >= 400 && status < 500) return 'warning';
    if (status >= 500) return 'danger';
    return 'secondary';
};

// Pretty print JSON with error handling
export const prettyPrintJson = (body) => {
    try {
        const parsed = JSON.parse(body);
        return JSON.stringify(parsed, null, 2);
    } catch (e) {
        return body; // Return as-is if not valid JSON
    }
};

// Format body based on pretty print flag
export const formatBody = (body, prettyPrint) => {
    return prettyPrint ? prettyPrintJson(body) : body;
};
