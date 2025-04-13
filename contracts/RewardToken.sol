// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title NeuroSync Token
 * @dev ERC20 Token for NeuroSync mental wellness platform
 * Users earn tokens through engagement and can redeem for premium features
 */
contract NeuroSyncToken is ERC20, ERC20Burnable, Ownable {
    // Cooldown periods to prevent gaming the system
    mapping(address => uint256) public lastRewardTimestamp;
    mapping(string => uint256) public rewardCooldowns;
    mapping(string => uint256) public rewardAmounts;
    
    // Events
    event RewardEarned(address indexed user, string action, uint256 amount);
    event RewardRedeemed(address indexed user, string service, uint256 amount);
    
    constructor(address initialOwner) 
        ERC20("NeuroSync Token", "NEURO") 
        Ownable(initialOwner) 
    {
        // Initialize reward amounts (in token units)
        rewardAmounts["daily_checkin"] = 5 * 10**decimals();
        rewardAmounts["session_complete"] = 10 * 10**decimals();
        rewardAmounts["weekly_goal"] = 25 * 10**decimals();
        rewardAmounts["monthly_streak"] = 100 * 10**decimals();
        
        // Initialize cooldown periods (in seconds)
        rewardCooldowns["daily_checkin"] = 1 days;
        rewardCooldowns["session_complete"] = 4 hours;
        rewardCooldowns["weekly_goal"] = 7 days;
        rewardCooldowns["monthly_streak"] = 30 days;
        
        // Mint initial supply to contract owner
        _mint(initialOwner, 1000000 * 10**decimals());
    }
    
    /**
     * @dev Allows the platform to reward users for engaging with mental wellness activities
     * @param user The user's address to receive the reward
     * @param action The activity completed (must match a key in rewardAmounts)
     */
    function rewardUser(address user, string memory action) external onlyOwner {
        require(rewardAmounts[action] > 0, "Invalid action type");
        require(
            block.timestamp >= lastRewardTimestamp[user] + rewardCooldowns[action],
            "Cooldown period not elapsed"
        );
        
        uint256 amount = rewardAmounts[action];
        lastRewardTimestamp[user] = block.timestamp;
        
        _mint(user, amount);
        emit RewardEarned(user, action, amount);
    }
    
    /**
     * @dev Updates the reward amount for a specific action
     * @param action The activity type
     * @param amount New reward amount
     */
    function setRewardAmount(string memory action, uint256 amount) external onlyOwner {
        rewardAmounts[action] = amount;
    }
    
    /**
     * @dev Updates the cooldown period for a specific action
     * @param action The activity type
     * @param cooldownPeriod New cooldown period in seconds
     */
    function setCooldownPeriod(string memory action, uint256 cooldownPeriod) external onlyOwner {
        rewardCooldowns[action] = cooldownPeriod;
    }
    
    /**
     * @dev Allow platform to burn tokens when users redeem for services
     * @param user User redeeming tokens
     * @param service Service being purchased
     * @param amount Amount of tokens being spent
     */
    function redeemTokens(address user, string memory service, uint256 amount) external onlyOwner {
        require(balanceOf(user) >= amount, "Insufficient token balance");
        _burn(user, amount);
        emit RewardRedeemed(user, service, amount);
    }
} 