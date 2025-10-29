#!/bin/bash

# Load .env file and build Docker image with environment variable
docker build \
  --build-arg REACT_APP_WIREMOCK_URLS="$(grep REACT_APP_WIREMOCK_URLS .env | cut -d '=' -f2-)" \
  -t wiremock-gui .
