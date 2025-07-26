import React, { useState } from "react";

const StudentDashboard = ({ contract }) => {
  const [studentAddress, setStudentAddress] = useState("");
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCertificates = async () => {
    try {
      if (!contract) throw new Error("Smart contract not connected");
      setLoading(true);
      const certList = await contract.getCertificates(studentAddress);
      setCerts(certList);
    } catch (err) {
      console.error("Error fetching certificates:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
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
      <button onClick={fetchCertificates} disabled={loading}>
        {loading ? "Loading..." : "Get Certificates"}
      </button>

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
  );
};

export default StudentDashboard;
