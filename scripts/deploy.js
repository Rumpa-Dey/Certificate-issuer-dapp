const hre = require("hardhat");

async function main() {
  // Get contract factory
  //const CertificateIssuer = await hre.ethers.getContractFactory("CertificateIssuer");
    const CertificateIssuer = await hre.ethers.getContractFactory("contracts/CertificateIssuer.sol:CertificateIssuer");



  // Deploy contract
  const certificateIssuer = await CertificateIssuer.deploy();

  // Wait for deployment to finish
  await certificateIssuer.waitForDeployment();

  // Get the deployed contract address
  const address = await certificateIssuer.getAddress();

  console.log(`✅ Contract deployed to: ${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
