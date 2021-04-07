'use strict';

const express = require('express');
const authRouter = express.Router();
const fs = require('fs');
const User = require('../models/users.js');
const basicAuth = require('../middleware/basic.js')
const bearerAuth = require('../middleware/bearer.js')
const permissions = require('../middleware/acl.js')

const models = new Map();

const Collection = require('../models/data-collections.js');

authRouter.param('model', (req, res, next) => {
  const modelName = req.params.model;
  if (models.has(modelName)) {
    req.model = models.get(modelName);
    next();
  } else {
    const fileName = `${__dirname}/../models/${modelName}/model.js`;
    if (fs.existsSync(fileName)) {
      const model = require(fileName);
      models.set(modelName, new Collection(model));
      req.model = models.get(modelName);
      next();
    }
    else {
      next("Invalid Model");
    }
  }
});

authRouter.post('/signup', async (req, res, next) => {
  try {
    let user = new User(req.body);
    const userRecord = await user.save();
    const output = {
      user: userRecord,
      token: userRecord.token
    };
    res.status(201).json(output);
  } catch (e) {
    next(e.message)
  }
});

authRouter.post('/signin', basicAuth, (req, res, next) => {
  const user = {
    user: req.user,
    token: req.user.token
  };
  res.status(200).json(user);
});

authRouter.get('/users', bearerAuth, permissions('delete'), async (req, res, next) => {
  // console.log('ffdfsd')
  const users = await User.find({});
  const list = users.map(user => user.username);
  res.status(200).json(list);
});

authRouter.get('/secret', bearerAuth, async (req, res, next) => {
  res.status(200).send('Welcome to the secret area')
});

authRouter.post('/:model', bearerAuth, permissions('create'), handleCreate);
authRouter.get('/:model', bearerAuth, permissions('read'), handleGetAll);
authRouter.get('/:model/:id', bearerAuth, permissions('read'), handleGetOne);
authRouter.put('/:model/:id', bearerAuth, permissions('update'), handleUpdate);
authRouter.patch('/:model/:id', bearerAuth, permissions('update'), handleUpdate);
authRouter.delete('/:model/:id', bearerAuth, permissions('delete'), handleDelete);






// authRouter.get('/auth_', aouth, (req, res) => {
//   console.log("ROUTEEEEEEEEEEEEEEEEE")
//   res.json({ token: req.token })
// })






// authRouter.get('test', aouth, (req, res) => {
//   console.log("ROUTEEEEEEEEEEEEEEEEE")
//   res.json({ token: req.token })
// })



















async function handleCreate(req, res) {
  let obj = req.body;
  let newRecord = await req.model.create(obj);
  res.status(201).json(newRecord);
}

async function handleGetAll(req, res) {
  let allRecords = await req.model.get();
  res.status(200).json(allRecords);
}

async function handleGetOne(req, res) {
  const id = req.params.id;
  let theRecord = await req.model.get(id)
  res.status(200).json(theRecord);
}

async function handleUpdate(req, res) {
  const id = req.params.id;
  const obj = req.body;
  let updatedRecord = await req.model.update(id, obj)
  res.status(200).json(updatedRecord);
}

async function handleDelete(req, res) {
  let id = req.params.id;
  let deletedRecord = await req.model.delete(id);
  res.status(200).json(deletedRecord);
}
module.exports = authRouter;