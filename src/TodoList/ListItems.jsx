import React, { useState } from "react";
import "./todoList.css";
import Moment from 'react-moment';

function ListItems(props) {
  let [curText, setCurText] = useState(props.task);
  let [editFlag, setEditFlag] = useState(false);

  return (
    <>
      {editFlag === true ? (
        <div className="edit-area">
          <textarea
            rows="4"
            cols="50"
            value={curText}
            onChange={(evt) => {
              setCurText(evt.target.value);
            }}
          ></textarea>
          <button
            className="saveBtn"
            onClick={() => {
              if (!props.isNullOrUndefined(curText)) {
                setEditFlag(false);
                props.saveHandler(props.index, curText);
              }
            }}
          >
            Save
          </button>
        </div>
      ) : (
        <div className="taskItem">
          <div className="task">
            <p>{props.task}</p>
            <p className="date"><Moment format="DD/MM/YYYY">
                {props.endDate}
            </Moment></p>
            <div className="btn-grp">
              <button
                onClick={() => {
                  setEditFlag(true);
                }}
              >
                Edit
              </button>
              <button onClick={() => props.deleteHandler(props.index)}>Delete</button>
              <input type="checkbox" className="le-checkbox" checked={props.done} onChange={() => console.log("done")} onClick={(evt) => props.handleDone(evt, props.index)}/>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ListItems;
