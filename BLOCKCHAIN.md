# NeuroSync Blockchain Integration

This document provides an overview of the blockchain integration features in NeuroSync AI.

## Features

### 1. Smart Contracts

NeuroSync uses three main smart contracts:

- **NeuroSyncToken (NEURO)** - ERC-20 token for the reward system
- **TherapistVerification** - Soulbound Token (SBT) for verifying mental health professionals
- **UserData** - Storage and access control for user data references

These contracts are stored in the `contracts/` directory and can be deployed using Hardhat.

### 2. Tokenomics

NeuroSync implements a tokenomics system to encourage engagement with mental health activities:

- **Earning tokens**: Users earn NEURO tokens for daily check-ins, completing mindfulness exercises, achieving weekly goals, and maintaining streaks.
- **Redeeming tokens**: Tokens can be redeemed for premium features, therapist consultations, and data exports.
- **Anti-gaming mechanics**: Cooldown periods prevent abuse and ensure genuine engagement.

### 3. Wallet-Based Login

NeuroSync offers wallet-based authentication through MetaMask:

- **Privacy-first**: Users can login without providing personal information.
- **Decentralized identity**: Wallet address serves as a decentralized identifier.
- **Signature-based auth**: Secure message signing verifies wallet ownership.

### 4. Decentralized Storage

User data is stored securely using a combination of IPFS and blockchain:

- **Encrypted storage**: Data is encrypted client-side before being uploaded to IPFS.
- **Blockchain references**: Only references (IPFS CIDs) are stored on-chain.
- **User-controlled access**: Users grant and revoke access to their data.

## Setup

### Prerequisites

- Node.js and npm
- MetaMask wallet
- Polygon Mumbai testnet or Ethereum Sepolia testnet account with test tokens

### Installation

1. Install dependencies:
   ```
   npm install
   ```

2. Configure environment variables:
   ```
   cp .env.blockchain .env.local
   ```
   Then edit `.env.local` with your specific configuration.

3. Deploy contracts (for development):
   ```
   npx hardhat run scripts/deploy.js --network localhost
   ```
   
   Or deploy to testnet:
   ```
   npx hardhat run scripts/deploy.js --network mumbai
   ```

4. Update `.env.local` with the deployed contract addresses.

### Running the Development Environment

1. Start a local Hardhat node:
   ```
   npx hardhat node
   ```

2. Start the Next.js development server:
   ```
   npm run dev
   ```

## API Endpoints

The following API endpoints are available for blockchain integration:

- **POST /api/blockchain/authenticate** - Authenticate with wallet signature
- **GET /api/blockchain/token-balance** - Get NEURO token balance
- **POST /api/blockchain/reward** - Reward user for completing an action
- **POST /api/blockchain/redeem** - Redeem tokens for a service
- **POST /api/blockchain/store-data** - Store data reference on IPFS and blockchain
- **GET /api/blockchain/user-data** - Get user data references
- **POST /api/blockchain/verify-therapist** - Verify a therapist with credentials
- **GET /api/blockchain/check-therapist** - Check therapist verification status

## Security Considerations

- **Private keys**: Never commit private keys or mnemonic phrases to source control.
- **Client-side encryption**: All sensitive user data is encrypted before being uploaded to IPFS.
- **IPFS content addressing**: Content can only be retrieved with the correct CID.
- **Access control**: Smart contracts enforce access rules for user data.

## Frontend Components

The following React components are provided for blockchain integration:

- **WalletLoginButton** - Allows users to connect MetaMask and authenticate.
- **TokenStats** - Displays token balance, transaction history, and redemption options.
- **TherapistBadge** - Shows verified therapist credentials (not implemented yet).

## Resources

- [Ethers.js Documentation](https://docs.ethers.org/v5/)
- [NFT.Storage Documentation](https://nft.storage/docs/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/) 