pragma solidity ^0.8.4;

import '@openzeppelin/contracts/access/Ownable.sol';
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import 'base64-sol/base64.sol';
import './ISyncxColors.sol';

contract Minter is ERC721Holder, Ownable{
  address THE_SYNC;
  event tokenMinted(address sender, uint256 tokenId);
  event metaShow(string meta, uint256 tokenId);
  function setContractAddress(address addr) public onlyOwner {
    THE_SYNC = addr;
  }
  function findTraitIndex(bytes memory data) private pure returns (uint) {
    for (uint256 i = 0; i < data.length; i++) {
      if (data[i] == 'R' && data[i+1] == 'a' && data[i+2] == 'r' && data[i+3] == 'i' && data[i+4] == 't' && data[i+5] == 'y') {
        return i;
      }
    }
  }
  function subString(bytes memory data, uint index, uint indexEnd) private pure returns (string memory) {
    bytes memory tmp = new bytes(indexEnd - index);
    for (uint256 i = index; i < indexEnd; i++) {
      tmp[i - index] = data[i];
    }
    return string(tmp);
  }
  function mintRare(uint256 _mintAmount, uint16[] calldata colorTokenIds) payable public onlyOwner {
    uint256 tokenId = ISYNC(THE_SYNC).totalSupply();
    ISYNC(THE_SYNC).mint{value: _mintAmount * 0.05 ether}(_mintAmount, colorTokenIds);
    emit tokenMinted(msg.sender, tokenId);
    string memory meta = ISYNC(THE_SYNC).tokenURI(tokenId);
    //emit metaShow(meta, tokenId);
    string memory resString = subString(bytes(meta), 29, bytes(meta).length);
    bytes memory jsonBytes = Base64.decode(resString);
    //emit metaShow(string(jsonBytes), tokenId);
    uint traitIndex = findTraitIndex(jsonBytes);
    string memory trait = subString(jsonBytes, traitIndex+17, traitIndex+24);
    emit metaShow(trait, tokenId);
    require(keccak256(abi.encodePacked(trait)) == keccak256(abi.encodePacked("Olympus")), "Not a valid rarity");
  }
  function mint(uint256 _mintAmount, uint16[] calldata colorTokenIds) payable public onlyOwner {
    uint256 tokenId = ISYNC(THE_SYNC).totalSupply();
    ISYNC(THE_SYNC).mint{value: _mintAmount * 0.05 ether}(_mintAmount, colorTokenIds);
    emit tokenMinted(msg.sender, tokenId);
  }
}
