import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "../styles/Items.css";

function Items({ listId }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [resolvedTasks, setResolvedTasks] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [filter, setFilter] = useState("");
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem(`tasks_${listId}`));
    if (storedTasks) {
      setTasks(storedTasks);
    }
  }, [listId]);

  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem(`tasks_${listId}`, JSON.stringify(tasks));
    } else {
      localStorage.removeItem(`tasks_${listId}`);
    }
  }, [tasks, listId]);

  function handleInputChange(event) {
    setNewTask(event.target.value);
  }

  function addTask() {
    if (newTask.trim() !== "") {
      setTasks((t) => [...t, newTask]);
      setNewTask("");
    }
  }

  function deleteTask(taskIndex) {
    const updatedTasks = tasks.filter((_, index) => index !== taskIndex);
    setTasks(updatedTasks);
  }

  function resolveTask(taskIndex) {
    const taskToResolve = tasks[taskIndex];
    setResolvedTasks((prev) => [...prev, taskToResolve]);
    deleteTask(taskIndex);
  }

  function unresolveTask(taskIndex) {
    const taskToUnresolve = resolvedTasks[taskIndex];
    setTasks((prev) => [...prev, taskToUnresolve]);
    const updatedResolvedTasks = resolvedTasks.filter(
      (_, i) => i !== taskIndex
    );
    setResolvedTasks(updatedResolvedTasks);
  }

  function startEditing(filteredIndex) {
    const originalIndex = getOriginalIndexFromFiltered(filteredIndex);
    setEditIndex(originalIndex);
    setEditValue(tasks[originalIndex]);
  }

  function saveEdit() {
    if (editValue.trim() !== "") {
      const updatedTasks = [...tasks];
      updatedTasks[editIndex] = editValue;
      setTasks(updatedTasks);
      cancelEdit();
    }
  }

  function cancelEdit() {
    setEditIndex(null);
    setEditValue("");
  }

  function handleFilterChange(event) {
    setFilter(event.target.value);
  }

  const filteredTasks = tasks.filter((task) =>
    task.toLowerCase().includes(filter.toLowerCase())
  );

  const filteredResolvedTasks = resolvedTasks.filter((task) =>
    task.toLowerCase().includes(filter.toLowerCase())
  );

  function toggleFilterVisibility() {
    setIsFilterVisible(!isFilterVisible);
  }

  function getOriginalIndexFromFiltered(filteredIndex) {
    let count = 0;
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].toLowerCase().includes(filter.toLowerCase())) {
        if (count === filteredIndex) {
          return i;
        }
        count++;
      }
    }
    return -1;
  }

  return (
    <div className="items-container">
      <h1 className="items-header">Items</h1>

      <div className="task-input-container">
        <input
          className="task-input"
          type="text"
          placeholder="Enter an item..."
          value={newTask}
          onChange={handleInputChange}
        />
        <button className="add-button" onClick={addTask}>
          +
        </button>
      </div>

      <div className="filter-container">
        <button className="filter-toggle" onClick={toggleFilterVisibility}>
          Filter
        </button>
        {isFilterVisible && (
          <input
            className="filter-input"
            type="text"
            placeholder="Search items..."
            value={filter}
            onChange={handleFilterChange}
          />
        )}
      </div>

      {tasks.length > 0 && (
        <>
          <h2 className="active-header">Active Items</h2>
          <ol className="task-list">
            {filteredTasks.map((task, filteredIndex) => (
              <li key={filteredIndex} className="task-item">
                {editIndex === getOriginalIndexFromFiltered(filteredIndex) ? (
                  <>
                    <input
                      className="edit-input"
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                    />
                    <button className="save-button" onClick={saveEdit}>
                      Save
                    </button>
                    <button className="cancel-button" onClick={cancelEdit}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <span className="task-text">{task}</span>
                    <button
                      className="resolve-button"
                      onClick={() =>
                        resolveTask(getOriginalIndexFromFiltered(filteredIndex))
                      }
                    >
                      Done
                    </button>
                    <button
                      className="edit-button"
                      onClick={() => startEditing(filteredIndex)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-button"
                      onClick={() =>
                        deleteTask(getOriginalIndexFromFiltered(filteredIndex))
                      }
                    >
                      Remove
                    </button>
                  </>
                )}
              </li>
            ))}
          </ol>
        </>
      )}

      {filteredResolvedTasks.length > 0 && (
        <>
          <h2 className="resolved-header">Resolved Items</h2>
          <ol className="resolved-task-list">
            {filteredResolvedTasks.map((task, filteredIndex) => (
              <li key={filteredIndex} className="resolved-task-item">
                <span className="task-text resolved">{task}</span>
                <button
                  className="unresolve-button"
                  onClick={() => unresolveTask(filteredIndex)}
                >
                  Undo
                </button>
              </li>
            ))}
          </ol>
        </>
      )}
    </div>
  );
}

Items.propTypes = {
  listId: PropTypes.string.isRequired,
};

export default Items;
