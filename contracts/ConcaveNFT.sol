// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';

contract ConcaveNFT is ERC721 {
  uint256 public immutable maxTokenId;

  constructor(uint256 _maxTokenId) ERC721('Concave NFT', 'CNFT') {
    maxTokenId = _maxTokenId;
  }

  /**
     @notice Method for Minting new piece
     @dev Only admin
     @param _tokenId uint256 the token id
     */
  function mint(uint256 _tokenId) external returns (bool) {
    require(_tokenId <= maxTokenId, 'Token id is higher than max token id');
    _safeMint(msg.sender, _tokenId);
    return true;
  }
}
