// server.ts
import express from 'express';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import { createClient } from 'redis';
import { DynamoDB } from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Express
const app = express();
const server = createServer(app);

// Initialize WebSocket Server
const wss = new WebSocketServer({ server });

// Initialize Redis Client
// const redisClient = createClient({
//     url: process.env.REDIS_URL
// });

// // Initialize DynamoDB Client
// const dynamoDB = new DynamoDB.DocumentClient({
//     region: process.env.AWS_REGION,
//     credentials: {
//         accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
//         secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
//     }
// });

// // Connect to Redis
// async function connectToRedis() {
//     try {
//         await redisClient.connect();
//         console.log('Connected to Redis');
//     } catch (error) {
//         console.error('Redis connection error:', error);
//     }
// }

// connectToRedis();

// WebSocket connection handling
wss.on('connection', (ws) => {
    console.log('New WebSocket connection');

    ws.on('message', async (message) => {
        try {
            const data = JSON.parse(message.toString());
            
            // Example: Store message in DynamoDB
            const params = {
                TableName: process.env.DYNAMODB_TABLE!,
                Item: {
                    id: Date.now().toString(),
                    message: data.message,
                    timestamp: new Date().toISOString()
                }
            };

            // await dynamoDB.put(params).promise();

            // Example: Cache in Redis
            // await redisClient.set(`message:${params.Item.id}`, JSON.stringify(data));

            // Broadcast message to all connected clients
            wss.clients.forEach((client) => {
                if (client !== ws && client.readyState === ws.OPEN) {
                    client.send(JSON.stringify(data));
                }
            });
        } catch (error) {
            console.error('Error processing message:', error);
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// Express routes
app.get('/health', (req, res) => {
    res.json({ status: 'healthy' });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM signal received');
    // await redisClient.quit();
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});
