import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const FullscreenModal = ({ show, onHide, content, darkMode }) => {
    return (
        <Modal
            show={show}
            onHide={onHide}
            size="xl"
            fullscreen="lg-down"
        >
            <Modal.Header closeButton>
                <Modal.Title>Body - Fullscreen View</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ maxHeight: '80vh', overflow: 'auto' }}>
                <pre className="p-3 rounded mb-0" style={{ fontSize: '14px', backgroundColor: darkMode ? '#2b3035' : '#f8f9fa' }}>
                    <code>{content}</code>
                </pre>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Close
                </Button>
                <Button
                    variant="primary"
                    onClick={() => {
                        navigator.clipboard.writeText(content);
                    }}
                >
                    <i className="bi bi-clipboard me-2"></i>Copy to Clipboard
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default FullscreenModal;
