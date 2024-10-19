pragma solidity ^0.5.0;

contract EvidenceManagement {
    // uint public evidenceCount = 0;

    // Struct to store evidence data
    struct Evidence {
        string evidenceHash; // Hash of the evidence (could be a file hash)
        string description;  // Description of the evidence
        uint256 timestamp;   // Time evidence was added
        address addedBy;     // Address of the user who added it
    }

    // Mapping to store evidences with unique ids
    mapping(uint256 => Evidence) public evidences;
    uint256 public evidenceCount;

    // Event to trigger when new evidence is added
    event EvidenceAdded(uint256 evidenceId, string evidenceHash, string description, address addedBy);

    // Function to add new evidence
    function addEvidence(string memory _evidenceHash, string memory _description) public {
        evidenceCount++;
        evidences[evidenceCount] = Evidence(_evidenceHash, _description, block.timestamp, msg.sender);

        // Emit event
        emit EvidenceAdded(evidenceCount, _evidenceHash, _description, msg.sender);
    }

    // Function to get evidence by ID
    function getEvidence(uint256 _id) public view returns (string memory, string memory, uint256, address) {
        Evidence memory e = evidences[_id];
        return (e.evidenceHash, e.description, e.timestamp, e.addedBy);
    }
}