import React, { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { motion } from "framer-motion";
import { Send, Loader2 } from "lucide-react";

interface Message {
  sender: "user" | "ai";
  content: string;
}

const ChatbotGovernance: React.FC = () => {
  const { active, account } = useWeb3React();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (active && account) {
      // Fetch initial DAO data or perform any necessary setup
    }
  }, [active, account]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { sender: "user", content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setLoading(true);

    // Process the user's command
    const aiResponse = await processCommand(input);
    const aiMessage: Message = { sender: "ai", content: aiResponse };
    setMessages((prevMessages) => [...prevMessages, aiMessage]);
    setLoading(false);
  };

  const processCommand = async (command: string): Promise<string> => {
    // This is a mock implementation. Replace with actual logic and smart contract interactions.
    if (command.toLowerCase().includes("submit a proposal")) {
      return "Proposal submitted successfully. Proposal ID: #1234";
    } else if (command.toLowerCase().includes("vote")) {
      return "Vote cast successfully on Proposal #3";
    } else if (command.toLowerCase().includes("check the status")) {
      return "Proposal #5 is currently active with 65% YES votes and 35% NO votes.";
    } else {
      return "I'm sorry, I didn't understand that command. Please try again.";
    }
  };
  
  return (
    <div className="flex flex-col items-center h-screen bg-gray-900 text-white p-6">
      <motion.h1
        className="text-3xl font-bold mb-4 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Chatbot Governance Interface
      </motion.h1>
      <div className="w-full max-w-2xl bg-gray-800 rounded-lg p-4 h-96 overflow-y-auto mb-4 shadow-lg">
        {messages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: message.sender === "user" ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            className={`mb-2 flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <span
              className={`inline-block rounded-lg px-4 py-2 text-sm shadow-md max-w-xs ${
                message.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-600 text-white"
              }`}
            >
              {message.content}
            </span>
          </motion.div>
        ))}
        {loading && (
          <div className="flex justify-center items-center mt-2">
            <Loader2 className="animate-spin text-white" size={24} />
          </div>
        )}
      </div>

      <div className="w-full max-w-2xl flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your command..."
          className="flex-grow border border-gray-700 bg-gray-700 rounded-l px-4 py-2 text-white focus:outline-none"
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-r flex items-center"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
        </button>
      </div>
    </div>
  );
};

export default ChatbotGovernance;
