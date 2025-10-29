import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import {
    Container,
    Card,
    Badge,
    Accordion,
    Table,
    Button,
    Row,
    Col,
    Form,
    InputGroup,
    Alert,
    Modal
} from 'react-bootstrap';

// Add custom CSS for accordion active state
const styles = `
    .accordion-item:has(.accordion-collapse.show) {
        background-color: aliceblue;
    }
    
    .accordion-button:hover {
        background-color: rgba(0, 0, 0, 0.075);
    }
`;

const RequestList = ({ data: initialData }) => {
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
    const WIREMOCK_API_URL = 'https://wiremock.stage.exite.net/__admin/requests';

    // Fetch requests from WireMock API
    const fetchRequests = async () => {
        setLoading(true);
        setFetchError(null);
        try {
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

    // Fetch data on component mount
    useEffect(() => {
        fetchRequests();
    }, []);

    // Handle fullscreen modal
    const openFullscreen = (content) => {
        setFullscreenContent(content);
        setShowFullscreen(true);
    };

    const closeFullscreen = () => {
        setShowFullscreen(false);
        setFullscreenContent(null);
    };

    // Pretty print JSON
    const prettyPrintJson = (body) => {
        try {
            const parsed = JSON.parse(body);
            return JSON.stringify(parsed, null, 2);
        } catch (e) {
            return body; // Return as-is if not valid JSON
        }
    };

    // Format body based on pretty print toggle
    const formatBody = (body) => {
        return prettyPrint ? prettyPrintJson(body) : body;
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

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    // Get method badge color
    const getMethodColor = (method) => {
        const colors = {
            'GET': 'primary',
            'POST': 'success',
            'PUT': 'warning',
            'DELETE': 'danger',
            'PATCH': 'info'
        };
        return colors[method] || 'secondary';
    };

    // Get status badge color
    const getStatusColor = (status) => {
        if (status >= 200 && status < 300) return 'success';
        if (status >= 300 && status < 400) return 'info';
        if (status >= 400 && status < 500) return 'warning';
        if (status >= 500) return 'danger';
        return 'secondary';
    };

    // Render request details (extracted for reuse)
    const renderRequestDetails = (req) => (
        <>
            {/* Request Details */}
            <Card className="mb-1">
                <Card.Header className="bg-light py-1">
                    <strong><i className="bi bi-box-arrow-up me-2"></i>Request Details</strong>
                </Card.Header>
                <Card.Body className="py-2">
                    <Row>
                        <Col>
                            <p className="mb-1">
                                <span style={{ whiteSpace: 'nowrap', paddingRight: '8px' }}><strong>ID:</strong> <code>{req.id}</code></span>{' '}
                                <span style={{ whiteSpace: 'nowrap', paddingRight: '8px' }}><strong>Absolute URL:</strong> <code><a className="text-decoration-none" href={req.request.absoluteUrl} target="_blank" >{req.request.absoluteUrl}</a></code></span>{' '}
                                <span style={{ whiteSpace: 'nowrap', paddingRight: '8px' }}><strong>Client IP:</strong> <code>{req.request.clientIp}</code></span>{' '}
                                <span style={{ whiteSpace: 'nowrap', paddingRight: '8px' }}><strong>Protocol:</strong> <code>{req.request.protocol}</code></span>{' '}
                                <span style={{ whiteSpace: 'nowrap', paddingRight: '8px' }}><strong>Host:</strong> <code>{req.request.host}:{req.request.port}</code></span>
                            </p>
                        </Col>
                    </Row>

                    {/* Request Headers */}
                    <div className="mt-2 bg-light p-2">
                        <strong className='text-muted'><i className="bi bi-list-ul me-2"></i>Headers</strong>
                        <Badge bg="info" className="ms-2">
                            {Object.keys(req.request.headers).length}
                        </Badge>
                        <Table striped bordered hover size="sm" responsive className="mt-2 mb-0">

                            <tbody>
                                {Object.entries(req.request.headers).map(([key, value]) => (
                                    <tr key={key}>
                                        <td className='font-monospace'>{key}</td>
                                        <td className="text-break">
                                            <code>{value}</code>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>

                    {/* Request Body */}
                    {req.request.body && (
                        <Accordion className="mt-2">
                            <Accordion.Item eventKey="request-body">
                                <Accordion.Header>
                                    <strong><i className="bi bi-file-earmark-text me-2"></i>Request Body</strong>
                                </Accordion.Header>
                                <Accordion.Body className="py-2">
                                    <div className="d-flex justify-content-end gap-2 mb-1">
                                        <Button
                                            variant={prettyPrint ? "outline-secondary" : "primary"}
                                            size="sm"
                                            onClick={() => setPrettyPrint(!prettyPrint)}
                                        >
                                            <i className={`bi ${prettyPrint ? 'bi-code-slash' : 'bi-code'} me-2`}></i>
                                            {prettyPrint ?  'Pretty': 'Raw' }
                                        </Button>
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            onClick={() => openFullscreen(formatBody(req.request.body))}
                                        >
                                            <i className="bi bi-arrows-fullscreen me-2"></i>Fullscreen
                                        </Button>
                                    </div>
                                    <pre className="bg-light p-2 rounded mb-0" style={{ maxHeight: '300px', overflow: 'auto' }}>
                                        <code>{formatBody(req.request.body)}</code>
                                    </pre>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    )}
                </Card.Body>
            </Card>

            {/* Response Details */}
            <Card className="mb-2">
                <Card.Header className="bg-light py-1">
                    <strong><i className="bi bi-box-arrow-down me-2"></i>Response Details</strong>
                </Card.Header>
                <Card.Body className="py-2">
                    <Row className="mb-2">
                        <Col md={2}>
                            <p className="mb-0">
                                <>Status:</>{' '}
                                <Badge bg={getStatusColor(req.response.status)}>
                                    {req.response.status}
                                </Badge>
                            </p>
                        </Col>
                        <Col md={2}>
                            <p className="mb-0"><>From Configured Stub:</>{' '}
                                {req.responseDefinition.fromConfiguredStub ? '✓ Yes' : '✗ No'}
                            </p>
                        </Col>
                    </Row>
                    {/* Timing Information */}
                    <Row className="mt-2 pt-2 border-top">
                        <Col xs={2}>
                            <strong><i className="bi bi-clock me-2"></i>Timing:</strong>
                        </Col>
                        <Col md={2}>
                            <small><>Process:</> {req.timing.processTime}ms</small>
                        </Col>
                        <Col md={2}>
                            <small><>Serve:</> {req.timing.serveTime}ms</small>
                        </Col>
                        <Col md={2}>
                            <small><>Response Send:</> {req.timing.responseSendTime}ms</small>
                        </Col>
                        <Col md={2}>
                            <small><>Total:</> {req.timing.totalTime}ms</small>
                        </Col>
                    </Row>

                    {/* Stub Mapping */}
                    {req.stubMapping && (
                        <Row style={{ padding: '8px 0' }} className="mt-2 pt-2 border-top">
                            <Col xs={2}>
                                <strong><i className="bi bi-gear me-2"></i>Stub Mapping:</strong>
                            </Col>
                            <Col md={3}>
                                <small style={{ whiteSpace: 'nowrap' }}><strong style={{ padding: '0 4px' }}>Stub ID:</strong> <code>{req.stubMapping.id}</code></small>
                            </Col>
                            {req.stubMapping.metadata?.name && (
                                <Col md={3}>
                                    <small><strong style={{ padding: '0 4px' }}>Name:</strong> <code>{req.stubMapping.metadata.name}</code></small>
                                </Col>
                            )}
                            <Col md={3}>
                                <small><strong style={{ padding: '0 4px' }}>Persistent:</strong> {req.stubMapping.persistent ? '✓ Yes' : '✗ No'}</small>
                            </Col>
                            
                        </Row>
                    )}

                    {/* Response Headers */}
                    {req.response.headers && Object.keys(req.response.headers).length > 0 && (
                        <div className="mt-2 bg-light p-2">
                            <strong className='text-muted'><i className="bi bi-list-ul me-2"></i>Response Headers</strong>
                            <Badge bg="info" className="ms-2">
                                {Object.keys(req.response.headers).length}
                            </Badge>
                            <Table striped bordered hover size="sm" responsive className="mt-2 mb-0">
                                <tbody>
                                    {Object.entries(req.response.headers).map(([key, value]) => (
                                        <tr key={key}>
                                            <td className='text-monospace'>{key}</td>
                                            <td><code>{value}</code></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    )}

                    {/* Response Body */}
                    {req.response.body && (
                        <Accordion className="mt-2">
                            <Accordion.Item eventKey="response-body">
                                <Accordion.Header>
                                    <strong><i className="bi bi-file-earmark-text me-2"></i>Response Body</strong>
                                </Accordion.Header>
                                <Accordion.Body className="py-2">
                                    <div className="d-flex justify-content-end gap-2 mb-1">
                                        <Button
                                            variant={prettyPrint ? "outline-secondary" : "primary"}
                                            size="sm"
                                            onClick={() => setPrettyPrint(!prettyPrint)}
                                        >
                                            <i className={`bi ${prettyPrint ? 'bi-code-slash' : 'bi-code'} me-2`}></i>
                                            {prettyPrint ? 'Raw' : 'Pretty'}
                                        </Button>
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            onClick={() => openFullscreen(formatBody(req.response.body))}
                                        >
                                            <i className="bi bi-arrows-fullscreen me-2"></i>Fullscreen
                                        </Button>
                                    </div>
                                    <pre className="bg-light p-2 rounded mb-0" style={{ maxHeight: '300px', overflow: 'auto' }}>
                                        <code>{formatBody(req.response.body)}</code>
                                    </pre>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    )}



                </Card.Body>
            </Card>
        </>
    );

    return (
        <Container fluid className="py-2">
            <Row className="mb-2">
                <Col>
                    <h1 className="mb-2">
                        <i className="bi bi-search me-2"></i>Request Monitor Dashboard
                        <Badge bg="secondary" className="ms-3">{filteredRequests.length} requests</Badge>
                    </h1>
                </Col>
            </Row>

            {/* Data Source Section */}
            <Row className="mb-2">
                <Col>
                    <Card className="shadow-sm">
                        <Card.Body className="py-2">
                            <Row className="align-items-center">
                                <Col md={4}>
                                    <div className="d-flex align-items-center gap-2">
                                        <Button 
                                            variant="primary" 
                                            onClick={fetchRequests}
                                            disabled={loading}
                                        >
                                            <i className="bi bi-arrow-clockwise me-2"></i>
                                            {loading ? 'Refreshing...' : 'Refresh'}
                                        </Button>
                                    </div>
                                </Col>
                                <Col md={4} className="text-center">
                                    <small className="text-muted">Source: {WIREMOCK_API_URL}</small>
                                </Col>
                                <Col md={4} className="text-end">
                                    <div>
                                        <small className="text-muted">Total Requests:</small>
                                        <h3 className="mb-0">{data?.requests?.length || 0}</h3>
                                    </div>
                                </Col>
                            </Row>
                            {(uploadError || fetchError) && (
                                <Alert variant="danger" className="mt-3 mb-0" dismissible onClose={() => { setUploadError(null); setFetchError(null); }}>
                                    {uploadError || fetchError}
                                </Alert>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Filter and Search Bar */}
            <Row className="mb-2">
                <Col md={8}>
                    <InputGroup>
                        <InputGroup.Text>
                            <i className="bi bi-search"></i>
                        </InputGroup.Text>
                        <Form.Control
                            type="text"
                            placeholder="Search by URL, method, or ID..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                        {searchTerm && (
                            <Button variant="outline-secondary" onClick={() => setSearchTerm('')}>
                                Clear
                            </Button>
                        )}
                    </InputGroup>
                </Col>
                <Col md={4}>
                    <Form.Select
                        value={filterStatus}
                        onChange={(e) => {
                            setFilterStatus(e.target.value);
                            setCurrentPage(1);
                        }}
                    >
                        <option value="all">All Requests</option>
                        <option value="matched">✓ Matched Only</option>
                        <option value="unmatched">✗ Unmatched Only</option>
                    </Form.Select>
                </Col>
            </Row>

            {/* Request Cards */}
            {paginatedRequests.length === 0 ? (
                <Alert variant="info">
                    <Alert.Heading>No requests found</Alert.Heading>
                    <p>Try adjusting your search or filter criteria, or upload a new JSON file.</p>
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
                                                            <Accordion.Body style={{backgroundColor: 'aliceblue' }} className="py-2">
                                                                {/* Request details content stays the same */}
                                                                {renderRequestDetails(req)}
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
                                                <Container fluid>
                                                    <Row className="w-100 align-items-center g-2">
                                                        <Col xs={12} md={1}>
                                                            <Badge bg={getMethodColor(req.request.method)}>
                                                                {req.request.method}
                                                            </Badge>
                                                        </Col>
                                                        <Col xs={12} md={5}>
                                                            <code className="text-break">{req.request.url}</code>
                                                        </Col>
                                                        <Col xs={6} md={2}>
                                                            <Badge bg={getStatusColor(req.response.status)}>
                                                                Status: {req.response.status}
                                                            </Badge>
                                                        </Col>
                                                        <Col xs={6} md={2}>
                                                            {req.wasMatched ? (
                                                                <Badge bg="success">✓ Matched</Badge>
                                                            ) : (
                                                                <Badge bg="danger">✗ Not Matched</Badge>
                                                            )}
                                                        </Col>
                                                        <Col xs={12} md={2}>
                                                            <small className="text-muted">
                                                                {formatDate(req.request.loggedDateString)}
                                                            </small>
                                                        </Col>
                                                    </Row>
                                                </Container>
                                            </Accordion.Header>

                                            <Accordion.Body className="py-2">
                                                {renderRequestDetails(req)}
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
            {totalPages > 1 && (
                <Row className="mt-4">
                    <Col className="d-flex justify-content-center">
                        <nav>
                            <ul className="pagination">
                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                    <Button
                                        variant="outline-primary"
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                    >
                                        ← Previous
                                    </Button>
                                </li>

                                {/* Show page numbers */}
                                {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                                    let pageNum;
                                    if (totalPages <= 5) {
                                        pageNum = i + 1;
                                    } else if (currentPage <= 3) {
                                        pageNum = i + 1;
                                    } else if (currentPage >= totalPages - 2) {
                                        pageNum = totalPages - 4 + i;
                                    } else {
                                        pageNum = currentPage - 2 + i;
                                    }

                                    return (
                                        <li key={pageNum} className="mx-1">
                                            <Button
                                                variant={currentPage === pageNum ? 'primary' : 'outline-primary'}
                                                onClick={() => setCurrentPage(pageNum)}
                                            >
                                                {pageNum}
                                            </Button>
                                        </li>
                                    );
                                })}

                                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                    <Button
                                        variant="outline-primary"
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                        disabled={currentPage === totalPages}
                                    >
                                        Next →
                                    </Button>
                                </li>
                            </ul>
                        </nav>
                    </Col>
                </Row>
            )}

            {/* Footer Stats */}
            <Row className="mt-4">
                <Col>
                    <Card className="bg-light">
                        <Card.Body>
                            <Row className="text-center">
                                <Col md={3}>
                                    <h5>{filteredRequests.length}</h5>
                                    <small className="text-muted">Total Filtered</small>
                                </Col>
                                <Col md={3}>
                                    <h5>{filteredRequests.filter(r => r.wasMatched).length}</h5>
                                    <small className="text-muted">Matched</small>
                                </Col>
                                <Col md={3}>
                                    <h5>{filteredRequests.filter(r => !r.wasMatched).length}</h5>
                                    <small className="text-muted">Unmatched</small>
                                </Col>
                                <Col md={3}>
                                    <h5>Page {currentPage} of {totalPages}</h5>
                                    <small className="text-muted">Pagination</small>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Fullscreen Modal */}
            <Modal
                show={showFullscreen}
                onHide={closeFullscreen}
                size="xl"
                fullscreen="lg-down"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Response Body - Fullscreen View</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ maxHeight: '80vh', overflow: 'auto' }}>
                    <pre className="bg-light p-3 rounded mb-0" style={{ fontSize: '14px' }}>
                        <code>{fullscreenContent}</code>
                    </pre>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeFullscreen}>
                        Close
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => {
                            navigator.clipboard.writeText(fullscreenContent);
                        }}
                    >
                        <i className="bi bi-clipboard me-2"></i>Copy to Clipboard
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default RequestList;