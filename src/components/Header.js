import React from 'react';
import { Row, Col } from 'react-bootstrap';
import URLSelector from './URLSelector';
import SearchAndFilter from './SearchAndFilter';
import DataSourceCard from './DataSourceCard';

const Header = ({ 
    // URL Selector props
    selectedUrl,
    onUrlChange,
    
    // Search and Filter props
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    setCurrentPage,
    
    // Data Source Card props
    loading,
    fetchData,
    clearData,
    totalItems,
    uploadError,
    fetchError,
    setUploadError,
    setFetchError,
    
    // Optional: hide search/filter for mappings
    showSearchFilter = true,
    
    // Endpoint type for display
    endpointType = 'requests'
}) => {
    return (
        <>
            {/* Environment Selector */}
            <Row className="mb-3">
                <Col md={4}>
                    <URLSelector 
                        selectedUrl={selectedUrl}
                        onUrlChange={onUrlChange}
                    />
                </Col>
                <Col md={8} className="d-flex align-items-center">
                    <small className="text-muted">
                        <i className="bi bi-info-circle me-2"></i>
                        Selected: <strong>{selectedUrl?.name}</strong>
                    </small>
                </Col>
            </Row>

            {/* Data Source Section */}
            <DataSourceCard
                loading={loading}
                fetchRequests={fetchData}
                clearRequests={clearData}
                apiUrl={selectedUrl?.url}
                totalRequests={totalItems}
                uploadError={uploadError}
                fetchError={fetchError}
                setUploadError={setUploadError}
                setFetchError={setFetchError}
                endpointType={endpointType}
            />

            {/* Filter and Search Bar - Optional */}
            {showSearchFilter && (
                <SearchAndFilter
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    filterStatus={filterStatus}
                    setFilterStatus={setFilterStatus}
                    setCurrentPage={setCurrentPage}
                />
            )}
        </>
    );
};

export default Header;
