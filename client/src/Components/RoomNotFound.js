import React from "react";
import { Link } from "react-router-dom";

const RoomNotFound = () => {
  return (
    <div id="room-not-found-wrapper">
      <div id="room-not-found-title">Room Not Found</div>
      <button>
        <Link to="/" className="link">
          Go to Home
        </Link>
      </button>
    </div>
  );
};

export default RoomNotFound;
