const yup = require('yup');

const { User, UserValidation } = require('../models/users');

const getAll = async (req, res) => {
  try {
    const users = await User.findAll();

    return res.json({
      'status': 'success',
      'data': {
        'get': users
      }
    });

  } catch (e) {
    res.status(500);
    return res.json({
      'status': 'error',
      'message': 'An internal error occurred.',
      'details': e,
    });
  }
};

const create = async (req, res) => {
  const { name, email } = req.body;
  try {
    await UserValidation.validate({
      name,
      email
    });

    const user = await User.create({name, email});

    return res.json({
      'status': 'success',
      'data': {
        'post': user
      }
    });

  } catch (e) {
    if (e instanceof yup.ValidationError) {
      const validationError = {};

      e.inner.forEach(error => {
        validationError[error.path] = error.message;
      });

      res.status(400);
      return res.json({
        'status': 'fail',
        'data': validationError,
      });

    } else {
      res.status(500);
      return res.json({
        'status': 'error',
        'message': 'An internal error occurred.',
        'details': e,
      });
    }
  }
};

module.exports = {
  create,
  getAll,
};
