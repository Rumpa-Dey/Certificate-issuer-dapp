import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import certificateABI from "./utils/certificateABI.json";
import ConnectWallet from "./components/ConnectWallet";
import AdminPanel from "./components/AdminPanel"; // NEW
import StudentDashboard from "./components/StudentDashboard";  //new
// import IssueCertificateForm from "./components/IssueCertificateForm"; // no longer needed

const contractAddress = "0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0";

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [studentAddress, setStudentAddress] = useState("");
  const [certs, setCerts] = useState([]);

  useEffect(() => {
    const initContract = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        const certificateContract = new ethers.Contract(
          contractAddress,
          certificateABI,
          signer
        );

        setAccount(address);
        setContract(certificateContract);

        const ownerAddress = await certificateContract.owner();
        setIsOwner(ownerAddress.toLowerCase() === address.toLowerCase());
      }
    };

    initContract();
  }, []);


useEffect(() => {
  if (account && !isOwner) {
    setStudentAddress(account);  // Auto-fill for student
  }
}, [account, isOwner]);


useEffect(() => {
  const fetchOwnerStatus = async () => {
    if (account && contract) {
      const ownerAddress = await contract.owner();
      setIsOwner(ownerAddress.toLowerCase() === account.toLowerCase());
    }
  };

  fetchOwnerStatus();
}, [account, contract]);


  const fetchCertificates = async () => {
    try {
      if (!contract) throw new Error("Smart contract not connected");

      const certList = await contract.getCertificates(studentAddress);
      setCerts(certList);
    } catch (err) {
      console.error("Error fetching certificates:", err);
      alert(err.message);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1.5rem" }}>
        🎓 Certificate Issuer DApp
      </h1>

      <ConnectWallet onConnect={setAccount} />

      {account && contract && isOwner ? (
        <AdminPanel contract={contract} />
      ) : (
        // Student section
        <div style={{
          marginTop: "3rem",
          padding: "1rem",
          border: "1px solid #ccc",
          borderRadius: "8px"
        }}>
          <h3>🎓 Student Dashboard - View Your Certificates</h3>
          <input
            type="text"
            placeholder="Enter your wallet address"
            value={studentAddress}
            onChange={(e) => setStudentAddress(e.target.value)}
            style={{ marginRight: "10px", padding: "0.5rem", width: "300px" }}
          />
          <button onClick={fetchCertificates}>Get Certificates</button>

          {certs.length > 0 && (
            <ul style={{ marginTop: "1rem" }}>
              {certs.map((cert, idx) => (
                <li key={idx} style={{ marginBottom: "0.5rem" }}>
                  🧑 Name: {cert.studentName} | 📚 Course: {cert.courseName} | 📅 Date Issued:{" "}
                  {new Date(Number(cert.dateIssued) * 1000).toLocaleDateString()} | Valid:{" "}
                  {cert.isValid ? "✅" : "❌"}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
