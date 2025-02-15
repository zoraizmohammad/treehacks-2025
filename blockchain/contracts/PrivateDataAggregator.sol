// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title PrivateDataAggregator
 * @dev Manages encrypted data aggregation requests while preserving privacy
 */
contract PrivateDataAggregator is Ownable, Pausable {
    // Minimum number of records required for aggregation
    uint256 public constant MIN_RECORDS_FOR_AGGREGATION = 10;
    
    // Structure for aggregation requests
    struct AggregationRequest {
        uint256 requestId;
        address requester;
        string aggregationType;    // e.g., "sum", "average", "count"
        uint256 timestamp;
        bool isProcessed;
        bytes[] encryptedData;     // Array of encrypted data rows
    }
    
    // Mapping to store aggregation requests
    mapping(uint256 => AggregationRequest) public aggregationRequests;
    uint256 public requestCount;
    
    // Events
    event AggregationRequested(
        uint256 indexed requestId,
        address indexed requester,
        string aggregationType,
        uint256 dataCount
    );
    event AggregationApproved(
        uint256 indexed requestId,
        uint256 dataCount,
        string aggregationType
    );
    event AggregationProcessed(uint256 indexed requestId);
    
    constructor() Ownable() {}
    
    /**
     * @dev Request aggregation of encrypted data
     * @param aggregationType Type of aggregation requested (e.g., "sum", "average")
     * @param encryptedDataRows Array of encrypted data rows to aggregate
     * @return requestId The ID of the created aggregation request
     */
    function requestAggregation(
        string calldata aggregationType,
        bytes[] calldata encryptedDataRows
    ) external whenNotPaused returns (uint256) {
        require(encryptedDataRows.length >= MIN_RECORDS_FOR_AGGREGATION, "Insufficient records");
        
        // Verify each encrypted data row is not empty
        for (uint256 i = 0; i < encryptedDataRows.length; i++) {
            require(encryptedDataRows[i].length > 0, "Empty data row");
        }
        
        uint256 requestId = requestCount++;
        aggregationRequests[requestId] = AggregationRequest({
            requestId: requestId,
            requester: msg.sender,
            aggregationType: aggregationType,
            timestamp: block.timestamp,
            isProcessed: false,
            encryptedData: encryptedDataRows
        });
        
        emit AggregationRequested(requestId, msg.sender, aggregationType, encryptedDataRows.length);
        emit AggregationApproved(requestId, encryptedDataRows.length, aggregationType);
        
        return requestId;
    }
    
    /**
     * @dev Get the encrypted data rows for a specific aggregation request
     * @param requestId The ID of the aggregation request
     * @return Array of encrypted data rows
     */
    function getAggregationData(uint256 requestId) external view returns (bytes[] memory) {
        require(requestId < requestCount, "Invalid request ID");
        return aggregationRequests[requestId].encryptedData;
    }
    
    /**
     * @dev Get details of an aggregation request
     * @param requestId The ID of the aggregation request
     * @return requester The address that requested the aggregation
     * @return aggregationType The type of aggregation requested
     * @return timestamp When the request was made
     * @return isProcessed Whether the request has been processed
     * @return dataCount Number of data rows in the request
     */
    function getAggregationRequest(uint256 requestId) external view returns (
        address requester,
        string memory aggregationType,
        uint256 timestamp,
        bool isProcessed,
        uint256 dataCount
    ) {
        require(requestId < requestCount, "Invalid request ID");
        AggregationRequest storage request = aggregationRequests[requestId];
        return (
            request.requester,
            request.aggregationType,
            request.timestamp,
            request.isProcessed,
            request.encryptedData.length
        );
    }
    
    /**
     * @dev Mark an aggregation request as processed
     * @param requestId The ID of the aggregation request to mark as processed
     */
    function markRequestProcessed(uint256 requestId) external onlyOwner {
        require(requestId < requestCount, "Invalid request ID");
        require(!aggregationRequests[requestId].isProcessed, "Already processed");
        
        aggregationRequests[requestId].isProcessed = true;
        emit AggregationProcessed(requestId);
    }
    
    /**
     * @dev Pause the contract
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause the contract
     */
    function unpause() external onlyOwner {
        _unpause();
    }
} 