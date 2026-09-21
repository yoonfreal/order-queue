const { Queue } = require('bullmq');
const connection = { host: '127.0.0.1', port: 6379 };

const orderQueue = new Queue('orders', { connection });

module.exports = { orderQueue, connection };