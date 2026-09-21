const express = require('express');
const { orderQueue } = require('./queue');

const app = express();
app.use(express.json());

app.post('/orders', async (req, res) => {
  const order = req.body;
  await orderQueue.add('processOrder', order, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 2000 },
  });
  res.status(202).json({ message: 'Order received', orderId: order.id });
});

app.listen(3000, () => console.log('Server running on port 3000'));