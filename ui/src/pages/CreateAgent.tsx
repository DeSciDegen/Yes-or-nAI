import React, { useState, useEffect } from "react";

// Declare the ethereum property on the window object
declare global {
  interface Window {
    ethereum: any;
  }
}
import { ethers } from "ethers";

const AGENT_FACTORY_ADDRESS = "0xYourDeployedContractAddress"; // Replace with deployed contract
const AGENT_FACTORY_ABI = [
  "function createAgent() public",
  "function getAgent(address owner) public view returns (address)"
];

export default function CreateAgent() {
  const [agentAddress, setAgentAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    fetchAgentAddress();
  }, []);
  
  const fetchAgentAddress = async () => {
    if (!window.ethereum) return;
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(AGENT_FACTORY_ADDRESS, AGENT_FACTORY_ABI, signer);
      const ownerAddress = await signer.getAddress();
      const agent = await contract.getAgent(ownerAddress);
      setAgentAddress(agent !== ethers.constants.AddressZero ? agent : null);
    } catch (error) {
      console.error("Error fetching agent address:", error);
    }
  };

  const createAgent = async () => {
    if (!window.ethereum) return alert("Please install Metamask");

    try {
      setLoading(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(AGENT_FACTORY_ADDRESS, AGENT_FACTORY_ABI, signer);

      const tx = await contract.createAgent();
      await tx.wait();
      await fetchAgentAddress();
    } catch (error) {
      console.error("Error creating agent:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center text-center bg-gray-900 text-white">
      <h2 className="text-4xl font-bold">Create Your Agent</h2>
      <button
        className="mt-4 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
        onClick={createAgent}
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Agent"}
      </button>

      {agentAddress && (
        <p className="mt-4 text-lg">
          Agent Address: <span className="font-mono">{agentAddress}</span>
        </p>
      )}
    </div>
  );
}
