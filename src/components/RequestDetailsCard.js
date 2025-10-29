import React from 'react';
import { Card, Badge, Accordion, Table, Button, Row, Col } from 'react-bootstrap';
import { getStatusColor, formatBody } from '../utils/helpers';

const RequestDetailsCard = ({ req, prettyPrint, setPrettyPrint, openFullscreen, darkMode }) => {
    return (
        <>
            {/* Request Details */}
            <Card className="mb-1">
                <Card.Header style={{ backgroundColor: darkMode ? '#1a3a52' : '#e7f3ff' }} className="py-1">
                    <strong><i className="bi bi-box-arrow-up me-2"></i>Request Details</strong>
                </Card.Header>
                <Card.Body className="py-2">
                    <Row>
                        <Col>
                            <p className="mb-1">
                                <span style={{ whiteSpace: 'nowrap', paddingRight: '8px' }}><strong>ID:</strong> <code>{req.id}</code></span>{' '}
                                <span style={{ whiteSpace: 'nowrap', paddingRight: '8px' }}><strong>Absolute URL:</strong> <code><a className="text-decoration-none" href={req.request.absoluteUrl} target="_blank" rel="noreferrer">{req.request.absoluteUrl}</a></code></span>{' '}
                                <span style={{ whiteSpace: 'nowrap', paddingRight: '8px' }}><strong>Client IP:</strong> <code>{req.request.clientIp}</code></span>{' '}
                                <span style={{ whiteSpace: 'nowrap', paddingRight: '8px' }}><strong>Protocol:</strong> <code>{req.request.protocol}</code></span>{' '}
                                <span style={{ whiteSpace: 'nowrap', paddingRight: '8px' }}><strong>Host:</strong> <code>{req.request.host}:{req.request.port}</code></span>
                            </p>
                        </Col>
                    </Row>

                    {/* Request Headers */}
                    <div className="mt-2 p-2" style={{ backgroundColor: darkMode ? '#1a3a52' : '#f0f0f0' }}>
                        <strong className='text-muted'><i className="bi bi-list-ul me-2"></i>Headers</strong>
                        <Badge bg="info" className="ms-2">
                            {Object.keys(req.request.headers).length}
                        </Badge>
                        <Table striped bordered hover size="sm" responsive className="mt-2 mb-0">
                            <tbody>
                                {Object.entries(req.request.headers).map(([key, value]) => (
                                    <tr style={{ whiteSpace: 'nowrap'}} key={key}>
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
                                            {prettyPrint ? 'Raw' : 'Pretty'}
                                        </Button>
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            onClick={() => openFullscreen(formatBody(req.request.body, prettyPrint))}
                                        >
                                            <i className="bi bi-arrows-fullscreen me-2"></i>Fullscreen
                                        </Button>
                                    </div>
                                    <pre className="p-2 rounded mb-0" style={{ maxHeight: '300px', overflow: 'auto', backgroundColor: darkMode ? '#2b3035' : '#f8f9fa' }}>
                                        <code>{formatBody(req.request.body, prettyPrint)}</code>
                                    </pre>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    )}
                </Card.Body>
            </Card>

            {/* Response Details */}
            <Card className="mb-2">
                <Card.Header style={{ backgroundColor: darkMode ? '#1a3a52' : '#e7f3ff' }} className="py-1">
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
                        <div className="mt-2 p-2" style={{ backgroundColor: darkMode ? '#1a3a52' : '#f0f0f0' }}>
                            <strong className='text-muted'><i className="bi bi-list-ul me-2"></i>Response Headers</strong>
                            <Badge bg="info" className="ms-2">
                                {Object.keys(req.response.headers).length}
                            </Badge>
                            <Table striped bordered hover size="sm" responsive className="mt-2 mb-0">
                                <tbody>
                                    {Object.entries(req.response.headers).map(([key, value]) => (
                                        <tr  key={key}>
                                            <td style={{whiteSpace: 'nowrap', paddingRight: '12px',paddingLeft: '12px'}} className='text-monospace'>{key}</td>
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
                                            {prettyPrint ? 'Raw': 'Pretty'}
                                        </Button>
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            onClick={() => openFullscreen(formatBody(req.response.body, prettyPrint))}
                                        >
                                            <i className="bi bi-arrows-fullscreen me-2"></i>Fullscreen
                                        </Button>
                                    </div>
                                    <pre className="p-2 rounded mb-0" style={{ maxHeight: '300px', overflow: 'auto', backgroundColor: darkMode ? '#2b3035' : '#f8f9fa' }}>
                                        <code>{formatBody(req.response.body, prettyPrint)}</code>
                                    </pre>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    )}
                </Card.Body>
            </Card>
        </>
    );
};

export default RequestDetailsCard;
