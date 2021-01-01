const { Schema } = require('mongoose');

const userSchema = new Schema({
  userEmail: String,
  password: String,
});

const todoSchema = new Schema({
  task: String,
  done: Boolean,
  creationTime: Date,
  endDate: Date,
  userId: Schema.Types.ObjectId,
});
exports.todoSchema = todoSchema;
exports.userSchema = userSchema;