#!/bin/sh

# Start Node.js application in the background
cd /app && npm start &

# Start Nginx in the foreground
nginx -g 'daemon off;'
