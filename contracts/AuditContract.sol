// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "cartesi-coprocessor-base-contract/BaseContract.sol";

/**
 * @title AuditContract
 * @dev Manages smart contract audits via the Cartesi Coprocessor.
 */
contract AuditContract is CoprocessorAdapter {
    // Events
    event AuditRequested(address indexed requester, uint256 indexed requestId, string contractSource);
    event AuditCompleted(address indexed requester, uint256 indexed requestId, bytes result);

    uint256 public requestCounter;

    constructor(address _taskIssuerAddress, bytes32 _machineHash)
        CoprocessorAdapter(_taskIssuerAddress, _machineHash)
    {}

    /**
     * @notice Requests a decentralized audit for the given source code.
     * @param contractSource The source code of the smart contract to analyze.
     */
    function requestAudit(string calldata contractSource) external {
        requestCounter++;
        emit AuditRequested(msg.sender, requestCounter, contractSource);

        // Encode the input for the Cartesi Machine (JSON string)
        bytes memory input = abi.encodePacked(
            '{"contractSource": "', contractSource, '", "requestId": ', uint2str(requestCounter), '}'
        );
        
        // Call the Coprocessor
        callCoprocessor(input);
    }

    /**
     * @dev Internal handler for notices sent back by the Cartesi Machine.
     */
    function handleNotice(bytes calldata _notice) internal override {
        // In a real implementation, you would decode the requestId from the notice
        emit AuditCompleted(msg.sender, 0, _notice);
    }

    // Helper to convert uint to string for JSON encoding
    function uint2str(uint _i) internal pure returns (string memory _uintAsString) {
        if (_i == 0) return "0";
        uint j = _i;
        uint len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint k = len;
        while (_i != 0) {
            k = k-1;
            uint8 temp = (48 + uint8(_i - _i / 10 * 10));
            bstr[k] = bytes1(temp);
            _i /= 10;
        }
        return string(bstr);
    }
}
