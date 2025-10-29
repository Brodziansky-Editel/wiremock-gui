import React, { useState, useEffect } from 'react';
import RequestList from './RequestList';
import MappingsList from './components/MappingsList';
import DarkModeToggle from './components/DarkModeToggle';
import { Container, Row, Col, ButtonGroup, Button } from 'react-bootstrap';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('requests');
  const [darkMode, setDarkMode] = useState(() => {
    // Get dark mode preference from localStorage
    const savedMode = localStorage.getItem('darkMode');
    return savedMode === 'true';
  });

  // Apply dark mode to body element
  useEffect(() => {
    if (darkMode) {
      document.body.setAttribute('data-bs-theme', 'dark');
      document.body.style.backgroundColor = '#212529';
      document.body.style.color = '#dee2e6';
    } else {
      document.body.removeAttribute('data-bs-theme');
      document.body.style.backgroundColor = '#ffffff';
      document.body.style.color = '#000000';
    }
  }, [darkMode]);

  const requestData = {
    "requests": []
  };

  return (
    <div className="App" >
      <Container fluid className="py-2"  style={{ margin: '10px 20px -20px -10px' }}>
        {/* View Switcher and Dark Mode Toggle */}
        <Row className="mb-3">
          <Col xs={12} className="d-flex justify-content-between align-items-center">
            <div style={{ flex: 1 }}></div>
            <ButtonGroup>
              <Button 
                variant={currentView === 'requests' ? 'primary' : 'outline-primary'}
                onClick={() => setCurrentView('requests')}
              >
                <i className="bi bi-file-earmark-text me-2"></i>
                Requests
              </Button>
              <Button 
                variant={currentView === 'mappings' ? 'primary' : 'outline-primary'}
                onClick={() => setCurrentView('mappings')}
              >
                <i className="bi bi-diagram-3 me-2"></i>
                Mappings
              </Button>
            </ButtonGroup>
            <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
              <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
            </div>
          </Col>
        </Row>
      </Container>

      {/* Render appropriate view */}
      {currentView === 'requests' ? (
        <RequestList  data={requestData} darkMode={darkMode} />
      ) : (
        <MappingsList darkMode={darkMode} />
      )}
    </div>
  );
}

export default App;