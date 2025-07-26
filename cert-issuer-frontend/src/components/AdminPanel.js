import React, { useState } from "react";

const AdminPanel = ({ contract }) => {
  const [studentAddress, setStudentAddress] = useState("");
  const [studentName, setStudentName] = useState("");
  const [courseName, setCourseName] = useState("");
  const [certificates, setCertificates] = useState([]);
  const [revokeIndex, setRevokeIndex] = useState("");

  // Issue Certificate
  const handleIssueCertificate = async () => {
    try {
      const tx = await contract.issueCertificate(
        studentAddress,
        studentName,
        courseName
      );
      await tx.wait();
      alert("Certificate issued!");
    } catch (err) {
      console.error("Issue error:", err);
      alert("Error: " + err.reason || err.message);
    }
  };

  // View Certificates
  const handleFetchCertificates = async () => {
    try {
      const result = await contract.getCertificates(studentAddress);
      
      setCertificates(result);
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Error: " + err.reason || err.message);
    }
  };

  // Revoke Certificate
  const handleRevokeCertificate = async () => {
    try {
      const tx = await contract.revokeCertificate(studentAddress, revokeIndex);
      await tx.wait();
      alert("Certificate revoked!");
    } catch (err) {
      console.error("Revoke error:", err);
      alert("Error: " + err.reason || err.message);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h2>👩‍💼 Admin Panel</h2>

      {/* Issue Section */}
      <h4>📝 Issue Certificate</h4>
      <input
        placeholder="Student address"
        value={studentAddress}
        onChange={(e) => setStudentAddress(e.target.value)}
      />
      <input
        placeholder="Student name"
        value={studentName}
        onChange={(e) => setStudentName(e.target.value)}
      />
      <input
        placeholder="Course name"
        value={courseName}
        onChange={(e) => setCourseName(e.target.value)}
      />
      <button onClick={handleIssueCertificate}>Issue</button>

      {/* Fetch Section */}
      <h4 style={{ marginTop: "2rem" }}>🔍 View Certificates</h4>
      <button onClick={handleFetchCertificates}>Get Certificates</button>

      {certificates.length > 0 && (
        <ul>
          {certificates.map((cert, idx) => (
            <li key={idx}>
              #{idx} - {cert.studentName} ({cert.courseName}) -{" "}
              {cert.isValid ? "✅ Valid" : "❌ Revoked"}
            </li>
          ))}
        </ul>
      )}

      {/* Revoke Section */}
      <h4 style={{ marginTop: "2rem" }}>🚫 Revoke Certificate</h4>
      <input
        placeholder="Certificate index to revoke"
        value={revokeIndex}
        onChange={(e) => setRevokeIndex(e.target.value)}
        type="number"
      />
      <button onClick={handleRevokeCertificate}>Revoke</button>
    </div>
  );
};

export default AdminPanel;
