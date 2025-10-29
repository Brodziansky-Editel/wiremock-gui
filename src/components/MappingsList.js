import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import {
    Container,
    Card,
    Badge,
    Accordion,
    Alert,
    Spinner,
    Row,
    Col
} from 'react-bootstrap';
import Header from './Header';

const MappingsList = ({ darkMode }) => {
    const [mappings, setMappings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [uploadError, setUploadError] = useState(null);
    
    // Get selected URL from cookie (no default)
    const getInitialUrl = () => {
        const savedUrl = Cookies.get('selectedWireMockUrl');
        if (savedUrl) {
            try {
                const parsed = JSON.parse(savedUrl);
                // Ensure URL doesn't have /requests or /mappings suffix
                if (parsed.url) {
                    parsed.url = parsed.url.replace(/\/(requests|mappings)$/, '');
                }
                return parsed;
            } catch (e) {
                console.error('Error parsing saved URL:', e);
            }
        }
        return null; // No default URL
    };
    
    const [selectedWireMockUrl, setSelectedWireMockUrl] = useState(getInitialUrl());

    // Fetch mappings from WireMock API
    const fetchMappings = async () => {
        if (!selectedWireMockUrl?.url) {
            setError('Please select a WireMock environment from the dropdown');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const mappingsUrl = selectedWireMockUrl.url + '/mappings';
            const response = await axios.get(mappingsUrl);
            setMappings(response.data.mappings || []);
        } catch (err) {
            setError('Failed to fetch mappings: ' + err.message);
            console.error('Error fetching mappings:', err);
        } finally {
            setLoading(false);
        }
    };
    
    // Clear mappings from WireMock
    const clearMappings = async () => {
        if (!selectedWireMockUrl?.url) {
            setError('Please select a WireMock environment from the dropdown');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const mappingsUrl = selectedWireMockUrl.url + '/mappings';
            await axios.delete(mappingsUrl);
            setMappings([]);
        } catch (err) {
            setError('Failed to clear mappings: ' + err.message);
            console.error('Error clearing mappings:', err);
        } finally {
            setLoading(false);
        }
    };

    // Only fetch when URL changes (not on mount)
    useEffect(() => {
        if (selectedWireMockUrl?.url) {
            fetchMappings();
        }
    }, [selectedWireMockUrl]);
    
    // Handle URL selection change
    const handleUrlChange = (newUrl) => {
        setSelectedWireMockUrl(newUrl);
    };

    // Pretty print JSON
    const prettyPrintJson = (obj) => {
        try {
            return JSON.stringify(obj, null, 2);
        } catch (e) {
            return JSON.stringify(obj);
        }
    };

    return (
        <Container fluid className="py-2">
            {/* Header with URL Selector and Data Source Card */}
            <Header
                selectedUrl={selectedWireMockUrl}
                onUrlChange={handleUrlChange}
                loading={loading}
                fetchData={fetchMappings}
                clearData={clearMappings}
                totalItems={mappings.length}
                uploadError={uploadError}
                fetchError={error}
                setUploadError={setUploadError}
                setFetchError={setError}
                showSearchFilter={false}
                endpointType="mappings"
            />

            {/* Loading Spinner */}
            {loading ? (
                <div className="text-center py-5">
                    <Spinner animation="border" role="status" variant="primary">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                    <p className="mt-2 text-muted">Fetching mappings from WireMock...</p>
                </div>
            ) : mappings.length === 0 ? (
                <Alert variant="info">
                    <Alert.Heading>No mappings found</Alert.Heading>
                    <p>There are no stub mappings configured in this WireMock instance.</p>
                </Alert>
            ) : (
                <Accordion>
                    {mappings.map((mapping, index) => (
                        <Card key={mapping.id || index} className="mb-2 shadow-sm">
                            <Accordion.Item eventKey={mapping.id || index.toString()}>
                                <Accordion.Header>
                                    <Container fluid>
                                        <Row className="w-100 align-items-center g-2">
                                            <Col xs={12} md={2}>
                                                <Badge bg="primary">
                                                    {mapping.request?.method || 'ANY'}
                                                </Badge>
                                            </Col>
                                            <Col xs={12} md={6}>
                                                <code className="text-break">
                                                    {mapping.request?.urlPattern || mapping.request?.url || mapping.request?.urlPath || 'N/A'}
                                                </code>
                                            </Col>
                                            <Col xs={6} md={2}>
                                                <Badge bg="success">
                                                    Status: {mapping.response?.status || 200}
                                                </Badge>
                                            </Col>
                                            <Col xs={6} md={2}>
                                                {mapping.metadata?.name && (
                                                    <small className="text-muted">{mapping.metadata.name}</small>
                                                )}
                                            </Col>
                                        </Row>
                                    </Container>
                                </Accordion.Header>
                                <Accordion.Body className="py-2">
                                    <Card className="mb-2">
                                        <Card.Header style={{ backgroundColor: darkMode ? '#1a3a52' : '#e7f3ff' }} className="py-1">
                                            <strong><i className="bi bi-info-circle me-2"></i>Mapping Details</strong>
                                        </Card.Header>
                                        <Card.Body className="py-2">
                                            <Row className="mb-2">
                                                <Col md={6}>
                                                    <p className="mb-1">
                                                        <strong>ID:</strong> <code>{mapping.id}</code>
                                                    </p>
                                                    {mapping.uuid && (
                                                        <p className="mb-1">
                                                            <strong>UUID:</strong> <code>{mapping.uuid}</code>
                                                        </p>
                                                    )}
                                                    <p className="mb-1">
                                                        <strong>Priority:</strong> {mapping.priority || 'Default'}
                                                    </p>
                                                </Col>
                                                <Col md={6}>
                                                    {mapping.metadata?.name && (
                                                        <p className="mb-1">
                                                            <strong>Name:</strong> {mapping.metadata.name}
                                                        </p>
                                                    )}
                                                    <p className="mb-1">
                                                        <strong>Persistent:</strong> {mapping.persistent ? '✓ Yes' : '✗ No'}
                                                    </p>
                                                </Col>
                                            </Row>

                                            {/* Request Matching */}
                                            <div className="mt-3 p-2" style={{ backgroundColor: darkMode ? '#1a3a52' : '#f0f0f0' }}>
                                                <strong className='text-muted'><i className="bi bi-funnel me-2"></i>Request Matching</strong>
                                                <pre className={`p-2 rounded mb-0 mt-2 ${darkMode ? 'bg-secondary text-light' : 'bg-white'}`} style={{ maxHeight: '300px', overflow: 'auto', fontSize: '12px' }}>
                                                    <code>{prettyPrintJson(mapping.request)}</code>
                                                </pre>
                                            </div>

                                            {/* Response Definition */}
                                            <div className="mt-3 p-2" style={{ backgroundColor: darkMode ? '#1a3a52' : '#f0f0f0' }}>
                                                <strong className='text-muted'><i className="bi bi-reply me-2"></i>Response Definition</strong>
                                                <pre className={`p-2 rounded mb-0 mt-2 ${darkMode ? 'bg-secondary text-light' : 'bg-white'}`} style={{ maxHeight: '300px', overflow: 'auto', fontSize: '12px' }}>
                                                    <code>{prettyPrintJson(mapping.response)}</code>
                                                </pre>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Card>
                    ))}
                </Accordion>
            )}
        </Container>
    );
};

export default MappingsList;
