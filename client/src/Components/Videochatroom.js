import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { withRouter } from "react-router-dom";
import Peer from "peerjs";

//import { validate as uuidValidate } from "uuid";

const Videochatroom = (props) => {
  // let socketInstance = useRef(null);

  const [socket, setSocket] = useState(null);
  const [peers, addpeers] = useState({});
  const [mypeerID, setmypeerID] = useState("");
  const [mypeer, setmypeer] = useState("");
  const [mystreams, setmystream] = useState("");
  const [mute, setmute] = useState(true);
  const [video_icon, setvideo_icon] = useState(true);
  const [screenshare_icon, setscreenshare_icon] = useState(false);
  const [username, setusername] = useState("");

  useEffect(() => {
    document.getElementById("comment-icon").style.visibility = "visible";
    const myPeer = new Peer(undefined, {
      host: "/",
      port: "3008",
    });
    setmypeer(myPeer);
    let mystream = "";
    //setmypeer(myPeer);

    console.log(props.match.params.id);
    console.log("mount it using useEffect!");

    const userName = localStorage.getItem("userName");
    setusername(userName);
    const newsocket = io.connect("http://localhost:4000", {
      query: {
        roomId: props.match.params.id,
        userName,
      },
    });
    console.log("socket id " + newsocket.id);
    setSocket(newsocket);
    props.setsocket(newsocket);

    myPeer.on("open", (id) => {
      console.log("user id send to join room " + id);

      setmypeerID(id);
      newsocket.emit("join-room", id);
    });

    const myVideo = document.getElementById("myvideo");
    myVideo.muted = true;

    console.log("alright now ");
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        mystream = stream;
        setmystream(stream);
        addVideoStream(myVideo, stream);

        newsocket.on("user-connected", (data) => {
          console.log("user id received of new user" + data.id + data.username);
          setTimeout(connectToNewUser, 1000, data, stream, myPeer, newsocket);
          // connectToNewUser(userId, stream, myPeer);
        });
        newsocket.on("user-disconnected", (userId) => {
          console.log("userid disconnected " + userId);
          const disconnectedVideo = document.getElementById(userId);
          const userdiv = document.getElementById(userId + "a");
          if (userId) {
            disconnectedVideo.remove();

            userdiv.remove();
          }

          if (peers[userId]) peers[userId].close();
        });
        newsocket.on("mute-unmute", (data) => {
          if (data.id != myPeer.id) {
            const peervideo = document.getElementById(data.id);
            if (data.mute) peervideo.muted = true;
            else peervideo.muted = false;
          }
        });
        newsocket.on("togglestream", (peerid) => {
          if (peerid != myPeer.id) {
            console.log("togglestream");
            const peervideo = document.getElementById(peerid);
            const stream = peervideo.srcObject;
            const tracks = stream.getTracks();
            tracks.forEach((track) => {
              if (track.kind == "video") {
                track.stop();
              }
            });
          }
        });

        myPeer.on("call", (call) => {
          console.log("someone calling");
          call.answer(stream);
          const memberid = document.getElementById(call.peer);
          let video = "";
          if (memberid != null) {
            console.log("member if not null ");
            video = memberid;
            video.muted = true;
            call.on("stream", (stream) => {
              video.srcObject = stream;
              video.play();
            });
            call.on("close", () => {
              console.log("call closing");
              myVideo.remove();
            });
          } else {
            video = document.createElement("video");
            console.log("call.peer " + call.peer);
            video.id = call.peer;
            video.muted = true;
            let receivedusername = "";
            newsocket.emit("getUsername", call.peer);
            newsocket.on("getUsername", (data) => {
              receivedusername = data;
              console.log("getusername received call " + receivedusername);
            });

            call.on("stream", (userVideoStream) => {
              addVideoStream(video, userVideoStream, receivedusername);
            });

            call.on("close", () => {
              console.log("call closing");
              myVideo.remove();
            });
          }
        });
      });

    // return works like component will unmount
    return () => {
      newsocket.emit("user-disconnected", myPeer.id);
      newsocket.removeAllListeners();

      mystream.getTracks().forEach(function (track) {
        if (track.readyState == "live") {
          track.stop();
        }
      });
      myPeer.disconnect();
      document.getElementById("comment-icon").style.visibility = "hidden";
      document.getElementById("chatbox").style.display = "none";
    };
  }, []);

  const connectToNewUser = async (data, stream, myPeer, socket) => {
    console.log("connecting to newuser! " + data.username);
    // socket.emit("getUsername");
    const call = await myPeer.call(data.id, stream);

    // adding peers flush updates
    console.log("peers adding ");
    addpeers((prevstate) => ({
      ...prevstate,
      [data.id]: call,
    }));

    const video = document.createElement("video");
    video.id = data.id;
    video.className = "peer-videos";
    video.muted = true;
    console.log("cALL " + call + "peer " + myPeer.id);
    if (call === null || call === "" || call === undefined) console.log("null");

    await call.on("stream", (userVideoStream) => {
      console.log("streaming ");
      addVideoStream(video, userVideoStream, data.username);
    });
  };

  const addVideoStream = async (video, stream, username = "") => {
    console.log("adding video stream with id ", video.id);
    let div;

    const videoGrid = document.getElementById("video-grid");

    video.srcObject = stream;
    await video.addEventListener("loadedmetadata", () => {
      if (video.id != "myvideo") {
        div = document.createElement("div");
        div.className = "self-video";
        div.id = video.id + "a";
        div.append(video);

        const span = document.createElement("span");
        const fullscreen = document.createElement("button");
        span.className = "username";
        span.innerHTML = username;
        fullscreen.innerHTML = "[ ]";
        fullscreen.className = "share-btn";
        fullscreen.addEventListener("click", () => {
          // video.requestFullscreen();

          video.classList.toggle("fullscreen");
        });
        span.append(fullscreen);
        div.append(span);
      }
      video.play();
      if (video.id === "myvideo") {
      } else {
        div.className = "notself-video";
        const x = document.getElementById(video.id + "a");
        if (x != null) {
          console.log("removing div");
          x.remove();
        }
        videoGrid.append(div);
      }
    });

    console.log(":appending");
  };

  const muteunmute = () => {
    const v = document.getElementById("myvideo");
    const data = {
      id: mypeerID,
    };
    if (v.muted) {
      v.muted = false;
      data.mute = false;
      setmute(false);
    } else {
      v.muted = true;
      data.mute = true;
      setmute(true);
    }
    console.log("mute " + mypeerID);

    socket.emit("mute-unmute", data);
  };
  const togglestream = () => {
    console.log("video icon value " + video_icon);
    const myvideo = document.getElementById("myvideo");
    mystreams.getTracks().forEach((track) => {
      if (track.kind === "video") {
        if (track.readyState == "live") {
          console.log(":true ");
          track.stop();
          setvideo_icon(false);
          myvideo.src = "";
          myvideo.srcObject = null;
          socket.emit("togglestream", mypeerID);
        } else {
          console.log(":false");
          navigator.mediaDevices
            .getUserMedia({
              video: true,
              audio: true,
            })
            .then((stream) => {
              setmystream(stream);
              const video = document.getElementById("myvideo");
              video.srcObject = stream;
              video.addEventListener("loadedmetadata", () => {
                video.play();
              });
              socket.emit("getPeers");
              socket.on("getPeers", (peers) => {
                peers.forEach((peer) => {
                  mypeer.call(peer, stream);
                });
              });
            });
          setvideo_icon(true);
        }
      }
    });
  };
  const screenshare = () => {
    const myvideo = document.getElementById("myvideo");
    if (video_icon == true || screenshare_icon == true) {
      mystreams.getTracks().forEach((track) => {
        if (track.kind === "video") {
          if (track.readyState == "live") {
            console.log(":true ");
            track.stop();
            setvideo_icon(false);
            myvideo.src = "";
            myvideo.srcObject = null;
            socket.emit("togglestream", mypeerID);
          }
        }
      });
    }
    if (screenshare_icon == false) {
      navigator.mediaDevices
        .getDisplayMedia({
          video: true,
        })
        .then((stream) => {
          setmystream(stream);
          setscreenshare_icon(true);
          const video = document.getElementById("myvideo");
          video.srcObject = stream;
          socket.emit("getPeers");
          socket.on("getPeers", (peers) => {
            peers.forEach((peer) => {
              mypeer.call(peer, stream);
            });
          });
        });
    } else {
      setscreenshare_icon(false);
    }
  };
  return (
    <div>
      <h2>PEERS</h2>
      <div className="video-main">
        <div class="self-video">
          <video id="myvideo" />

          {mute === true ? (
            <button
              onClick={muteunmute}
              id="mute-icon"
              className="video_chat_icons"
            >
              <i
                class="fas fa-microphone-slash"
                style={{ fontSize: "24px", color: "red" }}
              />
            </button>
          ) : (
            <button
              onClick={muteunmute}
              id="unmute-icon"
              className="video_chat_icons"
            >
              <i
                class="fas fa-microphone"
                style={{ fontSize: "24px", color: "red" }}
              />
            </button>
          )}
          {video_icon === true ? (
            <button
              onClick={togglestream}
              id="mute-icon"
              className="video_chat_icons"
            >
              <i
                class="fa fa-video"
                style={{ fontSize: "24px", color: "red" }}
              />
            </button>
          ) : (
            <button
              onClick={togglestream}
              id="unmute-icon"
              className="video_chat_icons"
            >
              <i
                class="fa fa-video-slash"
                style={{ fontSize: "24px", color: "red" }}
              />
            </button>
          )}
          <button
            onClick={screenshare}
            id="screen-icon"
            className="video_chat_icons"
          >
            <i class="fa fa-tv" style={{ fontSize: "24px", color: "red" }} />
          </button>
          <span className="username">{username}</span>
        </div>

        <div id="video-grid"></div>
      </div>
    </div>
  );
};
export default withRouter(Videochatroom);
