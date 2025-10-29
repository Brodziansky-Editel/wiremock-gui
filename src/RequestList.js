import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import {
    Container,
    Card,
    Badge,
    Accordion,
    Row,
    Col,
    Alert,
    Spinner
} from 'react-bootstrap';
import RequestDetailsCard from './components/RequestDetailsCard';
import RequestHeader from './components/RequestHeader';
import Pagination from './components/Pagination';
import StatsFooter from './components/StatsFooter';
import FullscreenModal from './components/FullscreenModal';
import Header from './components/Header';
import { getMethodColor, getStatusColor, formatDate } from './utils/helpers';

// Add custom CSS for accordion active state
const getStyles = (darkMode) => `
    .accordion-item:has(.accordion-collapse.show) {
        background-color: ${darkMode ? '#1a1d20' : 'aliceblue'};
    }
    
    .accordion-button:hover {
        background-color: rgba(0, 0, 0, 0.075);
    }
    
    ${darkMode ? `
        .accordion-body {
            background-color: #1a1d20 !important;
        }
    ` : ''}
`;

const RequestList = ({ data: initialData, darkMode }) => {
    const [data, setData] = useState(initialData);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [uploadError, setUploadError] = useState(null);
    const [fullscreenContent, setFullscreenContent] = useState(null);
    const [showFullscreen, setShowFullscreen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetchError, setFetchError] = useState(null);
    const [prettyPrint, setPrettyPrint] = useState(false);
    const groupByUrl = true;
    const itemsPerPage = 20;
    
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

    // Fetch requests from WireMock API
    const fetchRequests = async () => {
        if (!selectedWireMockUrl?.url) {
            setFetchError('Please select a WireMock environment from the dropdown');
            return;
        }
        setLoading(true);
        setFetchError(null);
        try {
            const WIREMOCK_API_URL = selectedWireMockUrl.url + '/requests';
            const response = await axios.get(WIREMOCK_API_URL);
            setData(response.data);
            setCurrentPage(1);
        } catch (err) {
            setFetchError('Failed to fetch requests: ' + err.message);
            console.error('Error fetching requests:', err);
        } finally {
            setLoading(false);
        }
    };

    // Clear all requests from WireMock
    const clearRequests = async () => {
        if (!selectedWireMockUrl?.url) {
            setFetchError('Please select a WireMock environment from the dropdown');
            return;
        }
        setLoading(true);
        setFetchError(null);
        try {
            const WIREMOCK_API_URL = selectedWireMockUrl.url + '/requests';
            await axios.delete(WIREMOCK_API_URL);
            setData({ requests: [] });
            setCurrentPage(1);
        } catch (err) {
            setFetchError('Failed to clear requests: ' + err.message);
            console.error('Error clearing requests:', err);
        } finally {
            setLoading(false);
        }
    };

    // Only fetch when URL changes (not on mount)
    useEffect(() => {
        if (selectedWireMockUrl?.url) {
            fetchRequests();
        }
    }, [selectedWireMockUrl]);
    
    // Handle URL selection change
    const handleUrlChange = (newUrl) => {
        setSelectedWireMockUrl(newUrl);
    };

    // Handle fullscreen modal
    const openFullscreen = (content) => {
        setFullscreenContent(content);
        setShowFullscreen(true);
    };

    const closeFullscreen = () => {
        setShowFullscreen(false);
        setFullscreenContent(null);
    };

    // Filter requests
    const filteredRequests = data?.requests?.filter(req => {
        const matchesSearch =
            req.request.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.request.method.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.id.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            filterStatus === 'all' ||
            (filterStatus === 'matched' && req.wasMatched) ||
            (filterStatus === 'unmatched' && !req.wasMatched);

        return matchesSearch && matchesStatus;
    }) || [];

    // Group by URL if enabled
    const groupedRequests = groupByUrl
        ? Object.entries(
            filteredRequests.reduce((acc, req) => {
                const url = req.request.url;
                if (!acc[url]) {
                    acc[url] = [];
                }
                acc[url].push(req);
                return acc;
            }, {})
        ).map(([url, requests]) => ({
            url,
            requests,
            count: requests.length
        }))
        : filteredRequests.map(req => ({ url: req.request.url, requests: [req], count: 1 }));

    // Pagination
    const totalPages = Math.ceil(groupedRequests.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedRequests = groupedRequests.slice(startIndex, startIndex + itemsPerPage);

    return (
        <Container fluid className="py-2">
            <style>{getStyles(darkMode)}</style>
        
            {/* Header with URL Selector, Data Source Card, and Search/Filter */}
            <Header
                selectedUrl={selectedWireMockUrl}
                onUrlChange={handleUrlChange}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                setCurrentPage={setCurrentPage}
                loading={loading}
                fetchData={fetchRequests}
                clearData={clearRequests}
                totalItems={data?.requests?.length || 0}
                uploadError={uploadError}
                fetchError={fetchError}
                setUploadError={setUploadError}
                setFetchError={setFetchError}
                showSearchFilter={true}
                endpointType="requests"
            />

            {/* Loading Spinner */}
            {loading ? (
                <div className="text-center py-5">
                    <Spinner animation="border" role="status" variant="primary">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                    <p className="mt-2 text-muted">Fetching requests from WireMock...</p>
                </div>
            ) : paginatedRequests.length === 0 ? (
                <Alert variant="info">
                    <Alert.Heading>No requests found</Alert.Heading>
                    <p>Try adjusting your search or filter criteria, or refresh data.</p>
                </Alert>
            ) : (
                <Accordion>
                    {paginatedRequests.map((group, groupIndex) => (
                        <div key={groupIndex}>
                            {groupByUrl && group.count > 1 ? (
                                // Parent collapsible group for multiple requests with same URL
                                <Card className="mb-2 shadow-sm border-primary">
                                    <Accordion.Item eventKey={`group-${groupIndex}`}>
                                        <Accordion.Header>
                                            <Container fluid>
                                                <Row className="w-100 align-items-center">
                                                    <Col xs={12} md={8}>
                                                        <strong><i className="bi bi-folder me-2"></i></strong>
                                                        <code className="text-break">{group.url}</code>
                                                    </Col>
                                                    <Col xs={12} md={4} className="text-end">
                                                        <Badge bg="primary" className="me-2">
                                                            {group.count} requests
                                                        </Badge>
                                                        <Badge bg="success">
                                                            {group.requests.filter(r => r.wasMatched).length} matched
                                                        </Badge>
                                                    </Col>
                                                </Row>
                                            </Container>
                                        </Accordion.Header>
                                        <Accordion.Body className="py-2">
                                            <Accordion>
                                                {group.requests.map((req) => (
                                                    <Card key={req.id} className="mb-1">
                                                        <Accordion.Item eventKey={req.id}>
                                                            <Accordion.Header>
                                                                <Container fluid>
                                                                    <Row className="w-100 align-items-center g-2">
                                                                        <Col xs={12} md={2}>
                                                                            <Badge bg={getMethodColor(req.request.method)}>
                                                                                {req.request.method}
                                                                            </Badge>
                                                                        </Col>
                                                                        <Col xs={6} md={3}>
                                                                            <Badge bg={getStatusColor(req.response.status)}>
                                                                                Status: {req.response.status}
                                                                            </Badge>
                                                                        </Col>
                                                                        <Col xs={6} md={3}>
                                                                            {req.wasMatched ? (
                                                                                <Badge bg="success">✓ Matched</Badge>
                                                                            ) : (
                                                                                <Badge bg="danger">✗ Not Matched</Badge>
                                                                            )}
                                                                        </Col>
                                                                        <Col xs={12} md={4}>
                                                                            <small className="text-muted">
                                                                                {formatDate(req.request.loggedDateString)}
                                                                            </small>
                                                                        </Col>
                                                                    </Row>
                                                                </Container>
                                                            </Accordion.Header>
                                                            <Accordion.Body style={{backgroundColor: darkMode ? '#1a1d20' : 'aliceblue' }} className="py-2">
                                                                <RequestDetailsCard
                                                                    req={req}
                                                                    prettyPrint={prettyPrint}
                                                                    setPrettyPrint={setPrettyPrint}
                                                                    openFullscreen={openFullscreen}
                                                                    darkMode={darkMode}
                                                                />
                                                            </Accordion.Body>
                                                        </Accordion.Item>
                                                    </Card>
                                                ))}
                                            </Accordion>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                </Card>
                            ) : (
                                // Single request (not grouped or only 1 request for this URL)
                                group.requests.map((req) => (
                                    <Card key={req.id} className="mb-2 shadow-sm">
                                        <Accordion.Item eventKey={req.id}>
                                            <Accordion.Header>
                                                <RequestHeader req={req} />
                                            </Accordion.Header>
                                            <Accordion.Body className="py-2">
                                                <RequestDetailsCard
                                                    req={req}
                                                    prettyPrint={prettyPrint}
                                                    setPrettyPrint={setPrettyPrint}
                                                    openFullscreen={openFullscreen}
                                                    darkMode={darkMode}
                                                />
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    </Card>
                                ))
                            )}
                        </div>
                    ))}
                </Accordion>
            )}

            {/* Pagination */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
            />

            {/* Footer Stats */}
            <StatsFooter
                filteredRequests={filteredRequests}
                currentPage={currentPage}
                totalPages={totalPages}
                darkMode={darkMode}
            />

            {/* Fullscreen Modal */}
            <FullscreenModal
                show={showFullscreen}
                onHide={closeFullscreen}
                content={fullscreenContent}
                darkMode={darkMode}
            />
        </Container>
    );
};

export default RequestList;
