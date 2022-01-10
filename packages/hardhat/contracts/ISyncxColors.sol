
pragma solidity ^0.8.0;


interface ISYNC {
  function totalSupply()
  external view returns (uint256);
  function mint(uint256 _mintAmount, uint16[] calldata colorsTokenIds)
    external
    payable;
  function tokenURI(uint256 tokenId)
    external
    view
    returns (string memory);
}
