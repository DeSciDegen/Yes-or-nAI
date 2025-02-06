# Yes-or-nAI
DAO Agent to participate in ETH Global Agentic hackathon
This AI Agent is designed to submit proposals and vote on DAO governance.

## Duplicate the .env.example template

```bash
cp .env.example .env
```

### Add keys to .env
```
OPENROUTER_API_KEY="******"
EVM_PRIVATE_KEY="******"
ETHEREUM_PROVIDER_SEPOLIA="******"
```

## Install node 23.3.0 using nvm

```bash
nvm install 23.3.0 && nvm use 23.3.0
```

## Install dependencies, build and start your agent

```bash
pnpm i && pnpm build && pnpm start
```

### 1. Propose

Propose a proposal to a governor on a specific chain.

- **Proposal**
    - **Targets**
    - **Values**
    - **Calldatas**
    - **Description**
- **Chain**
- **Governor**

**Example usage:**

```bash
Propose a proposal to the 0xdeadbeef00000000000000000000000000000000 governor on Ethereum to transfer 1 ETH to 0xRecipient.
```

### 2. Vote

Vote on a proposal to a governor on a specific chain.

- **Proposal ID**
- **Support**
- **Chain**
- **Governor**

**Example usage:**

```bash
Vote on the proposal with ID 1 to support the proposal on the 0xdeadbeef00000000000000000000000000000000 governor on Ethereum.
```

### 3. Queue

Queue a proposal to a governor on a specific chain.

- **Proposal**
    - **Targets**
    - **Values**
    - **Calldatas**
    - **Description**
- **Chain**
- **Governor**

**Example usage:**

```bash
Queue the proposal to the 0xdeadbeef00000000000000000000000000000000 governor on Ethereum.
```

### 4. Execute

Execute a proposal to a governor on a specific chain.

- **Proposal ID**
- **Chain**
- **Governor**

**Example usage:**

```bash
Execute the proposal with ID 1 on the 0xdeadbeef00000000000000000000000000000000 governor on Ethereum.
```


