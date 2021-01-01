import React, { useState, useEffect } from "react";
import "./todoList.css";
import ListItems from "./ListItems";

function TodoList(props) {
  const [curTask, setTask] = useState("");
  const [curTaskDate, setTaskDate] = useState({ taskDate: new Date() });
  const [taskList, setTaskList] = useState([]);
  const sortTaskList = (list) => {
    const sortedArr = list.sort((a, b) => {
      const aDateNumeric = new Date(a.endDate).valueOf();
      const bDateNumeric = new Date(b.endDate).valueOf();
      return aDateNumeric - bDateNumeric;
    }); // sorts in ascending order of End Date
    return sortedArr;
  };
  const addTodoTask = () => {
    fetch("https://todo-node-backend-x.herokuapp.com/addTask", {
      method: "POST",
      body: JSON.stringify({
        task: curTask,
        taskDate: curTaskDate.taskDate,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include"  
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res.success);
        console.log("got data from backend..");
        taskList.push(res.newTodo);
        const sortedTaskList = sortTaskList(taskList);
        console.log(res.newTodo);
        setTaskList(sortedTaskList);
        setTask("");
        setTaskDate({ taskDate: "" });
      });
  };
  const getTasks = () => {
    fetch("https://todo-node-backend-x.herokuapp.com/getTasks", { credentials: "include" })
      .then((r) => r.json())
      .then((r) => {
        if (r.success) {
          const sortedTaskList = sortTaskList(r.todos);
          setTaskList(sortedTaskList);
        }
      });
  };
  const handleDone = (event, index) => {
    fetch("https://todo-node-backend-x.herokuapp.com/updateTask", {
      method: "PUT",
      body: JSON.stringify({
        taskId: taskList[index]._id,
        value: event.target.checked,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include"  
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          taskList[index] = res.updatedTodo;
          setTaskList([...taskList]);
        } else {
          console.log("error..");
        }
      });
  };
  const deleteHandler = (index) => {
    fetch("https://todo-node-backend-x.herokuapp.com/deleteTask", {
      method: "DELETE",
      body: JSON.stringify({
        taskId: taskList[index]._id,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include"  
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          taskList.splice(index, 1);
          setTaskList([...taskList]);
        } else {
          console.log("error..");
        }
      });
  };

  const saveHandler = (index, text) => {
    fetch("https://todo-node-backend-x.herokuapp.com/saveTask", {
      method: "PUT",
      body: JSON.stringify({
        taskId: taskList[index]._id,
        task: text,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include"  
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          taskList[index] = res.updatedTodo;
          setTaskList([...taskList]);
        } else {
          console.log("error..");
        }
      });
  };
  useEffect(() => {
    getTasks();
  }, []);

  const handleTextChange = (evt) => {
    setTask(evt.target.value);
  };
  return (
    <div className="container">
      <div className="heading-container">
        <h1 className="heading">To-Do Tasks</h1>
      </div>
      <div className="user">
        <div className="userName">
          Username: <b>{props.userEmail}</b>
        </div>
        <button onClick={() => props.logoutHandler()} className="logOutbtn">
          Log Out
        </button>
      </div>
      <div className="todoTask">
        <div className="input-area">
          <textarea
            value={curTask}
            onChange={handleTextChange}
            rows="4"
            cols="50"
          ></textarea>
        </div>
        <div className="datePicker">
          <input
            type="date"
            name="Deadline"
            onChange={(evt) => {
              console.log(evt.target.value);
              setTaskDate({ taskDate: evt.target.value });
            }}
            value={curTaskDate.taskDate}
          ></input>
        </div>
      </div>
      <div>
        <button
          onClick={() => {
            console.log(curTaskDate.taskDate);
            if (
              !props.isNullOrUndefined(curTask) &&
              !props.isNullOrUndefined(curTaskDate.taskDate)
            ) {
              addTodoTask();
            }
          }}
        >
          Add
        </button>
      </div>
      <div>
        {taskList.map((curTask, index) => {
          return (
            <ListItems
              task={curTask.task}
              index={index}
              done={curTask.done}
              endDate={curTask.endDate}
              saveHandler={saveHandler}
              deleteHandler={deleteHandler}
              handleDone={handleDone}
              isNullOrUndefined={props.isNullOrUndefined}
            />
          );
        })}
      </div>
    </div>
  );
}

export default TodoList;
