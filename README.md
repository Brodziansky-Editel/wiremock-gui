# WireMock GUI

A React-based web interface for visualizing and managing WireMock requests and stub mappings. Designed specifically for QA teams working with multiple WireMock instances.

## Purpose

This tool provides a clean, intuitive interface for QA teams to:
- Monitor HTTP requests captured by WireMock
- View and manage stub mappings
- Clean up test data between test runs
- Work efficiently with multiple WireMock environments

## Key Features

### Multiple Environment Support
- Configure multiple WireMock instances in a single `.env` file
- Quick switching between environments via dropdown selector
- Cookie-based environment selection persistence

### Request Visualization
- Grouped accordion view for requests with the same URL
- Detailed request/response inspection
- Headers, body, and timing information display
- Pretty-print JSON formatting with toggle
- Fullscreen view for large payloads
- Filter by matched/unmatched requests
- Search by URL, method, or ID
- Pagination for large datasets

### Mappings Management
- View all configured stub mappings
- Inspect request matching rules
- Review response definitions
- Pretty-printed JSON display

### Cleanup Functionality
- Clear all requests with confirmation dialog
- Clear all mappings with confirmation dialog
- Essential for maintaining clean test environments between test runs

### Dark Mode
- Toggle between light and dark themes
- Theme preference saved to browser

## Configuration

Create a `.env` file in the project root with your WireMock instances:

```env
REACT_APP_WIREMOCK_URL_1=Stage|https://wiremock.stage.example.com/__admin
REACT_APP_WIREMOCK_URL_2=QA01|https://wiremock.qa01.example.com/__admin
REACT_APP_WIREMOCK_URL_3=QA02|https://wiremock.qa02.example.com/__admin
REACT_APP_WIREMOCK_URL_4=QA03|https://wiremock.qa03.example.com/__admin
REACT_APP_WIREMOCK_URL_5=QA04|https://wiremock.qa04.example.com/__admin
```

Format: `REACT_APP_WIREMOCK_URL_N=Name|BaseURL`

**Important:** URLs should end with `/__admin` (not `/__admin/requests` or `/__admin/mappings`)

## Installation

```bash
npm install
```

## Running Locally

```bash
npm start
```

The application will open at `http://localhost:3000`

## Building for Production

```bash
npm run build
```

## Docker Deployment

Build the Docker image:

```bash
docker build -t wiremock-gui .
```

Run the container:

```bash
docker run -p 8080:80 wiremock-gui
```

Access at `http://localhost:8080`

## Technology Stack

- React 18
- Bootstrap 5.3 with React-Bootstrap
- Axios for HTTP requests
- js-cookie for state persistence
- Bootstrap Icons

## Typical QA Workflow

1. Select your WireMock environment from the dropdown
2. Click "Requests" to view captured HTTP traffic
3. Use grouping and filtering to find specific requests
4. Inspect request/response details including headers, bodies, and timing
5. Switch to "Mappings" to review configured stubs
6. Use "Clear" button to clean up data between test runs
7. Switch environments as needed without losing your place

## Browser Compatibility

Tested on modern browsers:
- Chrome
- Firefox
- Safari
- Edge

## License

MIT

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
