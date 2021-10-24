import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { withRouter } from "react-router";
import Peer from "peerjs";

import Videochatroom from "./Videochatroom";
import Commonroom from "./Commonroom";
import Chatbox from "./Chatbox";

import { validate as uuidValidate } from "uuid";

import history from "../History";
import Temp2 from "./temp2";

const JoinRoom = (props) => {
  const [videoroom, gotovideoroom] = useState(0);
  const [socket, setSocket] = useState(null);
  // const [mypeer, setmypeer] = useState("");
  const [copied, setcopied] = useState(false);
  const [username, setusername] = useState(null);
  const [chatbox, setchatbox] = useState(false);

  useEffect(() => {
    // if (!uuidValidate(props.match.params.id)) {
    //   history.push("/room-not-found");
    // }
    const name = localStorage.getItem("userName") || null;
    setusername(name);
    document.getElementById("inputname").value = name;
    if (name) document.getElementById("hi").innerHTML = `Hii  ${name}  !!`;
  }, []);
  const setname = (name) => {
    setusername(name);
    console.log("local " + localStorage.getItem("userName"));
  };
  const setsocket = (socket) => {
    console.log("socket set using props");
    setSocket(socket);
  };

  // useEffect(() => {
  //   const myPeer = new Peer(undefined, {
  //     host: "/",
  //     port: "3008",
  //   });

  //   setmypeer(myPeer);

  //   console.log(props.match.params.id);
  //   console.log("mount it using useEffect!");

  //   const newsocket = io.connect("http://localhost:4000", {
  //     query: {
  //       roomId: props.match.params.id,
  //     },
  //   });
  //   setSocket(newsocket);

  //   myPeer.on("open", (id) => {
  //     console.log("user id send to join room " + id);
  //     newsocket.emit("add-to-room", id);
  //   });
  //   return () => {
  //     props.newsocket.emit("user-disconnected", props.myPeer.id);
  //     props.newsocket.removeAllListeners();

  //     props.myPeer.disconnect();
  //   };
  // }, []);

  const Joinvideochat = () => {
    console.log("props join room " + props.match.params.id);
    if (username != null) {
      if (videoroom === 0) {
        gotovideoroom(1);
      } else {
        gotovideoroom(0);
      }
    } else {
      alert("enter a username ");
    }
  };
  const copyRoomId = () => {
    var tempInput = document.createElement("input");
    tempInput.value = props.match.params.id;

    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);

    setcopied(true);
  };
  const chatsection = () => {
    console.log("setfunctionchat");
    if (chatbox === false) {
      setchatbox(true);
      document.getElementById("chatbox").style.display = "flex";
    } else {
      setchatbox(false);
      document.getElementById("chatbox").style.display = "none";
    }
  };

  return (
    <div>
      <header>
        <span id="video-btn">
          {videoroom === 0 ? (
            <button
              onClick={Joinvideochat}
              id="video-icon"
              className="icon-btn"
            >
              <i
                class="fa fa-video-camera"
                style={{ fontSize: "24px", color: "red" }}
              />
            </button>
          ) : (
            <button
              onClick={Joinvideochat}
              id="screen-icon"
              className="icon-btn"
            >
              <i
                class="fa fa-angle-double-left"
                style={{ fontSize: "24px", color: "yellow" }}
              />
            </button>
          )}
          <button id="comment-icon" className="icon-btn" onClick={chatsection}>
            <i
              // class="fas fa-comment"
              class="fa fa-comment"
              style={{ fontSize: "24px", color: "darkturquoise" }}
            />
          </button>
        </span>
        <nav>
          <div
            id="roomid"
            onClick={copyRoomId}
            onMouseOut={(_) => setcopied(false)}
          >
            <ul>
              <span className="tooltip">
                {copied ? "Copied!" : "Copy to clipboard"}
              </span>
              <li>
                Room ID:<span id="id"> {props.match.params.id}</span>{" "}
              </li>
            </ul>
          </div>
        </nav>
      </header>
      {socket != null ? <Chatbox socket={socket}></Chatbox> : <></>}
      {/* <Chatbox socket={socket}></Chatbox> */}

      {/* <button onClick={Joinvideochat}>Join for video chat</button> */}
      {videoroom === 0 ? (
        <Commonroom setname={setname}></Commonroom>
      ) : (
        <Videochatroom setsocket={setsocket}></Videochatroom>
      )}
    </div>
  );
};
export default withRouter(JoinRoom);
