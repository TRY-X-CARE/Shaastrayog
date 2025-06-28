const express = require('express');
const router = express.Router();
const crypto = require('crypto');

const MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID;
const MERCHANT_SECRET = process.env.PHONEPE_MERCHANT_SECRET;

// Helper function to generate checksum or signature (example)
function generateChecksum(data, secret) {
  if (!secret) {
    throw new Error('Merchant secret key is not defined');
  }
  return crypto.createHmac('sha256', secret).update(data).digest('hex');
}

// Endpoint to initiate payment
router.post('/initiate', (req, res) => {
  const { amount, orderId, customerPhone } = req.body;

  if (!amount || !orderId || !customerPhone) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (!MERCHANT_ID || !MERCHANT_SECRET) {
    return res.status(500).json({ error: 'Merchant credentials are not configured properly' });
  }

  // Prepare payment data
  const paymentData = {
    merchantId: MERCHANT_ID,
    orderId,
    amount,
    customerPhone,
  };

  // Generate checksum/signature
  let checksum;
  try {
    checksum = generateChecksum(JSON.stringify(paymentData), MERCHANT_SECRET);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }

  // Respond with payment initiation data and checksum
  res.json({
    paymentData,
    checksum,
  });
});

// Endpoint to handle payment callback (example)
router.post('/callback', (req, res) => {
  const callbackData = req.body;

  // Verify checksum/signature here (implementation depends on PhonePe docs)

  // Process payment status and update order accordingly

  res.json({ status: 'success' });
});

module.exports = router;
