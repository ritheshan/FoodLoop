// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract FoodLoopNFT is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;
    mapping(uint256 => string) public certificateData;

    constructor() ERC721("FoodLoopCertificate", "FLNFT") {}

    function mintCertificate(
        address donor,
        string memory foodType,
        string memory weight,
        string memory location,
        string memory timestamp
    ) public {
        uint256 tokenId = _tokenIdCounter.current();
        _safeMint(donor, tokenId);
        certificateData[tokenId] = string(abi.encodePacked(
            "Food Type: ", foodType, " | ",
            "Weight: ", weight, " | ",
            "Location: ", location, " | ",
            "Timestamp: ", timestamp
        ));
        _tokenIdCounter.increment();
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override {
        require(from == address(0), "NFTs are non-transferable");
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }
}
