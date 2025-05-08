const express = require('express');
const AWS = require('aws-sdk');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

AWS.config.update({
  region: 'ap-south-1', // change to your region
});

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = 'Orders';

app.post('/api/order', async (req, res) => {
  const { name, phone, dish } = req.body;
  const id = Date.now().toString();

  const params = {
    TableName: tableName,
    Item: { id, name, phone, dish },
  };

  try {
    await dynamodb.put(params).promise();
    res.status(200).json({ message: 'Order placed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not place order' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
