const yup = require('yup');

const { User } = require('../models/users');

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

    let user = await User.findOne({
      where: { email },
    });
    if (user !== null) {
      res.status(400);
      return res.json({
        'status': 'fail',
        'data': {
            'email': 'O email já está cadastrado.'
        }
      });
    }

    user = await User.create({name, email});
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
        'message': 'Um erro interno ocorreu.',
        'details': e,
      });
    }
  }
};

const remove = async (req, res) => {
  const { email } = req.body;

  const schema = yup.object().shape({
    email: yup.string().email('O campo email precisa ser válido.').required('O campo email é obrigatório.'),
  });

  try {
    await schema.validate({
      email
    }, { abortEarly: false });

    const user = await User.destroy({
      where: { email },
    });

    if (user > 0) {
      return res.json({
        'status': 'success',
        'data': {
            'delete': null
        }
      });
    } else {
      return res.json({
        'status': 'fail',
        'data': {
            'email': 'O email não existe.'
        }
      });
    }

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
        'message': 'Um erro interno ocorreu.',
        'details': e,
      });
    }
  }
};

const update = async (req, res) => {
  const { email, newName, newEmail } = req.body;

  const schema = yup.object().shape({
    email: yup.string().email('O campo email precisa ser válido.').required('O campo email é obrigatório.'),
    newName: yup.string(),
    newEmail: yup.string().email('O campo email precisa ser válido.'),
  });

  try {
    await schema.validate({
      email,
      newName,
      newEmail,
    }, { abortEarly: false });

    const user = await User.update(
      {
        email: newEmail,
        name: newName,
      },
      {
        where: { email },
      }
    );

    // Queria passar os campos atualizados aqui usando o user, mas isso só possível com postgres
    // https://sequelize.org/master/class/lib/model.js~Model.html#static-method-update
    // The promise returns an array with one or two elements. The first element is always the number of affected rows, while the second element is the actual affected rows (only supported in postgres with options.returning true).
    if (user > 0) {
      return res.json({
        'status': 'success',
        'data': {
            'put': `Usuário ${email} atualizado com sucesso.`
        }
      });
    } else {
      return res.json({
        'status': 'fail',
        'data': {
            'email': 'O email não existe.'
        }
      });
    }

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

    } else if (e.name === 'SequelizeUniqueConstraintError') {
      res.status(400);
      return res.json({
        'status': 'fail',
        'data': {
          'newEmail': 'O email fornecido já está cadastrado.'
        },
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

module.exports = {
  create,
  getAll,
  remove,
  update,
};
