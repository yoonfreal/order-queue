const { Worker } = require('bullmq');
const { connection } = require('./queue');

const worker = new Worker('orders', async (job) => {
  const order = job.data;
  console.log(`Processing order ${order.id}`);

  const success = await processOrder(order);
  if (!success) {
    throw new Error(`Failed to process order ${order.id}`);
  }
}, { connection, concurrency: 5 });

worker.on('completed', (job) => {
  console.log(`Order ${job.data.id} completed`);
});

worker.on('failed', (job, err) => {
  console.log(`Order ${job.data.id} failed: ${err.message}`);
});

async function processOrder(order) {
  return true;
}
// async function processOrder(order) {
//   throw new Error('Simulated failure for demo');
// }

module.exports = worker;