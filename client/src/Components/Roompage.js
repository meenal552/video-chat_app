import React, { Component } from "react";
import { v4 as uuid } from "uuid";
import history from "../History";
import { withRouter } from "react-router";

class Roompage extends Component {
  joinRoom = (e) => {
    const input = document.querySelector("#room-id");
    const roomId = input.value.length > 0 ? input.value : uuid();
    console.log("room id ", roomId);
    history.push(`/room/${roomId}`);
  };
  render() {
    return (
      <div>
        <header>
          <nav>
            <ul>
              <li>WELCOME</li>
            </ul>
          </nav>
        </header>
        <div class="main">
          <form onSubmit={this.joinRoom}>
            <label htmlFor="room-id" class="label">
              Enter a room ID:
            </label>
            <div id="room-id-input-wrapper">
              <input id="room-id" class="input" type="text" autoFocus />
              <button class="btn-side" onClick={this.joinRoom}>
                {">"}
              </button>
            </div>
            <input type="submit" hidden />
          </form>
          <div className="label">or</div>

          <form onSubmit={this.joinRoom}>
            <button class="btn-main">Create a new room</button>
            <input type="submit" hidden />
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(Roompage);
