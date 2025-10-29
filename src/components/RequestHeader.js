import React from 'react';
import { Container, Row, Col, Badge } from 'react-bootstrap';
import { getMethodColor, getStatusColor, formatDate } from '../utils/helpers';

const RequestHeader = ({ req }) => {
    return (
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
    );
};

export default RequestHeader;
