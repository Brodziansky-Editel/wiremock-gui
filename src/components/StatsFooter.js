import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';

const StatsFooter = ({ filteredRequests, currentPage, totalPages, darkMode }) => {
    return (
        <Row className="mt-4">
            <Col>
                <Card className={darkMode ? 'bg-dark' : 'bg-light'}>
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
    );
};

export default StatsFooter;
