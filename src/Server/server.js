const express = require("express");
const app = express();
const port = 9999;
const session = require("express-session");
const cors = require("cors");

const { todoTasksDb, userDb } = require("./connector");
const session_secret = "newton";

app.use(express.json()); // added body key to req


app.use(cors({
    credentials: true,
    origin: "https://todo-react-frontend-x.herokuapp.com"
}));
//app.use(cors());
app.set('trust proxy', 1);
app.use(
  session({
    secret: session_secret,
    cookie: { 
      maxAge: 1*60*60*1000,
      sameSite: 'none',
      secure: true, 
    },
  })
); // adds a property called session to req

const isNullOrUndefined = (val) => {
  return val === null || val === undefined || val === "";
};

app.post("/login", async (req, res) => {
  const { userEmail, password } = req.body;
  const existingUser = await userDb.findOne({ userEmail });
  if (isNullOrUndefined(userEmail) || isNullOrUndefined(password)) {
    res
      .status(400)
      .send({ loginSuccess: false, errorMsg: "Required Fields missing." });
  } else if (isNullOrUndefined(existingUser)) {
    res.status(400).send({
      loginSuccess: false,
      errorMsg: "User not registered with us. Please click on Sign Up.",
    });
  } else {
    if (existingUser.password === password) {
      req.session.userId = existingUser._id;
      console.log("Session saved with ", req.session.userId);
      res.send({ loginSuccess: true});
    } else {
      res
        .status(400)
        .send({ loginSuccess: false, errorMsg: "Password Incorrect." });
    }
  }
});

app.post("/signUp", async (req, res) => {
  const { userEmail, password } = req.body;
  const existingUser = await userDb.find({ userEmail });
  console.log(existingUser.length);
  if (isNullOrUndefined(userEmail) || isNullOrUndefined(password)) {
    res
      .status(400)
      .send({ signSuccess: false, errorMsg: "Required fields missing." });
  } else if (existingUser.length !== 0) {
    res
      .status(400)
      .send({ signSuccess: false, errorMsg: "User already exists." });
  } else {
    const newUser = new userDb({
      userEmail: userEmail,
      password: password,
    });
    await newUser.save();
    req.session.userId = newUser._id;
    console.log("Session saved with after SignUp", req.session);
    res.send({ signSuccess: true});
  }
});

const AuthMiddleware = async (req, res, next) => {
  console.log("Middleware Executed..");
  console.log("30  session.."+JSON.stringify(req.session));
  if (isNullOrUndefined(req.session) || isNullOrUndefined(req.session.userId)) {
    console.log("Outside session..");
    res.status(401).send({
      authorizationSuccess: false,
      errMsg: "Session expired or User not logged in",
    });
  } else {
    console.log("Inside session..");
    next();
  }
};

app.get("/getTasks", AuthMiddleware, async (req, res) => {
  // const { userEmail, userId } = req.body;
  console.log("get tasks")
  const allTodos = await todoTasksDb.find({ userId: req.session.userId });
  const response = {
    success: true,
    todos: allTodos,
  };
  res.send(response);
});

app.post("/addTask", AuthMiddleware, async (req, res) => {
  const { task, taskDate } = req.body;
  if (isNullOrUndefined(task)) {
    console.log("inside if");
    res.status(400).send({ success: false });
  } else {
    console.log("inside else");
    const newTodo = new todoTasksDb({
      task: task,
      done: false,
      editable: false,
      endDate: taskDate,
      creationTime: Date.now(),
      userId: req.session.userId,
    });
    await newTodo.save();
    //console.log(newTodo);
    const response = {
      newTodo: newTodo,
      success: true,
    };
    console.log(response);
    res.send(response);
  }
});

app.put("/saveTask", AuthMiddleware, async (req, res) => {
  const { task, taskId } = req.body;
  try {
    const todo = await todoTasksDb.findOne({ _id: taskId, userId: req.session.userId });
    if (isNullOrUndefined(todo)) {
      const response = {
        success: false,
      };
      res.status(404).send(response);
    } else {
      todo.task = task;
      await todo.save();
      const response = {
        success: true,
        updatedTodo: todo,
      };
      res.send(response);
    }
  } catch (e) {
    const response = {
      success: false,
    };
    res.status(404).send(response);
  }
});

app.delete("/deleteTask", AuthMiddleware, async (req, res) => {
  const { taskId } = req.body;
  try {
    await todoTasksDb.deleteOne({ _id: taskId, userId: req.session.userId });
    res.status(200).send({ success: true });
  } catch (e) {
    res.status(200).send({ success: false });
  }
});

app.put("/updateTask", AuthMiddleware, async (req, res) => {
  const { taskId, value } = req.body;
  try {
    const todo = await todoTasksDb.findOne({ _id: taskId, userId: req.session.userId });
    if (isNullOrUndefined(todo)) {
      const response = {
        success: false,
      };
      res.status(404).send(response);
    } else {
      todo.done = value;
      await todo.save();
      const response = {
        success: true,
        updatedTodo: todo,
      };
      res.send(response);
    }
  } catch (e) {
    const response = {
      success: false,
    };
    res.status(404).send(response);
  }
});

app.get("/logOut", AuthMiddleware, async (req, res) => {
  console.log("logout")
  if (!isNullOrUndefined(req.session)) {
    // destroy the session
    req.session.destroy(() => {
      res.status(200).send({
        success: true,
      });
    });
  } else {
    res.status(200).send({
      success: true,
    });
  }
});

app.get("/userInfo", AuthMiddleware, async (req, res) => {
  const user = await userDb.findById(req.session.userId);
  if(isNullOrUndefined(user)) {
    res.send({ loggedIn : false })
  }
  else {
    res.send({ loggedIn : true, userEmail: user.userEmail});
  }
})

app.get("/", async (req, res) => {
  res.send("Server Working..");
})
app.listen(process.env.PORT || port, () => console.log(`App listening on port ${port}!`));

module.exports = app;
