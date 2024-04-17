# link-manager

A simple tool to manage shorted links like bit.ly or tinyurl.com.

## Installation

This project is available as a docker image in [Docker Hub](https://hub.docker.com/r/lpsouza/link-manager). To simplify the installation, you can use the `docker-compose.yml` file below:

```yaml
version: '3'
services:
    mongo:
        image: mongo
        networks:
            - link-manager-network

    link-manager:
        image: lpsouza/link-manager
        ports:
            - "3000:3000"
        environment:
            - CONNECTION_STRING=mongodb://mongo:27017
            - REDIRECT_URL=http://another-url.com
            - REDIRECT_404_URL=http://another-url.com
            - SHORTNER_URL=http://localhost:3000
            - AUTH_TOKEN=1234567890
        networks:
            - link-manager-network
        restart: unless-stopped

networks:
    link-manager-network:
```

To start the services, run the following command:

```bash
docker-compose up -d
```

## Usage

### Create a new shorted link

Create a new shorted link `http://localhost:3000/test` to `https://test.com`:

```bash
export BASE64_AUTH_TOKEN=$(echo -n "1234567890" | base64) && \
curl -X POST -H "Content-Type: application/json" -H "Authorization: Basic $BASE64_AUTH_TOKEN" -d '{"name": "test", "url": "https://test.com"}' http://localhost:3000/alias
```

Create a new shorted link with a random shorted name to `https://test.com`:

```bash
export BASE64_AUTH_TOKEN=$(echo -n "1234567890" | base64) && \
curl -X POST -H "Content-Type: application/json" -H "Authorization: Basic $BASE64_AUTH_TOKEN" -d '{"url": "https://test.com"}' http://localhost:3000/alias
```

### Get statistics

```bash
export BASE64_AUTH_TOKEN=$(echo -n "1234567890" | base64) && \
curl -X GET -H "Authorization: Basic $BASE64_AUTH_TOKEN" http://localhost:3000/status
```
