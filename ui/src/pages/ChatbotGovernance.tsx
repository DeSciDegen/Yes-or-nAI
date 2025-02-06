import React from "react"
import { useState, useEffect } from "react"
import { useWeb3React } from "@web3-react/core"

interface Message {
  sender: "user" | "ai"
  content: string
}

const ChatbotGovernance: React.FC = () => {
  const { active, account, library } = useWeb3React()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")

  useEffect(() => {
    if (active && account) {
      // Fetch initial DAO data or perform any necessary setup
    }
  }, [active, account])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = { sender: "user", content: input }
    setMessages((prevMessages) => [...prevMessages, userMessage])
    setInput("")

    // Process the user's command
    const aiResponse = await processCommand(input)
    const aiMessage: Message = { sender: "ai", content: aiResponse }
    setMessages((prevMessages) => [...prevMessages, aiMessage])
  }

  const processCommand = async (command: string): Promise<string> => {
    // This is a mock implementation. Replace with actual logic and smart contract interactions.
    if (command.toLowerCase().includes("submit a proposal")) {
      return "Proposal submitted successfully. Proposal ID: #1234"
    } else if (command.toLowerCase().includes("vote")) {
      return "Vote cast successfully on Proposal #3"
    } else if (command.toLowerCase().includes("check the status")) {
      return "Proposal #5 is currently active with 65% YES votes and 35% NO votes."
    } else {
      return "I'm sorry, I didn't understand that command. Please try again."
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Chatbot Governance Interface</h1>

      <div className="bg-gray-100 rounded-lg p-4 h-96 overflow-y-auto mb-4">
        {messages.map((message, index) => (
          <div key={index} className={`mb-2 ${message.sender === "user" ? "text-right" : "text-left"}`}>
            <span
              className={`inline-block rounded-lg px-3 py-2 ${
                message.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-300 text-black"
              }`}
            >
              {message.content}
            </span>
          </div>
        ))}
      </div>

      <div className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your command..."
          className="flex-grow border border-gray-300 rounded-l px-3 py-2 text-slate-950"
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-r"
        >
          Send Command
        </button>
      </div>

      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">Supported Commands:</h2>
        <ul className="list-disc list-inside">
          <li>"Submit a proposal to increase staking rewards."</li>
          <li>"Vote YES on Proposal #3."</li>
          <li>"Check the status of Proposal #5."</li>
        </ul>
      </div>
    </div>
  )
}

export default ChatbotGovernance

