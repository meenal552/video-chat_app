import React, { useState } from "react";

export default function Commonroom(props) {
  const [username, setusername] = useState(null);
  // const startvideo = (e) => {
  //   console.log("uploaded");
  //   if (e.target.files.length == 0) {
  //     console.log("empty");
  //   }

  //   let file = e.target.files[0];
  //   const video = document.getElementById("uploaded-video");
  //   video.src = URL.createObjectURL(file);

  //   let type = file.type;
  //   if (!video.canPlayType(type)) {
  //     alert("cannot play that file");
  //     return;
  //   }

  //   video.play().then(() => {
  //     if (typeof video.mozCaptureStream == "function") {
  //       window.localVideoStream = video.mozCaptureStream();
  //     } else if (typeof video.captureStream == "function") {
  //       window.localVideoStream = video.captureStream();
  //     }
  //   });
  // };
  const handlechange = (e) => {
    const username = e.target.value;
    if (username.length > 0) {
      localStorage.setItem("userName", username);
      setusername(username);
    }
  };
  const handlesubmit = (e) => {
    e.preventDefault();
    if (username === null) {
      alert("enter a valid name");
    } else {
      document.getElementById("hi").innerHTML = `Hii  ${username}  !!`;
      props.setname(username);
    }
  };
  return (
    <div className="common-room">
      <form onSubmit={handlesubmit}>
        <label>Enter Name</label>
        <input
          id="inputname"
          type="text"
          placeholder="Enter your name"
          onChange={handlechange}
        />

        <input type="submit" class="submit" value="Use Name"></input>
      </form>
      <h4 id="hi"></h4>
      {/* <input
        type="file"
        accept="video/*'"
        onChange={startvideo}
        id="uploaded-file"
      ></input>
      <video id="uploaded-video" autoPlay controls></video> */}
    </div>
  );
}
