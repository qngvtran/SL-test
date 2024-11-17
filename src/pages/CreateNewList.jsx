import React, { useState, useEffect } from "react";
import ListManager from "../components/ListManager";
import SearchBar from "../components/SearchBar";
import "../styles/CreateNewList.css";

function CreateNewList() {
  const [listName, setListName] = useState("");
  const [lists, setLists] = useState([]);
  const [archivedLists, setArchivedLists] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

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
        members: [],
      };
      setLists((prevLists) => [...prevLists, newList]);
      setListName("");
    }
  }

  function deleteArchivedList(listToDelete) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this list?"
    );
    if (confirmDelete) {
      setArchivedLists((prevArchivedLists) =>
        prevArchivedLists.filter((list) => list !== listToDelete)
      );
    }
  }

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

      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <ListManager
        lists={lists}
        setLists={setLists}
        archivedLists={archivedLists}
        setArchivedLists={setArchivedLists}
        searchTerm={searchTerm}
        deleteArchivedList={deleteArchivedList}
      />
    </div>
  );
}

export default CreateNewList;
