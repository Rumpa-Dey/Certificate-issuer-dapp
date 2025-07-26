// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CertificateIssuer {
    address public owner;

    struct Certificate {
        string studentName;
        string courseName;
        uint256 dateIssued;
        bool isValid;
    }

    mapping(address => string) public studentNames;
    mapping(address => Certificate[]) public studentCertificates;

    event CertificateIssued(address indexed student, string courseName);
    event CertificateRevoked(address indexed student, uint index);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only contract owner can perform this action");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function issueCertificate(
        address student,
        string memory studentName,
        string memory courseName
    ) public onlyOwner {

       // Checking same address must always have the same name

       if (bytes(studentNames[student]).length > 0) {
        require(
            keccak256(bytes(studentNames[student])) == keccak256(bytes(studentName)),
            "Student name does not match previous records");
         } else {
        studentNames[student] = studentName;
       }
        
        Certificate memory cert = Certificate({
            studentName: studentName,
            courseName: courseName,
            dateIssued: block.timestamp,
            isValid: true
        });

        studentCertificates[student].push(cert);
        emit CertificateIssued(student, courseName);
    }

    function getCertificates(address student) public view returns (Certificate[] memory) {
        return studentCertificates[student];
    }

    function revokeCertificate(address student, uint index) public onlyOwner {
        require(index < studentCertificates[student].length, "Invalid certificate index");
        studentCertificates[student][index].isValid = false;
        emit CertificateRevoked(student, index);
    }
}
