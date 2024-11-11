pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract EvidenceManagement {
    struct Evidence {
        string evidenceId;
        string caseName;
        string victimName;
        string location;
        string description;
        string evidenceHash;
        string pdfHash;
        uint256 timestamp;
        address addedBy;
    }

    mapping(string => Evidence) private evidences;
    string[] private evidenceIds;
    uint256 public evidenceCount;

    event EvidenceAdded(
        string evidenceId,
        string caseName,
        string victimName,
        string location,
        string description,
        string evidenceHash,
        string pdfHash,
        address addedBy
    );

    function addEvidence(
        string memory _evidenceId,
        string memory _caseName,
        string memory _victimName,
        string memory _location,
        string memory _description,
        string memory _evidenceHash,
        string memory _pdfHash
    ) public {
        require(bytes(_evidenceId).length > 0, "Evidence ID cannot be empty");
        require(bytes(evidences[_evidenceId].evidenceId).length == 0, "Evidence with this ID already exists");

        evidences[_evidenceId] = Evidence(
            _evidenceId,
            _caseName,
            _victimName,
            _location,
            _description,
            _evidenceHash,
            _pdfHash,
            block.timestamp,
            msg.sender
        );

        evidenceIds.push(_evidenceId);
        evidenceCount++;

        emit EvidenceAdded(
            _evidenceId,
            _caseName,
            _victimName,
            _location,
            _description,
            _evidenceHash,
            _pdfHash,
            msg.sender
        );
    }

    function getEvidence(string memory _evidenceId) public view returns (
        string memory,
        string memory,
        string memory,
        string memory,
        string memory,
        string memory,
        string memory,
        uint256,
        address
    ) {
        Evidence memory e = evidences[_evidenceId];
        require(bytes(e.evidenceId).length > 0, "Evidence not found");
        return (
            e.evidenceId,
            e.caseName,
            e.victimName,
            e.location,
            e.description,
            e.evidenceHash,
            e.pdfHash,
            e.timestamp,
            e.addedBy
        );
    }

    function getAllEvidence() public view returns (string[] memory) {
        return evidenceIds;
    }
}

// const contractABI = [
//   // Add all ABI items here, including updated addEvidence and getEvidence with pdfHash
//   {
//     "constant": false,
//     "inputs": [
//       { "name": "_evidenceId", "type": "string" },
//       { "name": "_caseName", "type": "string" },
//       { "name": "_victimName", "type": "string" },
//       { "name": "_location", "type": "string" },
//       { "name": "_description", "type": "string" },
//       { "name": "_evidenceHash", "type": "string" },
//       { "name": "_pdfHash", "type": "string" }
//     ],
//     "name": "addEvidence",
//     "outputs": [],
//     "payable": false,
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "constant": true,
//     "inputs": [{ "name": "_id", "type": "string" }],
//     "name": "getEvidence",
//     "outputs": [
//       { "name": "evidenceId", "type": "string" },
//       { "name": "caseName", "type": "string" },
//       { "name": "victimName", "type": "string" },
//       { "name": "location", "type": "string" },
//       { "name": "description", "type": "string" },
//       { "name": "evidenceHash", "type": "string" },
//       { "name": "pdfHash", "type": "string" },
//       { "name": "timestamp", "type": "uint256" },
//       { "name": "addedBy", "type": "address" }
//     ],
//     "payable": false,
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "constant": true,
//     "inputs": [],
//     "name": "getAllEvidence",
//     "outputs": [{ "name": "", "type": "string[]" }],
//     "payable": false,
//     "stateMutability": "view",
//     "type": "function"
//   }
// ];
