pragma solidity ^0.5.0;

contract EvidenceManagement {
    // Struct to store evidence data
    struct Evidence {
        string evidenceHash;
        string description;
        uint256 timestamp;
        address addedBy;
    }

    struct User {
        string email;
        string department;
        string username;
        string passwordHash;
        string phoneNumber;
        string address;
        address userAddress;
    }

    // Mapping for users and evidences
    mapping(address => User) public users;
    mapping(uint256 => Evidence) public evidences;
    uint256 public evidenceCount;

    // Event for user registration and evidence addition
    event UserRegistered(address userAddress, string email, string department, string username, string phoneNumber, string userAddress);
    event EvidenceAdded(uint256 evidenceId, string evidenceHash, string description, address addedBy);

    // Function to register a new user with more details
    function registerUser(
        string memory _email,
        string memory _department,
        string memory _username,
        string memory _passwordHash, // Hashed password
        string memory _phoneNumber,
        string memory _address
    ) public {
        require(bytes(users[msg.sender].email).length == 0, "User already registered");
        
        users[msg.sender] = User({
            email: _email,
            department: _department,
            username: _username,
            passwordHash: _passwordHash, // Store hashed password
            phoneNumber: _phoneNumber,
            address: _address,
            userAddress: msg.sender
        });

        emit UserRegistered(msg.sender, _email, _department, _username, _phoneNumber, _address);
    }

    // Function to check if the user is registered
    function isUserRegistered() public view returns (bool) {
        return bytes(users[msg.sender].email).length > 0;
    }

    // Function to add evidence (only if the user is registered)
    function addEvidence(string memory _evidenceHash, string memory _description) public {
        require(bytes(users[msg.sender].email).length > 0, "User not registered");
        evidenceCount++;
        evidences[evidenceCount] = Evidence(_evidenceHash, _description, block.timestamp, msg.sender);
        emit EvidenceAdded(evidenceCount, _evidenceHash, _description, msg.sender);
    }

    // Function to get evidence by ID
    function getEvidence(uint256 _id) public view returns (string memory, string memory, uint256, address) {
        Evidence memory e = evidences[_id];
        return (e.evidenceHash, e.description, e.timestamp, e.addedBy);
    }
}
