const jwt = require('jsonwebtoken');
require('dotenv/config');
const path = require('path');
const JWT_EVALUATION_KEY = require('fs')
.readFileSync(path.resolve(__dirname, '../../../jwt.evaluation.key'), 'utf8');

<<<<<<< main-group-3-feature-products
const TOKEN_SECRET_KEY = process.env.JWT_SECRET || JWT_EVALUATION_KEY;
=======
const TOKEN_SECRET_KEY = process.env.JWT_SECRET || 'secret';
>>>>>>> main-group-3

const generateToken = ({ id, name, email, role }) => {
  const payload = {
    id,
    name,
    email,
    role,
  };

  const jwtConfig = {
    expiresIn: '100m',
    algorithm: 'HS256',
  };

  const token = jwt.sign(payload, TOKEN_SECRET_KEY, jwtConfig);

  return token;
};

const authenticateToken = async (token) => {
  if (!token) {
    const status = 401;
    const message = 'Token not found';
    return { status, message };
  }

  try {
    const validateToken = jwt.verify(token, TOKEN_SECRET_KEY);
    console.log(validateToken);
    return validateToken;
  } catch (error) {
    const status = 401;
    const message = 'Expired or invalid token';
    return { status, message };
  }
};

module.exports = {
  generateToken,
  authenticateToken,
};