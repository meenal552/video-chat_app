import React, { useEffect, useState } from "react";
import ChatMessages from "./ChatMessages";

const Chatbox = (props) => {
  const [messages, setmessages] = useState([
    {
      message: "Welcome!",
      user: "Server",
      timeStamp: Date.now(),
    },
  ]);
  const [temp, settemp] = useState("checking");
  useEffect(() => {
    props.socket.on("newMessage", (data) => {
      const msgs = messages;
      msgs.push({
        message: data.message,
        user: data.user,
        timeStamp: data.timeStamp,
      });
      console.log("mnew msgs");
      console.log(msgs);
      setmessages(msgs);
      settemp("checked");
    });
  }, []);
  const sendMessage = (event) => {
    event.preventDefault();

    const input = document.getElementById("chat-input");
    const inputValue = input.value;
    input.value = "";

    if (inputValue !== "") {
      console.log("mesagesend emitted");
      props.socket.emit("messageSend", {
        message: inputValue,
        timeStamp: Date.now(),
      });
    }
  };
  console.log("hello");
  return (
    <div className="chatbox" id="chatbox">
      <div className="chat-header">Chatbox</div>
      <div className="list-wrapper" id="all-messages">
        {/* {messages.map((message) => (
          <ChatMessages key={Math.random()} message={message} />
        ))} */}
        {messages.map((message) => {
          console.log("happenin " + messages.length);
          return (
            <>
              <ChatMessages key={message.timeStamp} message={message} />
            </>
          );
        })}

        <div className="list-end"></div>
      </div>

      <div class="chat-form-wrapper">
        <form onSubmit={sendMessage}>
          <input
            type="text"
            placeholder=" Write a message...."
            id="chat-input"
          />
        </form>
      </div>
    </div>
  );
};

export default Chatbox;
