// index.js (Backend)
const express = require('express');
const AWS = require('aws-sdk');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const dynamodb = new AWS.DynamoDB.DocumentClient();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const tableName = 'Orders';

// API to get all orders
app.get('/api/orders', async (req, res) => {
  const params = {
    TableName: tableName,
  };
  try {
    const data = await dynamodb.scan(params).promise();
    res.status(200).json(data.Items);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching orders' });
  }
});

// API to add a new order
app.post('/api/order', async (req, res) => {
  const { name, dish, quantity } = req.body;
  const params = {
    TableName: tableName,
    Item: {
      id: new Date().toISOString(),
      name,
      dish,
      quantity,
    },
  };
  try {
    await dynamodb.put(params).promise();
    res.status(201).json({ message: 'Order placed successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Error placing order' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
