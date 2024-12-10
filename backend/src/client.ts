// client.ts
import WebSocket from 'ws';

const ws = new WebSocket('ws://localhost:3000');

ws.on('open', () => {
    console.log('Connected to server');
    
    // Send a test message
    ws.send(JSON.stringify({
        message: 'Hello from client!'
    }));
});

ws.on('message', (data) => {
    console.log('Received:', data.toString());
});

ws.on('close', () => {
    console.log('Disconnected from server');
});
