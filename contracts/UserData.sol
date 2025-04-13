// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title NeuroSync User Data
 * @dev Stores and manages access to decentralized user data 
 * References are stored as IPFS CIDs with user-controlled access
 */
contract UserData is Ownable {
    // User data storage
    struct DataEntry {
        string cid;             // IPFS Content ID
        bool isEncrypted;       // If data was encrypted client-side
        uint256 timestamp;      // When data was stored
        string dataType;        // Type of data (chat, mood, journal, etc)
    }
    
    // Access control
    struct AccessControl {
        bool hasAccess;
        uint256 expiration; // 0 means indefinite access
    }
    
    // Maps user address to an array of their data entries
    mapping(address => DataEntry[]) private userData;
    
    // Maps user address to data count for indexing
    mapping(address => uint256) public userDataCount;
    
    // Maps user address to authorized therapist addresses with access control
    mapping(address => mapping(address => AccessControl)) public therapistAccess;
    
    // Events
    event DataStored(address indexed user, uint256 index, string dataType);
    event DataRemoved(address indexed user, uint256 index);
    event AccessGranted(address indexed user, address indexed therapist, uint256 expiration);
    event AccessRevoked(address indexed user, address indexed therapist);
    
    constructor(address initialOwner) Ownable(initialOwner) {}
    
    /**
     * @dev Store a reference to user data on IPFS
     * @param user Address of the user who owns the data
     * @param cid IPFS Content ID where data is stored
     * @param isEncrypted Whether the data is encrypted
     * @param dataType Type of data being stored
     */
    function storeData(
        address user,
        string memory cid,
        bool isEncrypted,
        string memory dataType
    ) external {
        // Only the platform or the user can store data for the user
        require(msg.sender == owner() || msg.sender == user, "Not authorized to store data");
        
        DataEntry memory newEntry = DataEntry({
            cid: cid,
            isEncrypted: isEncrypted,
            timestamp: block.timestamp,
            dataType: dataType
        });
        
        userData[user].push(newEntry);
        userDataCount[user]++;
        
        emit DataStored(user, userDataCount[user] - 1, dataType);
    }
    
    /**
     * @dev Retrieve data by index
     * @param user Address of the user who owns the data
     * @param index Index of the data to retrieve
     * @return DataEntry containing the IPFS CID and metadata
     */
    function getData(address user, uint256 index) external view returns (DataEntry memory) {
        require(
            msg.sender == owner() || 
            msg.sender == user || 
            hasTherapistAccess(user, msg.sender), 
            "Not authorized to access data"
        );
        require(index < userDataCount[user], "Data index out of bounds");
        
        return userData[user][index];
    }
    
    /**
     * @dev Get all data entries for a user
     * @param user Address of the user
     * @return Array of DataEntry structs
     */
    function getAllData(address user) external view returns (DataEntry[] memory) {
        require(
            msg.sender == owner() || 
            msg.sender == user || 
            hasTherapistAccess(user, msg.sender), 
            "Not authorized to access data"
        );
        
        return userData[user];
    }
    
    /**
     * @dev Delete data by index
     * @param index Index of the data to delete
     */
    function removeData(uint256 index) external {
        require(index < userDataCount[msg.sender], "Data index out of bounds");
        
        // We don't actually delete, just clear the CID to revoke access
        // This maintains the array structure and keeps timestamps for audit
        userData[msg.sender][index].cid = "";
        
        emit DataRemoved(msg.sender, index);
    }
    
    /**
     * @dev Grant access to a therapist
     * @param therapist Address of the therapist
     * @param expiration Timestamp when access expires (0 for indefinite)
     */
    function grantAccess(address therapist, uint256 expiration) external {
        require(therapist != address(0), "Invalid therapist address");
        
        // If expiration is set, it must be in the future
        if (expiration > 0) {
            require(expiration > block.timestamp, "Expiration must be in the future");
        }
        
        therapistAccess[msg.sender][therapist] = AccessControl({
            hasAccess: true,
            expiration: expiration
        });
        
        emit AccessGranted(msg.sender, therapist, expiration);
    }
    
    /**
     * @dev Revoke access from a therapist
     * @param therapist Address of the therapist
     */
    function revokeAccess(address therapist) external {
        require(therapistAccess[msg.sender][therapist].hasAccess, "Therapist does not have access");
        
        therapistAccess[msg.sender][therapist].hasAccess = false;
        
        emit AccessRevoked(msg.sender, therapist);
    }
    
    /**
     * @dev Check if a therapist has access to a user's data
     * @param user User address
     * @param therapist Therapist address
     * @return Boolean indicating if therapist has access
     */
    function hasTherapistAccess(address user, address therapist) public view returns (bool) {
        AccessControl memory access = therapistAccess[user][therapist];
        
        if (!access.hasAccess) {
            return false;
        }
        
        // Check if access has expired
        if (access.expiration > 0 && block.timestamp > access.expiration) {
            return false;
        }
        
        return true;
    }
    
    /**
     * @dev Get data count by type
     * @param user User address
     * @param dataType Type of data to count
     * @return Count of entries matching the data type
     */
    function getDataCountByType(address user, string memory dataType) external view returns (uint256) {
        require(
            msg.sender == owner() || 
            msg.sender == user || 
            hasTherapistAccess(user, msg.sender), 
            "Not authorized to access data"
        );
        
        uint256 count = 0;
        for (uint256 i = 0; i < userDataCount[user]; i++) {
            if (keccak256(bytes(userData[user][i].dataType)) == keccak256(bytes(dataType)) &&
                bytes(userData[user][i].cid).length > 0) {
                count++;
            }
        }
        
        return count;
    }
} 