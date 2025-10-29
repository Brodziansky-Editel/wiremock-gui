import React, { useState } from 'react';
import { Row, Col, Card, Button, Alert, Modal } from 'react-bootstrap';

const DataSourceCard = ({ 
    loading, 
    fetchRequests,
    clearRequests,
    apiUrl, 
    totalRequests, 
    uploadError, 
    fetchError, 
    setUploadError, 
    setFetchError,
    endpointType = 'requests' // 'requests' or 'mappings'
}) => {
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const handleClearClick = () => {
        setShowConfirmModal(true);
    };

    const handleConfirmClear = () => {
        setShowConfirmModal(false);
        clearRequests();
    };

    const handleCancelClear = () => {
        setShowConfirmModal(false);
    };

    return (
        <>
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
                                        <Button 
                                            variant="danger" 
                                            onClick={handleClearClick}
                                            disabled={loading}
                                        >
                                            <i className="bi bi-trash me-2"></i>
                                            Clear
                                        </Button>
                                    </div>
                                </Col>
                                <Col md={4} className="text-center">
                                    <small >Source: <a href={apiUrl + '/' + endpointType} target="_blank" rel="noopener noreferrer">{apiUrl + '/' + endpointType}</a></small>
                                </Col>
                                <Col md={4} className="text-end">
                                    <div>
                                        <small className="text-muted">Total Requests:</small>
                                        <h3 className="mb-0">{totalRequests}</h3>
                                    </div>
                                </Col>
                            </Row>
                            {(uploadError || fetchError) && (
                                <Alert variant="danger" className="mt-3 mb-0" dismissible onClose={() => { 
                                    setUploadError(null); 
                                    setFetchError(null); 
                                }}>
                                    {uploadError || fetchError}
                                </Alert>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Confirmation Modal */}
            <Modal show={showConfirmModal} onHide={handleCancelClear} centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <i className="bi bi-exclamation-triangle text-warning me-2"></i>
                        Confirm Clear
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="mb-2">Are you sure you want to clear all requests from WireMock?</p>
                    <p className="text-muted mb-0">
                        <small>
                            <i className="bi bi-info-circle me-1"></i>
                            This will delete <strong>{totalRequests} request{totalRequests !== 1 ? 's' : ''}</strong> from the WireMock instance. This action cannot be undone.
                        </small>
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCancelClear}>
                        <i className="bi bi-x-circle me-2"></i>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleConfirmClear}>
                        <i className="bi bi-trash me-2"></i>
                        Yes, Clear All
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default DataSourceCard;
