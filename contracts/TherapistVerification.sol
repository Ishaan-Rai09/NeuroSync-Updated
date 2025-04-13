// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Therapist Verification Token
 * @dev ERC721 token for verifying therapist credentials
 * A therapist must hold this token to provide services on the platform
 * 
 * NOTE: In a production environment, this would be implemented as a proper
 * Soul Bound Token (SBT) that cannot be transferred. For simplicity and
 * compatibility with OpenZeppelin, we're using a standard ERC721 here.
 */
contract TherapistVerification is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;
    
    // Therapist credential information
    struct Credential {
        string licenseNumber;
        string licenseType;
        string jurisdiction;
        uint256 expiration;
        bool isVerified;
    }
    
    // Mapping from tokenId to credential
    mapping(uint256 => Credential) public credentials;
    
    // Mapping of wallet address to tokenId
    mapping(address => uint256) public addressToTokenId;
    
    // Events
    event TherapistVerified(address indexed therapist, uint256 tokenId, string licenseNumber);
    event CredentialRevoked(uint256 tokenId, string reason);
    
    constructor(address initialOwner) 
        ERC721("NeuroSync Therapist Verification", "NEUROTH") 
        Ownable(initialOwner) 
    {}
    
    /**
     * @dev Mint a new therapist verification token
     * @param to The therapist's wallet address
     * @param licenseNumber Professional license number
     * @param licenseType Type of license (e.g., "Psychologist", "LCSW")
     * @param jurisdiction Jurisdiction where license is valid
     * @param expiration Timestamp when license expires
     * @param uri Metadata URI containing additional verification information
     */
    function verifyTherapist(
        address to,
        string memory licenseNumber,
        string memory licenseType,
        string memory jurisdiction,
        uint256 expiration,
        string memory uri
    ) external onlyOwner {
        require(addressToTokenId[to] == 0, "Address already has a verification token");
        require(expiration > block.timestamp, "License is expired");
        
        uint256 tokenId = _nextTokenId++;
        _mint(to, tokenId);
        _setTokenURI(tokenId, uri);
        
        credentials[tokenId] = Credential({
            licenseNumber: licenseNumber,
            licenseType: licenseType,
            jurisdiction: jurisdiction,
            expiration: expiration,
            isVerified: true
        });
        
        addressToTokenId[to] = tokenId;
        
        emit TherapistVerified(to, tokenId, licenseNumber);
    }
    
    /**
     * @dev Revoke verification for a therapist
     * @param tokenId The token to revoke
     * @param reason Reason for revocation
     */
    function revokeVerification(uint256 tokenId, string memory reason) external onlyOwner {
        require(_exists(tokenId), "Token does not exist");
        require(credentials[tokenId].isVerified, "Credential already revoked");
        
        credentials[tokenId].isVerified = false;
        
        // Remove address mapping, but keep token to maintain revocation record
        address owner = ownerOf(tokenId);
        addressToTokenId[owner] = 0;
        
        emit CredentialRevoked(tokenId, reason);
    }
    
    /**
     * @dev Update expiration date for a license
     * @param tokenId The token to update
     * @param newExpiration New expiration timestamp
     */
    function updateExpiration(uint256 tokenId, uint256 newExpiration) external onlyOwner {
        require(_exists(tokenId), "Token does not exist");
        require(newExpiration > block.timestamp, "New expiration must be in the future");
        
        credentials[tokenId].expiration = newExpiration;
    }
    
    /**
     * @dev Check if an address is a verified therapist with valid credentials
     * @param therapist Address to check
     * @return True if address has valid credentials
     */
    function isVerifiedTherapist(address therapist) external view returns (bool) {
        uint256 tokenId = addressToTokenId[therapist];
        if (tokenId == 0) return false;
        
        Credential memory cred = credentials[tokenId];
        return cred.isVerified && cred.expiration > block.timestamp;
    }
    
    /**
     * @dev Get credential information for a therapist
     * @param therapist Address to check
     * @return Credential struct containing license information
     */
    function getTherapistCredential(address therapist) external view returns (Credential memory) {
        uint256 tokenId = addressToTokenId[therapist];
        require(tokenId != 0, "No credential found for this address");
        
        return credentials[tokenId];
    }
    
    /**
     * @dev Helper function to check if token exists
     */
    function _exists(uint256 tokenId) internal view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }
}