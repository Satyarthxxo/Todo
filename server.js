let express = require('express')
let mongodb = require('mongodb')

let app = express()

//this variable represents a MongoDB database
let db

app.use(express.static('public'))
let connectionString = 'mongodb+srv://todoAppUser7:7579131356@cluster0-rjvd0.mongodb.net/test?retryWrites=true&w=majority'

//This tells mongoDB where or what we want to connect to
mongodb.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, client) {
  db = client.db() //this will select our mongodb database
  app.listen(3000)
})

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

//what should the app do when it gets a request from this URL '/'
app.get('/', function (req, res) {
  db.collection('items').find().toArray(function (err, items) { //toArray converts the data into array so that we can work with js
    res.send(`<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>My To-Do App</title>
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" >
    </head>
    <body>
      <div class="container">
        <h1 class="display-4 text-center py-1">To-Do App</h1>
        
        <div class="jumbotron p-3 shadow-sm">
          <form action="/create-item" method="POST">
            <div class="d-flex align-items-center">
              <input name="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
              <button class="btn btn-primary">Add New Item</button>
            </div>
          </form>
        </div>
        
        <ul class="list-group pb-5">
          ${items.map(function (item) {
        return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
            <span class="item-text">${item.text}</span>
            <div>
              <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
              <button data-id="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
            </div>
          </li>`
      }).join('')}
        </ul>
        
      </div>
      <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
      <script src="/browser.js"></script>
    </body>
    </html>`)
    //join() converts an array into string
  })

})

//what should the app do when it gets a POST request to the '/create-item'
app.post('/create-item', function (req, res) {
  db.collection('items').insertOne({ text: req.body.item }, function () { //{text:req.body.item},this will create an object which will be stored as document in database
    res.redirect('/')
  })
})



app.post('/update-item', function (req, res) {
  db.collection('items').findOneAndUpdate({ _id: new mongodb.ObjectId(req.body.id) }, { $set: { text: req.body.text } }, function () {
    res.send("Success")
  })
})

app.post('/delete-item', function (req, res) {
  db.collection('items').deleteOne({ _id: new mongodb.ObjectId(req.body.id) }, function () {
    res.send("Success")
  })
})

