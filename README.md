# link-manager

A simple tool to manage shorted links like bit.ly or tinyurl.com.

## Installation

Before running the Docker container, you need to create a network:

```bash
docker network create lm-network
```

After that, you need to run a MongoDB container:

```bash
docker run -d --net lm-network --name mongo mongo
```

Then you can run the application:

```bash
docker run -d -p "3000:3000" --name link-manager \
-e "CONNECTION_STRING=mongodb://mongo:27017" \
-e "REDIRECT_URL=http://another-url.com" \
-e "REDIRECT_404_URL=http://another-url.com" \
-e "SHORTNER_URL=http://localhost:3000" \
-e "AUTH_TOKEN=1234567890" \
--net lm-network \
--restart unless-stopped \
lpsouza/link-manager
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
