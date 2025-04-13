const { ethers } = require("hardhat");

/**
 * Deployment script for NeuroSync contracts
 * This deploys the NeuroSyncToken, TherapistVerification, and UserData contracts
 */
async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Deploy NeuroSync Token
  const NeuroSyncToken = await ethers.getContractFactory("NeuroSyncToken");
  const tokenContract = await NeuroSyncToken.deploy(deployer.address);
  await tokenContract.deployed();
  console.log("NeuroSyncToken deployed to:", tokenContract.address);

  // Deploy Therapist Verification
  const TherapistVerification = await ethers.getContractFactory("TherapistVerification");
  const therapistContract = await TherapistVerification.deploy(deployer.address);
  await therapistContract.deployed();
  console.log("TherapistVerification deployed to:", therapistContract.address);

  // Deploy User Data
  const UserData = await ethers.getContractFactory("UserData");
  const userDataContract = await UserData.deploy(deployer.address);
  await userDataContract.deployed();
  console.log("UserData deployed to:", userDataContract.address);

  console.log("");
  console.log("Deployment Summary:");
  console.log("===================");
  console.log(`NeuroSyncToken: ${tokenContract.address}`);
  console.log(`TherapistVerification: ${therapistContract.address}`);
  console.log(`UserData: ${userDataContract.address}`);
  console.log("");
  console.log("Set these addresses in your .env file:");
  console.log(`TOKEN_CONTRACT_ADDRESS=${tokenContract.address}`);
  console.log(`THERAPIST_CONTRACT_ADDRESS=${therapistContract.address}`);
  console.log(`USER_DATA_CONTRACT_ADDRESS=${userDataContract.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 