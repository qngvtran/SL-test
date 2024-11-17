import React, { useState } from "react";
import PropTypes from "prop-types";
import "../styles/Members.css";

function Members({ list, onAddMember, onRemoveMember }) {
  const [newMember, setNewMember] = useState("");

  function handleAddMember() {
    if (newMember.trim() !== "") {
      onAddMember(list.name, newMember);
      setNewMember("");
    }
  }

  return (
    <div className="members-container">
      <div className="add-member-container">
        <input
          className="member-input"
          type="text"
          value={newMember}
          onChange={(e) => setNewMember(e.target.value)}
          placeholder="Enter member's name..."
        />
        <button className="add-member-button" onClick={handleAddMember}>
          Add
        </button>
      </div>

      <ul className="members-list">
        {list.members.map((member, index) => (
          <li key={index} className="member-item">
            <span className="member-name">{member}</span>
            <button
              className="remove-button"
              onClick={() => onRemoveMember(list.name, member)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

Members.propTypes = {
  list: PropTypes.shape({
    name: PropTypes.string.isRequired,
    tasks: PropTypes.array.isRequired,
    members: PropTypes.array.isRequired,
  }).isRequired,
  onAddMember: PropTypes.func.isRequired,
  onRemoveMember: PropTypes.func.isRequired,
};

export default Members;
