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
        address requester;
        string aggregationType;
        uint256 timestamp;
        bool isProcessed;
        uint256 dataCount;
        string dataSourceUrl;
        string companyId;
    }
    
    // Mapping to store aggregation requests
    mapping(uint256 => AggregationRequest) private aggregationRequests;
    uint256 private nextRequestId = 1;
    
    // Events
    event AggregationRequested(
        uint256 indexed requestId,
        address indexed requester,
        string aggregationType,
        uint256 dataCount,
        string dataSourceUrl,
        string companyId
    );
    event AggregationProcessed(uint256 indexed requestId);
    
    constructor() Ownable() {}
    
    /**
     * @dev Request aggregation of encrypted data
     * @param aggregationType Type of aggregation requested (e.g., "sum", "average")
     * @param dataSourceUrl URL to the data source
     * @param companyId ID of the company
     * @param dataCount Number of data rows to aggregate
     * @return requestId The ID of the created aggregation request
     */
    function requestAggregation(
        string memory aggregationType,
        string memory dataSourceUrl,
        string memory companyId,
        uint256 dataCount
    ) public returns (uint256) {
        require(bytes(dataSourceUrl).length > 0, "Data source URL is required");
        require(bytes(companyId).length > 0, "Company ID is required");
        require(dataCount >= 10, "Minimum 10 records required");

        uint256 requestId = nextRequestId++;
        
        aggregationRequests[requestId] = AggregationRequest({
            requester: msg.sender,
            aggregationType: aggregationType,
            timestamp: block.timestamp,
            isProcessed: false,
            dataCount: dataCount,
            dataSourceUrl: dataSourceUrl,
            companyId: companyId
        });

        emit AggregationRequested(
            requestId,
            msg.sender,
            aggregationType,
            dataCount,
            dataSourceUrl,
            companyId
        );

        return requestId;
    }
    
    /**
     * @dev Get details of an aggregation request
     * @param requestId The ID of the aggregation request
     * @return requester The address that requested the aggregation
     * @return aggregationType The type of aggregation requested
     * @return timestamp When the request was made
     * @return isProcessed Whether the request has been processed
     * @return dataCount Number of data rows in the request
     * @return dataSourceUrl URL to the data source
     * @return companyId ID of the company
     */
    function getAggregationRequest(uint256 requestId)
        public
        view
        returns (
            address requester,
            string memory aggregationType,
            uint256 timestamp,
            bool isProcessed,
            uint256 dataCount,
            string memory dataSourceUrl,
            string memory companyId
        )
    {
        AggregationRequest storage request = aggregationRequests[requestId];
        return (
            request.requester,
            request.aggregationType,
            request.timestamp,
            request.isProcessed,
            request.dataCount,
            request.dataSourceUrl,
            request.companyId
        );
    }
    
    /**
     * @dev Mark an aggregation request as processed
     * @param requestId The ID of the aggregation request to mark as processed
     */
    function markRequestProcessed(uint256 requestId) public {
        require(!aggregationRequests[requestId].isProcessed, "Request already processed");
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