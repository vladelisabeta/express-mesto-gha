const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');


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
    _id: '650c80bcf5de093a46dcd085'
  };

  next();
});


app.use(userRouter)
app.use(cardRouter)



app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})

