# GreenShop — Lightweight E-commerce App (B204)

## Overview
Small e-commerce demo app required by the B204 assignment. Built with:
- Node.js + Express
- MongoDB (Mongoose)
- EJS server-side rendering
- PayPal Sandbox (client-side buttons)
- Minimal CSS, responsive.

## Repo structure
ecommerce-app/
backend/ # server, routes, models
frontend/
views/ # EJS templates
public/ # css, js, images
Dockerfile
README.md


## Setup (local)
1. Clone repository.
2. Create `.env` inside `backend/`:
PORT=3000
MONGODB_URI=<YOUR_MONGODB_URI>
PAYPAL_CLIENT_ID=<YOUR_PAYPAL_SANDBOX_CLIENT_ID>
BASE_URL=http://localhost:3000

3. Install dependencies:
```bash
cd backend
npm install
npm run dev   # or `npm start`

Open: http://localhost:3000/home (or /products)

PayPal sandbox

Create a sandbox business account at developer.paypal.com.

Get the Client ID for the sandbox app and set it in .env.

The checkout button uses the sandbox client id; payment capture happens client-side (sandbox) and then the server records the order via /orders/api.