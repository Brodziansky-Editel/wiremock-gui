import React from 'react';
import { Button } from 'react-bootstrap';

const DarkModeToggle = ({ darkMode, setDarkMode }) => {
    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        // Save preference to localStorage
        localStorage.setItem('darkMode', (!darkMode).toString());
    };

    return (
        <Button 
            variant={darkMode ? 'light' : 'dark'} 
            size="sm"
            onClick={toggleDarkMode}
            className="d-flex align-items-center"
        >
            <i className={`bi bi-${darkMode ? 'sun-fill' : 'moon-fill'} me-2`}></i>
            {darkMode ? 'Light Mode' : 'Dark Mode'}
        </Button>
    );
};

export default DarkModeToggle;
