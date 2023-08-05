// app.js
const express = require('express');
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');
const MongoClient = require('mongodb').MongoClient;

const app = express();
const port = 3000;
const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'admin_panel';
const collectionName = 'items';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Validation middleware for creating/updating items
const validateNewItem = [
  body('name').notEmpty().withMessage('Name cannot be empty'),
  body('price').isFloat().withMessage('Price must be a valid number'),
];

MongoClient.connect(mongoUrl, { useUnifiedTopology: true }, (err, client) => {
  if (err) throw err;
  const db = client.db(dbName);
  const collection = db.collection(collectionName);

  app.post('/items', validateNewItem, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const newItem = req.body;
    collection.insertOne(newItem, (err, result) => {
      if (err) throw err;
      res.json(result.ops[0]);
    });
  });

  
});
