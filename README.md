# Order Queue Demo

A Node.js + Express backend that uses **BullMQ** to handle order-processing at scale. Instead of processing every incoming order the instant it arrives, orders are pushed onto a Redis-backed queue and processed by a worker at a controlled pace — with automatic retries if processing fails.

Built for CSX4110 Backend Application Development — Project 2.

## The Problem

When a popular restaurant receives hundreds of orders at the same time, processing every order immediately can overload the backend and cause delays or failed orders.

## The Solution

Orders are placed into a BullMQ queue. Workers then process the orders one by one or in controlled batches. If an order-processing job fails, BullMQ can automatically retry it with exponential backoff.

## Project Structure

```
order-queue-demo/
├── package.json
├── server.js          # Express app — POST /orders route, enqueues jobs
├── queue.js            # Shared Queue instance + Redis connection config
├── worker.js            # Worker process — consumes and processes jobs
├── burst.js             # Fires 20 orders at once to demo controlled concurrency

```

## Prerequisites

- Node.js
- Redis, running locally

Install Redis (macOS, via Homebrew):
```bash
brew install redis
brew services start redis
```

Verify it's running:
```bash
redis-cli ping
# → PONG
```

## Setup

```bash
npm install
```

## Running

The API and the worker run as **separate processes**, in separate terminals:

```bash
# Terminal 1 — API
node server.js

# Terminal 2 — Worker
node worker.js
```

## Testing It

Send a single order:
```bash
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -d '{"id": 1}'
```

You'll get an immediate response from the API (terminal 1's output), and shortly after, the worker (terminal 2) will log that it processed the order.

### Simulating a burst of orders

```bash
node burst.js
```

Fires 20 orders at once. Watch the worker terminal — jobs are processed 5 at a time (`concurrency: 5`), not all simultaneously.

### Simulating a failure / retry

In `worker.js`, temporarily change:
```javascript
async function processOrder(order) {
  return true;
}
```
to:
```javascript
async function processOrder(order) {
  throw new Error('Simulated failure for demo');
}
```

Restart the worker and send an order. It will retry 3 times with increasing delay (exponential backoff) before giving up. Revert the change afterward.

## Tools Used

- [BullMQ](https://docs.bullmq.io/) — Redis-backed job queue for Node.js
- Express — HTTP API
- ioredis — Redis client

## Team

- 6642001 — Shune Lai Wai
- 6642005 — Yoon Hsu Hlaing
- 6642042 — Myat Yadana Khin
