import React, { useState } from "react";
import PropTypes from "prop-types";
import Members from "./Members";
import Items from "./Items";

function ListManager({
  lists,
  setLists,
  archivedLists,
  setArchivedLists,
  searchTerm,
}) {
  const [editingListIndex, setEditingListIndex] = useState(null);
  const [newListName, setNewListName] = useState("");
  const [expandedLists, setExpandedLists] = useState([]);
  const [expandedArchivedLists, setExpandedArchivedLists] = useState([]);
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState(null);

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

  function deleteArchivedList(index) {
    const updatedArchivedLists = archivedLists.filter((_, i) => i !== index);
    setArchivedLists(updatedArchivedLists);
  }

  function handleDeleteArchivedList(index) {
    if (confirmDeleteIndex === index) {
      deleteArchivedList(index);
      setConfirmDeleteIndex(null);
    } else {
      setConfirmDeleteIndex(index);
    }
  }

  const filteredLists = lists.filter((list) =>
    list.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2>Lists</h2>
      {filteredLists.length === 0 ? (
        <p>Create a new list first</p>
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
                <div className="list-item">
                  <h3
                    onClick={() => toggleExpandList(index)}
                    style={{ cursor: "pointer" }}
                  >
                    {list.name}
                  </h3>
                  <div className="button-container">
                    <button onClick={() => handleRenameList(index)}>
                      Rename
                    </button>
                    <button onClick={() => deleteList(index)}>Delete</button>
                  </div>
                  {expandedLists.includes(index) && (
                    <>
                      <Members
                        list={list}
                        onAddMember={(listName, member) =>
                          setLists((prev) =>
                            prev.map((l) =>
                              l.name === listName
                                ? { ...l, members: [...l.members, member] }
                                : l
                            )
                          )
                        }
                        onRemoveMember={(listName, member) =>
                          setLists((prev) =>
                            prev.map((l) =>
                              l.name === listName
                                ? {
                                    ...l,
                                    members: l.members.filter(
                                      (m) => m !== member
                                    ),
                                  }
                                : l
                            )
                          )
                        }
                      />
                      <Items key={index} listId={list.name} />
                    </>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {archivedLists.length > 0 && (
        <>
          <h2>Archived Lists</h2>
          <ul>
            {archivedLists.map((list, index) => (
              <li key={index}>
                <div>
                  <h3
                    onClick={() => toggleExpandArchivedList(index)}
                    style={{ cursor: "pointer" }}
                  >
                    {list.name}
                  </h3>
                  <div className="button-container">
                    <button onClick={() => restoreList(index)}>Restore</button>
                    <button onClick={() => handleDeleteArchivedList(index)}>
                      {confirmDeleteIndex === index
                        ? "Are you sure?"
                        : "Delete"}
                    </button>
                  </div>
                </div>
                {expandedArchivedLists.includes(index) && (
                  <div className="archived-items">
                    <Items key={index} listId={list.name} allowEdit={false} />
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

ListManager.propTypes = {
  lists: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      tasks: PropTypes.array.isRequired,
      members: PropTypes.array.isRequired,
    })
  ).isRequired,
  setLists: PropTypes.func.isRequired,
  archivedLists: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      tasks: PropTypes.array.isRequired,
      members: PropTypes.array.isRequired,
    })
  ).isRequired,
  setArchivedLists: PropTypes.func.isRequired,
  searchTerm: PropTypes.string.isRequired,
};

export default ListManager;
