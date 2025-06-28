const axios = require('axios');

async function testPayment() {
  try {
    const response = await axios.post('http://localhost:5000/api/payment/initiate', {
      amount: 100,
      orderId: 'TEST_ORDER_' + Date.now(),
      customerPhone: '9999999999'
    });

  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

testPayment(); 