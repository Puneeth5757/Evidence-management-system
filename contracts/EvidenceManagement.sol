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
        address addedBy
    );

    function addEvidence(
        string memory _evidenceId,
        string memory _caseName,
        string memory _victimName,
        string memory _location,
        string memory _description,
        string memory _evidenceHash
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
            e.timestamp,
            e.addedBy
        );
    }

    function getAllEvidence() public view returns (string[] memory) {
        return evidenceIds;
    }
}
