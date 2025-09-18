const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

mongoose.connect('mongodb://localhost:27017/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true });

const apiSchema = new mongoose.Schema({
  name: String,
  description: String
});

const Api = mongoose.model('Api', apiSchema);

router.post('/create', (req, res) => {
  const api = new Api(req.body);
  api.save((err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(api);
    }
  });
});

router.get('/read', (req, res) => {
  Api.find().then((apis) => {
    res.send(apis);
  }).catch((err) => {
    res.status(500).send(err);
  });
});

router.put('/update/:id', (req, res) => {
  Api.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, api) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(api);
    }
  });
});

router.delete('/delete/:id', (req, res) => {
  Api.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send({ message: 'Api deleted successfully' });
    }
  });
});

module.exports = router;