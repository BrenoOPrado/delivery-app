const express = require('express');
const { insertLogin, registerUser } = require('../Controllers/Controller');

const routes = express.Router();

routes.post('/login', insertLogin);
routes.post('/register', registerUser);

module.exports = routes;