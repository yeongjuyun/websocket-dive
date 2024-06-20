import { useEffect, useRef } from "react";
import { Message } from "../types/chat";

type ChatBoxProps = {
  messages: Message[];
  username: string;
  sendMessage: (username: string, message: string) => void;
};

const ChatBox = (props: ChatBoxProps) => {
  const { messages, username, sendMessage } = props;

  const chatBoxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputRef.current && inputRef.current.value.trim() !== "") {
      sendMessage(username, inputRef.current.value);
      inputRef.current.value = "";
    }
  };

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div>
      <div
        ref={chatBoxRef}
        className="h-72 flex-1 overflow-y-auto rounded-lg border border-gray-300 bg-gray-50 p-2"
      >
        {messages.map((msg, index) => (
          <div key={index} className="my-1 rounded bg-gray-200 p-2">
            <strong>{msg.username}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="mt-2 flex w-full">
        <input
          ref={inputRef}
          type="text"
          placeholder="Type a message..."
          className="flex-grow rounded-l border border-gray-300 p-2 outline-none"
        />
        <button
          type="submit"
          className="cursor-pointer rounded-r border-none bg-blue-500 px-6 text-white outline-none"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
