import React from 'react';
import { Row, Col, InputGroup, Form, Button } from 'react-bootstrap';

const SearchAndFilter = ({ searchTerm, setSearchTerm, filterStatus, setFilterStatus, setCurrentPage }) => {
    return (
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
    );
};

export default SearchAndFilter;
