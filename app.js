const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

// part time model
// const userModel = require('./models/user');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
})


process.on('uncaughtException', function (err) {
  console.log(err);
});



const { PORT = 3000, MONGOHOST = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();

app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));


app.use((req, res, next) => {
  req.user = {
    _id: '650c80bcf5de093a46dcd085' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});


app.use(userRouter)
app.use(cardRouter)




// устаревшее и ненужное
// app.use(bodyParser.json());


// app.post('/users', (req, res) => {
//   const { name, about, avatar } = req.body;
//   return userModel.create({ name, about, avatar })
//     .then(r => {
//       return res.status(201).send(r)
//     })
//     .catch((e) => {})
// })

// app.post("/users", (req, res) => {
//   // const { name, about, avatar } = req.body;
//   console.log(req.body)
//   const { name, about, avatar } = req.body;
//   // res.send({ body: req.body })
//   return userModel.create({ name, about, avatar })
//     .then(r => {
//       return res.status(200).send(r)
//     })
//     .catch((e) => { })
// })


// mongoose.connect('mongodb://localhost:27017/mestodb', {
//   useNewUrlParser: true,
//   useCreateIndex: true,
//   useFindAndModify: false
// })




app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})

