const yup = require('yup');

const User = require('../models/users');

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
      'message': 'Um erro interno ocorreu.',
      'details': e,
    });
  }
};

const create = async (req, res) => {
  const { name, email } = req.body;

  const schema = yup.object().shape({
    name: yup.string().required('O campo nome é obrigatório.'),
    email: yup.string().email('O campo email precisa ser válido.').required('O campo email é obrigatório.'),
  });

  try {
    await schema.validate({
      name,
      email
    }, { abortEarly: false });

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
        console.log(error.path);
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
        'message': 'Um erro interno ocorreu.',
        'details': e,
      });
    }
  }
};

const remove = async (req, res) => {

};

module.exports = {
  create,
  getAll,
};
