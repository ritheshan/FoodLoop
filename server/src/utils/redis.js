import { createClient } from 'redis';

const client = createClient({
    username: 'default',
    password: '4fF3Do2J0C4FeCAwptyOkVs0qh4wLbqv',
    socket: {
        host: 'redis-11900.c93.us-east-1-3.ec2.redns.redis-cloud.com',
        port: 11900,
        tls: false
    }
});

client.on('error', err => console.log('Redis Client Error', err));

await client.connect();

export default client;