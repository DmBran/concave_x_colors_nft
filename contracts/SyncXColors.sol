// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
pragma abicoder v2;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/Strings.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol';
import 'base64-sol/base64.sol';
import './legacy_colors/TheColors.sol';
import './legacy_colors/INFTOwner.sol';

/**
 * @title Sync x Colors contract
 * @dev Extends ERC721 Non-Fungible Token Standard basic implementation
 */
contract Sync is ERC721Enumerable, Ownable {
  using Strings for uint256;
  using Strings for uint32;
  using Strings for uint8;

  struct SyncTraits {
    uint8 direction;
    uint8 strokeWidth;
    uint8 stepDuration;
  }

  uint256 public mintPrice = 0.033 ether;
  uint256 public maxMintAmount = 5;
  uint256 public constant MAX_SYNCS = 2122;

  string public PROVENANCE_HASH = '';

  address public constant THE_COLORS =
    address(0x5FbDB2315678afecb367f032d93F642f64180aa3);

  mapping(uint256 => uint256) private _tokenIdColors;

  constructor() ERC721('Sync x Colors', 'SYNC Valpha') {}

  function tokenURI(uint256 tokenId)
    public
    view
    virtual
    override(ERC721)
    returns (string memory)
  {
    require(_exists(tokenId), 'ERC721: operator query for nonexistent token');

    uint256[] memory colorTokenIds = getColorIds(tokenId);
    string memory svgData = generateSVGImage(tokenId, colorTokenIds);
    string memory image = Base64.encode(bytes(svgData));

    return
      string(
        abi.encodePacked(
          'data:application/json;base64,',
          Base64.encode(
            bytes(
              abi.encodePacked(
                '{',
                '"image":"',
                'data:image/svg+xml;base64,',
                image,
                '",',
                generateNameDescription(tokenId),
                generateAttributes(tokenId, colorTokenIds),
                '}'
              )
            )
          )
        )
      );
  }

  function getTokenMetadata(uint256 tokenId)
    public
    view
    returns (string memory)
  {
    require(_exists(tokenId), 'ERC721: operator query for nonexistent token');
    uint256[] memory colorTokenIds = getColorIds(tokenId);
    string memory image = Base64.encode(
      bytes(generateSVGImage(tokenId, colorTokenIds))
    );

    return
      string(
        abi.encodePacked(
          'data:application/json',
          '{',
          '"image":"',
          'data:image/svg+xml;base64,',
          image,
          '",',
          generateNameDescription(tokenId),
          ',',
          generateAttributes(tokenId, colorTokenIds),
          '}'
        )
      );
  }

  function getColorDescriptor(uint256[] memory tokenIdColors)
    private
    view
    returns (string memory)
  {
    string memory colorDescriptor;
    for (uint256 i = 0; i < 3; i++) {
      if (tokenIdColors[i] == 0xFFFF) {
        break;
      }
      colorDescriptor = string(
        abi.encodePacked(
          colorDescriptor,
          TheColors(THE_COLORS).getHexColor(tokenIdColors[i]),
          ','
        )
      );
    }
    return colorDescriptor;
  }

  function getTokenSVG(uint256 tokenId) public view returns (string memory) {
    require(_exists(tokenId), 'ERC721: operator query for nonexistent token');
    uint256[] memory tokenIdColors = getColorIds(tokenId);
    return generateSVGImage(tokenId, tokenIdColors);
  }

  function getBase64TokenSVG(uint256 tokenId)
    public
    view
    returns (string memory)
  {
    require(_exists(tokenId), 'ERC721: operator query for nonexistent token');
    uint256[] memory tokenIdColors = getColorIds(tokenId);
    string memory image = Base64.encode(
      bytes(generateSVGImage(tokenId, tokenIdColors))
    );
    return string(abi.encodePacked('data:application/json;base64', image));
  }

  function getColorsOwnedByUser(address user)
    public
    view
    returns (uint256[] memory tokenIds)
  {
    uint256[] memory tokenIds = new uint256[](4317);

    uint256 index = 0;
    for (uint256 i = 0; i < 4317; i++) {
      address tokenOwner = INFTOwner(THE_COLORS).ownerOf(i);

      if (user == tokenOwner) {
        tokenIds[index] = i;
        index += 1;
      }
    }

    uint256 left = 4317 - index;
    for (uint256 i = 0; i < left; i++) {
      tokenIds[index] = 9999;
      index += 1;
    }

    return tokenIds;
  }

  function getColorIds(uint256 tokenId)
    private
    view
    returns (uint256[] memory)
  {
    uint256 rawtokenIdColors = _tokenIdColors[tokenId];
    uint256[] memory tokenIdColors = new uint256[](3);

    for (uint256 i = 0; i < 3; i++) {
      tokenIdColors[i] = rawtokenIdColors % 2**16;
      rawtokenIdColors /= 2**16;
    }

    return tokenIdColors;
  }

  function withdraw() public onlyOwner {
    uint256 balance = address(this).balance;
    payable(msg.sender).transfer(balance);
  }

  /*
   * Set provenance once it's calculated
   */
  function setProvenanceHash(string memory provenanceHash) public onlyOwner {
    PROVENANCE_HASH = provenanceHash;
  }

  /**
   * Mint SYNCxCOLOR NFT
   */
  function mintSync(uint256[] calldata tokenIdColors, uint256 mintAmount) public payable {
    uint256[] memory mintIndexes = new uint256[](mintAmount);
    uint256 mintIndex = totalSupply();

    if (msg.sender != owner()) {
        require(msg.value >= mintPrice * mintAmount);
    }

    require(mintAmount > 0);
    require(mintAmount <= maxMintAmount);
    require(mintIndex + mintAmount <= MAX_SYNCS);

    require(
      tokenIdColors.length < 4,
      "Supplied 'THE COLORS' tokenIds must be between 0 and 3."
    );

    for (uint256 i = 0; i < tokenIdColors.length; i++) {
      require(
        msg.sender == INFTOwner(THE_COLORS).ownerOf(tokenIdColors[i]),
        "Supplied 'THE COLORS' tokenId is not owned by msg.sender."
      );
    }

    for (uint256 i = 0; i < mintIndexes.length; i++) {
        _safeMint(msg.sender, mintIndex + i);
        updateColorMapping(mintIndex + i, tokenIdColors);
    }
  }

  /**
   * Store mapping between tokenId and applied tokenIdColors
   */
  function updateColorMapping(uint256 tokenId, uint256[] memory tokenIdColors)
    internal
    virtual
  {
    uint256 colorIdEncoding = 0xFFFFFFFFFFFF;
    for (uint256 i = 0; i < tokenIdColors.length; i++) {
      colorIdEncoding = colorIdEncoding * 2**16;
      colorIdEncoding += tokenIdColors[i];
    }

    _tokenIdColors[tokenId] = colorIdEncoding;
  }

  function updateColors(uint256 tokenId, uint256[] memory tokenIdColors)
    public
  {
    require(
      msg.sender == ownerOf(tokenId),
      'Only the NFT holder can update its colors'
    );
    require(
      tokenIdColors.length < 4,
      "Supplied 'THE COLORS' tokenIds must be between 0 and 3."
    );

    for (uint256 i = 0; i < tokenIdColors.length; i++) {
      require(
        msg.sender == INFTOwner(THE_COLORS).ownerOf(tokenIdColors[i]),
        "Supplied 'THE COLORS' tokenId is not owned by msg.sender."
      );
    }
    updateColorMapping(tokenId, tokenIdColors);
  }

  function generateNameDescription(uint256 tokenId)
    internal
    pure
    returns (string memory)
  {
    return
      string(
        abi.encodePacked(
          '"external_url":"https://syncxcolors.xyz",',
          unicode'"description":"The SYNCxColors are generated and stored entirely on-chain, and may be linked with up to 3 THE COLORS primitives for epic effect.',
          '\\nToken id: #',
          tokenId.toString(),
          '"'
        )
      );
  }

  function generateAttributes(uint256 tokenId, uint256[] memory colorTokenIds)
    internal
    view
    returns (string memory)
  {
    SyncTraits memory traits = generateTraits(tokenId);
    string memory colorDescriptor = getColorDescriptor(colorTokenIds);
    bytes memory buffer = abi.encodePacked(
      '"attributes":[',
      '{"trait_type":"Background color","value":"',
      colorDescriptor,
      '"},',
      '{"trait_type":"Colors","value":"',
      colorDescriptor,
      '"},',
      '{"trait_type":"Strokewidth","value":"',
      traits.strokeWidth,
      '"}]'
    );
    return string(abi.encodePacked(buffer));
  }

  function getHexStrings(uint256[] memory tokenIdColors)
    internal
    view
    returns (string[] memory)
  {
    string[] memory hexColors = new string[](3);
    hexColors[0] = '#222222';
    hexColors[1] = '#888888';
    hexColors[2] = '#AAAAAA';
    for (uint256 i = 0; i < 3; i++) {
      if (tokenIdColors[i] == 0xFFFF) {
        break;
      }
      hexColors[i] = TheColors(THE_COLORS).getHexColor(tokenIdColors[i]);
    }
    return hexColors;
  }

  function generateSVGImage(uint256 tokenId, uint256[] memory tokenIdColors)
    internal
    view
    returns (string memory)
  {
    string[] memory hexColors = getHexStrings(tokenIdColors);

    SyncTraits memory traits = generateTraits(tokenId);
    //string memory pathD = generatePathD(traits.direction, traits.spiralSize);

    bytes memory svgPartA = generateSVGPartA(hexColors, traits.strokeWidth);
    bytes memory svgPartB = generateSVGPartB(hexColors, traits.strokeWidth);
    bytes memory svgPartC = generateSVGPartC(hexColors);
    bytes memory svgPartD = generateSVGPartD(hexColors);
    return string(abi.encodePacked(svgPartA, svgPartB, svgPartC, svgPartD));
  }

  function generateSVGPartA(string[] memory hexColors, uint8 strokeWidth)
    internal
    pure
    returns (bytes memory)
  {
    bytes memory bufferPath = abi.encodePacked(
      '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="500" height="500"><defs><linearGradient id="Gradient"> <stop id="stop1" offset="0" stop-color="white" stop-opacity="0" />',
      '<stop id="stop2" offset="0.3" stop-color="white" stop-opacity="1"/></linearGradient><mask id="Mask"><rect x="0" y="0" width="500" height="500" fill="url(#Gradient)"/></mask> </defs>',
      '<rect x="0" y="0" width="500" height="500" fill="',
      hexColors[0],
      '"/><rect x="0" y="0" width="500" height="500" fill="',
      hexColors[1],
      '" mask="url(#Mask)" />',
      '<path id="infinity" stroke-dasharray="0" stroke-dashoffset="0" stroke-width="70" ',
      'd="M 75,250 C 75,350 200,350 250,250 S 425,150 425,250 S 300,350 250,250 S 75,150 75,250" ',
      'transform="translate(173 173) scale(0.3)" fill="none">',
      '<animate begin="s.end" attributeType="XML" attributeName="stroke"  values="'
    );

    bytes memory bufferAnimate1 = abi.encodePacked(
      hexColors[0],
      ';',
      hexColors[1],
      ';',
      hexColors[0],
      '" dur="4s" fill="freeze" />'
      '<animate id = "array_1" begin="s.end" attributeType="XML" attributeName="stroke-dasharray" to="100" dur="0.5s" fill="freeze"/>',
      '<animate begin="array_1.end" attributeType="XML" attributeName="stroke-dasharray" to="0" dur="0.5s" fill="freeze"/>',
      '<animate id = "array_3" begin="b.end" attributeType="XML" attributeName="stroke-dasharray" to="100" dur="0.5s" fill="freeze"/>'
    );

    bytes memory bufferAnimate2 = abi.encodePacked(
      '<animate begin="array_3.end" attributeType="XML" attributeName="stroke-dasharray" to="0" dur="0.5s" fill="freeze"/>'
      '<animate begin="s.begin" attributeType="XML" attributeName="stroke-width" values="32;70;32" dur="1s" fill="freeze"/>',
      '<animate begin="a.begin" attributeType="XML" attributeName="stroke-width" values="32;70;32" dur="1s" fill="freeze"/>',
      '<animate begin="b.begin" attributeType="XML" attributeName="stroke-width" values="32;70;32" dur="1s" fill="freeze"/>',
      '<animate begin="c.begin" attributeType="XML" attributeName="stroke-width" values="32;70;32" dur="1s" fill="freeze"/>',
      '</path>'
    );

    return abi.encodePacked(bufferPath, bufferAnimate1, bufferAnimate2);
  }

  function generateSVGPartB(string[] memory hexColors, uint8 strokeWidth)
    internal
    pure
    returns (bytes memory)
  {
    bytes memory bufferPath = abi.encodePacked(
      '<path id="infinity_2" stroke-dasharray="1000" stroke-dashoffset="1000" stroke-width="70" ',
      'd="M 75,250 C 75,350 200,350 250,250 S 425,150 425,250 S 300,350 250,250 S 75,150 75,250" ',
      'transform="translate(173 173) scale(0.3)" fill="none">',
      '<animate begin="s.end" attributeType="XML" attributeName="stroke"  values="',
      hexColors[2],
      ';',
      hexColors[0],
      ';',
      hexColors[2],
      '" dur="4s" fill="freeze" />'
    );

    bytes memory bufferAnimate1 = abi.encodePacked(
      '<animate begin="s.begin" attributeType="XML" attributeName="stroke-width" values="32;70;32" dur="1s" fill="freeze"/>',
      '<animate begin="a.begin" attributeType="XML" attributeName="stroke-width" values="32;70;32" dur="1s" fill="freeze"/>',
      '<animate begin="b.begin" attributeType="XML" attributeName="stroke-width" values="32;70;32" dur="1s" fill="freeze"/>',
      '<animate begin="c.begin" attributeType="XML" attributeName="stroke-width" values="32;70;32" dur="1s" fill="freeze"/>',
      '<animate id="s" attributeType="XML" attributeName="stroke-dashoffset" begin="0.5s;end.end" to= "0" dur="1s" fill="freeze"/>'
    );

    bytes memory bufferAnimate2 = abi.encodePacked(
      '<animate id="a" attributeType="XML" attributeName="stroke-dashoffset" begin="s.end" to="-1000" dur="1s" fill="freeze"/>',
      '<animate id="b" attributeType="XML" attributeName="stroke-dashoffset" begin="a.end" to="-2000" dur="1s" fill="freeze"/>',
      '<animate id="c" attributeType="XML" attributeName="stroke-dashoffset" begin="b.end" to="-3000" dur="1s" fill="freeze"/>',
      '<animate id="end" attributeType="XML" attributeName="stroke-dashoffset" begin="c.end" to="1000" dur="0.0001s" fill="freeze"/>',
      '</path>'
    );

    return abi.encodePacked(bufferPath, bufferAnimate1, bufferAnimate2);
  }

  function generateSVGPartC(string[] memory hexColors)
    internal
    pure
    returns (bytes memory)
  {
    bytes memory bufferPath = abi.encodePacked(
      '<g id="borders">',
      '<path d="M144.4,89.31H113.1c-16.88,32.57,0,71.38,0,71.38h31.3C113.45,125.69,144.4,89.31,144.4,89.31Zm-13.17,63.76H119.58s ',
      '-12.47-17.38,0-55.68h11.65S110.43,122.57,131.23,153.07Z" transform="translate(-95,0) scale(2)" stroke="black" fill-opacity="0.9">',
      '</path><path d="M 107.3179 117.5457 c -13.3985 25.8524 0 56.658 0 56.658 h 6.873 c -0.1535 -0.4067 -9.7724 -26.1184 0.0305 -56.2648 z" ',
      'transform="translate(-85,15) scale(1.6,1.6)" stroke-opacity="0.7" fill-opacity="0.7" fill="transparent">'
    );

    bytes memory bufferAnimate1 = abi.encodePacked(
      '<animate attributeName="fill" values="transparent;white;transparent" begin="c.begin;a.begin" dur="1s"/>',
      '<animate attributeName="stroke" values="transparent;white;transparent" begin="c.begin;a.begin" dur="1s"/>',
      '<animate attributeName="fill" values="transparent;black;transparent" begin="c.begin;a.begin" dur="1s"/>',
      '<animate attributeName="stroke" values="transparent;black;transparent" begin="c.begin;a.begin" dur="1s"/>',
      '</path>'
    );

    bytes memory bufferAnimate2 = abi.encodePacked(
      '<path ',
      'd="M 107.3179 117.5457 c -13.3985 25.8524 0 56.658 0 56.658 h 6.873 c -0.1535 -0.4067 -9.7724 -26.1184 0.0305 -56.2648 z" ',
      'transform="translate(-88,60) scale(1.3,1.3)" stroke-opacity="0.35" fill-opacity="0.35" fill="transparent">',
      '<animate attributeName="fill" values="transparent;white;transparent" begin="c.begin+.2s;a.begin+.2s" dur="1s"/>',
      '<animate attributeName="stroke" values="transparent;white;transparent" begin="c.begin+.2s;a.begin+.2s" dur="1s"/>'
      '<animate attributeName="fill" values="transparent;black;transparent" begin="c.begin+.2s;a.begin+.2s" dur="1s"/>',
      '<animate attributeName="stroke" values="transparent;black;transparent" begin="c.begin+.2s;a.begin+.2s" dur="1s"/>',
      '</path>'
    );
    return abi.encodePacked(bufferPath, bufferAnimate1, bufferAnimate2);
  }

  function generateSVGPartD(string[] memory hexColors)
    internal
    pure
    returns (bytes memory)
  {
    bytes memory bufferAnimate1 = abi.encodePacked(
      '<path ',
      'd="M 107.3179 117.5457 c -13.3985 25.8524 0 56.658 0 56.658 h 6.873 c -0.1535 -0.4067 -9.7724 -26.1184 0.0305 -56.2648 z" ',
      'transform="translate(-82,104) scale(1,1)" stroke-opacity="0.05" fill-opacity="0.05" fill="transparent">',
      '<animate attributeName="fill" values="transparent;white;transparent" begin="c.begin+.4s;a.begin+.4s" dur="1s"/>',
      '<animate attributeName="stroke" values="transparent;white;transparent" begin="c.begin+.4s;a.begin+.4s" dur="1s"/>'
    );

    bytes memory bufferAnimate2 = abi.encodePacked(
      '<animate attributeName="fill" values="transparent;black;transparent" begin="c.begin+.4s;a.begin+.4s" dur="1s"/>',
      '<animate attributeName="stroke" values="transparent;black;transparent" begin="c.begin+.4s;a.begin+.4s" dur="1s"/>',
      '</path><path ',
      'd="M 107.3179 117.5457 c -13.3985 25.8524 0 56.658 0 56.658 h 6.873 c -0.1535 -0.4067 -9.7724 -26.1184 0.0305 -56.2648 z" ',
      'transform="translate(-70,148) scale(.7,.7)" stroke-opacity="0.02" fill-opacity="0.02" fill="transparent">'
    );

    bytes memory bufferAnimate3 = abi.encodePacked(
      '<animate attributeName="fill" values="transparent;white;transparent" begin="c.begin+.6s;a.begin+.6s" dur="1s"/>',
      '<animate attributeName="stroke" values="transparent;white;transparent" begin="c.begin+.6s;a.begin+.6s" dur="1s"/>',
      '<animate attributeName="fill" values="transparent;black;transparent" begin="c.begin+.6s;a.begin+.6s" dur="1s"/>',
      '<animate attributeName="stroke" values="transparent;black;transparent" begin="c.begin+.6s;a.begin+.6s" dur="1s"/>',
      '</path></g> <use href="#borders" x="-500" y="-500" transform="rotate(180)"/></svg>'
    );

    return abi.encodePacked(bufferAnimate1, bufferAnimate2, bufferAnimate3);
  }

  function generateTraits(uint256 tokenId)
    internal
    view
    returns (SyncTraits memory)
  {
    SyncTraits memory traits;
    traits.direction = uint8((_rng(tokenId) % 4) + 2);
    traits.strokeWidth = uint8((_rng(tokenId) % 8) + 1);
    traits.stepDuration = uint8((_rng(tokenId) % 3) + 1);

    return traits;
  }

  function _rng(uint256 tokenId) internal pure returns (uint256) {
    uint256 _tokenId = tokenId + 1;
    uint256 seed = uint256(uint160(THE_COLORS));
    return
      uint256(
        keccak256(abi.encodePacked(_tokenId.toString(), seed.toString()))
      ) + uint256(_tokenId * seed);
  }
}
