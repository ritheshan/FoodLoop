// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./FoodLoopNFT.sol";

contract FoodLoop {
    mapping(uint256 => bool) public deliveryRecords;
    address public nftContractAddress;

    constructor(address _nftContractAddress) {
        nftContractAddress = _nftContractAddress;
    }

    function confirmDeliveryAndMintNFT(
        uint256 deliveryId,
        address donor,
        string memory foodType,
        string memory weight,
        string memory location,
        string memory timestamp
    ) public {
        deliveryRecords[deliveryId] = true;

        FoodLoopNFT nftContract = FoodLoopNFT(nftContractAddress);
        nftContract.mintCertificate(donor, foodType, weight, location, timestamp);
    }
}
