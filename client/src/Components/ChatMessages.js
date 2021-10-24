import React, { useEffect } from "react";

const ChatMessages = (props) => {
  const convertTime = (timeStamp) => {
    const date = new Date(timeStamp);

    let hours = date.getHours();
    let ampm = hours < 12 ? "AM" : "PM";
    hours = hours % 12;
    if (hours === 0) hours = 12;

    let minutes = date.getMinutes();
    if (minutes < 10) minutes = "0" + minutes;

    let timeString = hours + ":" + minutes + " " + ampm;
    return timeString;
  };
  const message = props.message;
  console.log("inside chatmessages");
  return (
    <div id="chat-card-wrapper" key={Math.random()}>
      <div id="message-card-header">
        <div id="messenger-name">{message.user}</div>

        <div id="message-time">{convertTime(message.timeStamp)}</div>
      </div>

      <div id="message">
        <p>{message.message}</p>
      </div>
    </div>
  );
};

export default ChatMessages;
