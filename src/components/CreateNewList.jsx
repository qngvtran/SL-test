import React, { useState, useEffect } from "react";
import Items from "./Items";
import "../styles/CreateNewList.css";

function CreateNewList() {
  const [listName, setListName] = useState("");
  const [lists, setLists] = useState([]);
  const [archivedLists, setArchivedLists] = useState([]);
  const [editingListIndex, setEditingListIndex] = useState(null);
  const [newListName, setNewListName] = useState("");
  const [expandedLists, setExpandedLists] = useState([]);
  const [expandedArchivedLists, setExpandedArchivedLists] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState(null); // New state for confirming deletion

  useEffect(() => {
    const storedLists = JSON.parse(localStorage.getItem("lists"));
    const storedArchivedLists = JSON.parse(
      localStorage.getItem("archivedLists")
    );

    if (storedLists) {
      setLists(storedLists);
    }
    if (storedArchivedLists) {
      setArchivedLists(storedArchivedLists);
    }
  }, []);

  useEffect(() => {
    if (lists.length > 0) {
      localStorage.setItem("lists", JSON.stringify(lists));
    } else {
      localStorage.removeItem("lists");
    }

    if (archivedLists.length > 0) {
      localStorage.setItem("archivedLists", JSON.stringify(archivedLists));
    } else {
      localStorage.removeItem("archivedLists");
    }
  }, [lists, archivedLists]);

  function handleListNameChange(event) {
    setListName(event.target.value);
  }

  function createList() {
    if (listName.trim() !== "") {
      const newList = {
        name: listName,
        tasks: [],
      };
      setLists((prevLists) => [...prevLists, newList]);
      setListName("");
    }
  }

  function handleRenameList(index) {
    setEditingListIndex(index);
    setNewListName(lists[index].name);
  }

  function saveRenamedList() {
    if (newListName.trim() !== "") {
      const updatedLists = [...lists];
      updatedLists[editingListIndex].name = newListName;
      setLists(updatedLists);
      setEditingListIndex(null);
      setNewListName("");
    }
  }

  function cancelRename() {
    setEditingListIndex(null);
    setNewListName("");
  }

  function deleteList(index) {
    const deletedList = lists[index];
    const updatedLists = lists.filter((_, i) => i !== index);
    setLists(updatedLists);

    setArchivedLists((prevArchivedLists) => [
      ...prevArchivedLists,
      deletedList,
    ]);
  }

  function restoreList(index) {
    const restoredList = archivedLists[index];
    const updatedArchivedLists = archivedLists.filter((_, i) => i !== index);
    setArchivedLists(updatedArchivedLists);

    setLists((prevLists) => [...prevLists, restoredList]);
  }

  function toggleExpandList(index) {
    setExpandedLists((prevExpandedLists) =>
      prevExpandedLists.includes(index)
        ? prevExpandedLists.filter((i) => i !== index)
        : [...prevExpandedLists, index]
    );
  }

  function toggleExpandArchivedList(index) {
    setExpandedArchivedLists((prevExpandedArchivedLists) =>
      prevExpandedArchivedLists.includes(index)
        ? prevExpandedArchivedLists.filter((i) => i !== index)
        : [...prevExpandedArchivedLists, index]
    );
  }

  function handleSearchChange(event) {
    setSearchTerm(event.target.value);
  }

  function confirmDeleteArchivedList(index) {
    if (confirmDeleteIndex === index) {
      // If the user already clicked once, delete the list permanently
      const updatedArchivedLists = archivedLists.filter((_, i) => i !== index);
      setArchivedLists(updatedArchivedLists);
      setConfirmDeleteIndex(null); // Reset confirmation state
    } else {
      // Set the index for the list the user wants to delete
      setConfirmDeleteIndex(index);
    }
  }

  const filteredLists = lists.filter((list) =>
    list.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredArchivedLists = archivedLists.filter((list) =>
    list.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="create-new-list">
      <h1>Create New List</h1>
      <div>
        <input
          className="LI"
          type="text"
          placeholder="Enter list name..."
          value={listName}
          onChange={handleListNameChange}
        />
        <button className="create-list-button" onClick={createList}>
          Create List
        </button>
      </div>

      <div className="search-bar">
        <input
          className="LI"
          type="text"
          placeholder="Search lists..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <h2>Lists</h2>
      <div>
        {filteredLists.length === 0 ? (
          <p>No lists found.</p>
        ) : (
          <ul>
            {filteredLists.map((list, index) => (
              <li key={index}>
                {editingListIndex === index ? (
                  <div>
                    <input
                      type="text"
                      value={newListName}
                      onChange={(e) => setNewListName(e.target.value)}
                    />
                    <button onClick={saveRenamedList}>Save</button>
                    <button onClick={cancelRename}>Cancel</button>
                  </div>
                ) : (
                  <div>
                    <h3
                      onClick={() => toggleExpandList(index)}
                      style={{ cursor: "pointer" }}
                    >
                      {list.name}
                    </h3>
                    <button onClick={() => handleRenameList(index)}>
                      Rename
                    </button>
                    <button onClick={() => deleteList(index)}>Delete</button>
                    {expandedLists.includes(index) && (
                      <Items key={index} listId={list.name} />
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {filteredArchivedLists.length > 0 && (
        <>
          <h2>Archived Lists</h2>
          <ul>
            {filteredArchivedLists.map((list, index) => (
              <li key={index}>
                <div>
                  <h3
                    onClick={() => toggleExpandArchivedList(index)}
                    style={{ cursor: "pointer" }}
                  >
                    {list.name}
                  </h3>
                  <button onClick={() => restoreList(index)}>Restore</button>
                  <button onClick={() => confirmDeleteArchivedList(index)}>
                    {confirmDeleteIndex === index ? "Are you sure?" : "Delete"}
                  </button>
                </div>
                {expandedArchivedLists.includes(index) && (
                  <div className="archived-items">
                    <Items key={index} listId={list.name} />
                  </div>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default CreateNewList;
