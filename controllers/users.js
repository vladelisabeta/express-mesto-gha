const User = require('../models/user')
const { HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_INTERNAL_SERVER_ERROR, HTTP_STATUS_OK, HTTP_STATUS_NOT_FOUND, HTTP_STATUS_CREATED } = require('http2').constants;

// GET USERS
module.exports.getUsers = (req, res) => {
  return User.find({})
    .then(r => {
      return res.status(HTTP_STATUS_OK).send(r);
    })
    .catch((e) => {
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: "Непредвиденная ошибка на сервере." });
    });
};

//  CREATE USER
module.exports.createUser = (req, res) => {
  // console.log(req.body)
  const { name, about, avatar } = req.body;
  return User.create({ name, about, avatar })
    .then(r => {
      return res.status(HTTP_STATUS_CREATED).send(r)
    })
    .catch((e) => {
      if (e.name === "ValidationError") {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: "Переданы некорректные данные при создании пользователя." });
      }
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: "Непредвиденная ошибка на сервере." })
    })
}

// GET USER BY ID
module.exports.getUserById = (req, res) => {
  const { userId } = req.params
  return User.findById(userId)
    .then(r => {
      // console.log(userId)
      if (r === null) {
        return res.status(HTTP_STATUS_NOT_FOUND).send({ message: "Пользователь не найден!" });
      }
      return res.status(HTTP_STATUS_OK).send(r)
    })
    .catch((e) => {
      if (e.name === "CastError") {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: "Пользователь по указанному _id не найден." })
      }
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: "Непредвиденная ошибка на сервере." })
    })
}


// module.exports.getUsers = (req, res) => {
//   User.find({})
//     .then(users => res.send({ data: users }))
//     .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
// };



// module.exports.getUserById = (req, res) => {
//   const { id } = req.params
//   User.findById(id)
//     .then(users => res.send({ data: users }))
//     .catch((err) => res.status(500).send({ message: 'Пользователь не найден!' }))
// }

// module.exports.createUser = (req, res) => {
//   const { name, about, avatar } = req.body;
//   return User.create({ name, about, avatar })
//     .then(user => res.send({ data: user }))
//     // .then(user => {
//     //   return res.send(user)
//     // })
//     .catch((e) => res.status(500).send({ message: 'Произошла ошибка' }));
// }