//const mongoURI = "mongodb://localhost:27017" + "/todoList"
const mongoURI = "mongodb+srv://cris:cris@todo-cluster.baijx.mongodb.net/TodoApp?retryWrites=true&w=majority"


let mongoose = require('mongoose');
const { todoSchema, userSchema } = require('./schema')

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => { console.log("connection established with mongodb server online"); })
    .catch(err => {
        console.log("error while connection", err)
    });
const userDb = mongoose.model('Users', userSchema)
const todoTasksDb = mongoose.model('TodoTasks', todoSchema)

exports.todoTasksDb = todoTasksDb;
exports.userDb = userDb;
