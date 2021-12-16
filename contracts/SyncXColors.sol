// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;
pragma abicoder v2;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/Strings.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import '@openzeppelin/contracts/security/Pausable.sol';
import 'base64-sol/base64.sol';
import './legacy_colors/TheColors.sol';
import './legacy_colors/INFTOwner.sol';

/**
 * @title Sync x Colors contract
 * @dev Extends ERC721 Non-Fungible Token Standard basic implementation
 */
contract Sync is ERC721Enumerable, Ownable, ReentrancyGuard {
  using Strings for uint256;
  using Strings for uint16;
  using Strings for uint8;

  uint256 public constant MAX_TOKENS = 3333;

  // Declare Public
  uint256 private constant mintPrice = 0.04 ether; // Price per mint
  uint256 private constant resyncPrice = 0.005 ether; // Price per color resync
  uint256 private constant maxMintAmount = 10; // Max amount of mints per transaction
  address private constant TREASURY =
    address(0x48aE900E9Df45441B2001dB4dA92CE0E7C08c6d2);
  address public constant THE_COLORS =
    address(0x5FbDB2315678afecb367f032d93F642f64180aa3); //0x3C4CfA9540c7aeacBbB81532Eb99D5E870105CA9);

  // Declare Private
  //bool internal _isPublicMintActive;
  mapping(uint256 => uint16[]) private _colorTokenIds;
  mapping(uint256 => uint256) private _seed;

  struct SyncTraitsStruct {
    uint8[] shape_color;
    uint8[] shape_type;
    uint16[] shape_x;
    uint16[] shape_y;
    uint16[] shape_sizey;
    uint16[] shape_sizex;
    uint16[] shape_r;
    uint16 rarity_index;
  }

  // Constructor
  constructor() ERC721('Sync x Colors', 'SYNC Beta') ReentrancyGuard() {}

  function tokenURI(uint256 tokenId)
    public
    view
    virtual
    override(ERC721)
    returns (string memory)
  {
    require(_exists(tokenId), 'ERC721: operator query for nonexistent token');

    SyncTraitsStruct memory syncTraits = generateTraits(tokenId);

    string memory svgData = generateSVGImage(tokenId, syncTraits);
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
                generateAttributes(tokenId, syncTraits),
                '}'
              )
            )
          )
        )
      );
  }

  function getTokenMetadata(uint256 tokenId)
    external
    view
    returns (string memory)
  {
    require(_exists(tokenId), 'ERC721: operator query for nonexistent token');

    SyncTraitsStruct memory syncTraits = generateTraits(tokenId);
    string memory image = Base64.encode(
      bytes(generateSVGImage(tokenId, syncTraits))
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
          generateAttributes(tokenId, syncTraits),
          '}'
        )
      );
  }

  function getTokenSVG(uint256 tokenId) external view returns (string memory) {
    require(_exists(tokenId), 'ERC721: operator query for nonexistent token');

    SyncTraitsStruct memory syncTraits = generateTraits(tokenId);

    return generateSVGImage(tokenId, syncTraits);
  }

  function getBase64TokenSVG(uint256 tokenId)
    external
    view
    returns (string memory)
  {
    require(_exists(tokenId), 'ERC721: operator query for nonexistent token');

    SyncTraitsStruct memory syncTraits = generateTraits(tokenId);
    string memory image = Base64.encode(
      bytes(generateSVGImage(tokenId, syncTraits))
    );
    return string(abi.encodePacked('data:application/json;base64', image));
  }

  function withdraw() external payable nonReentrant onlyOwner {
    uint256 balance = address(this).balance;
    uint256 for_treasury = (balance * 33) / 100; //33% 1 way
    uint256 for_r1 = (balance * 67) / (5 * 100); //67% 5 ways
    uint256 for_r2 = (balance * 67) / (5 * 100);
    uint256 for_r3 = (balance * 67) / (5 * 100);
    uint256 for_r4 = (balance * 67) / (5 * 100);
    uint256 for_r5 = (balance * 67) / (5 * 100);
    payable(TREASURY).transfer(for_treasury);
    //payable(0x).transfer(for_r1);
    //payable(0x).transfer(for_r2);
    //payable(0x).transfer(for_r3);
    //payable(0x).transfer(for_r4);
    //payable(0x).transfer(for_r5);
    balance = address(this).balance;
    payable(msg.sender).transfer(balance);
  }

  /**
   * Mint multiple SYNCxCOLOR NFTs
   */
  function mintMany(uint256 _mintAmount, uint16[] calldata colorTokenIds)
    external
    payable
    nonReentrant
  {
    // Requires
    uint16 _mintIndex = uint16(totalSupply());
    require(_mintAmount <= maxMintAmount, 'Max mint 10 per tx');
    require(_mintAmount > 0, 'Mint should be > 0');
    require(_mintIndex + _mintAmount <= MAX_TOKENS, 'Exceeds supply');
    require(colorTokenIds.length <= 3, '# COLORS tokenIds must be <=3');
    require(msg.value >= (mintPrice * _mintAmount), 'Insufficient funds');

    // Validate colorTokenIds
    require(checkHolder(colorTokenIds) == true, 'COLORS not owned by sender.');

    for (uint256 i = _mintIndex; i < (_mintIndex + _mintAmount); i++) {
      // Update state
      _colorTokenIds[i] = colorTokenIds;
      _seed[i] = _rng(i);
      // Mint
      _mintOnce(i);
    }
  }

  /**
   * Mint one SYNCxCOLOR NFT
   */
  function mint(uint16[] calldata colorTokenIds) external payable nonReentrant {
    // Requires
    uint256 mintIndex = totalSupply();
    require(mintIndex < MAX_TOKENS, 'Exceeds supply');
    require(colorTokenIds.length <= 3, '# COLORS tokenIds must be <=3');
    require(msg.value >= mintPrice, 'Insufficient funds');

    // Validate colorTokenIds
    require(checkHolder(colorTokenIds) == true, 'COLORS not owned by sender.');

    //Update states
    _colorTokenIds[mintIndex] = colorTokenIds;
    _seed[mintIndex] = _rng(mintIndex);

    //Mint
    _mintOnce(mintIndex);
  }

  /**
   * Mints once
   */
  function _mintOnce(uint256 mintIndex) internal {
    _safeMint(msg.sender, mintIndex);
  }

  /**
   * Store mapping between tokenId and applied tokenIdColors
   */
  function updateColors(uint256 tokenId, uint16[] calldata colorTokenIds)
    external
    payable
  {
    require(msg.sender == ownerOf(tokenId), 'Only NFT holder can updateColors');
    require(colorTokenIds.length <= 3, '# COLORS tokenIds must be <=3');
    require(msg.value >= resyncPrice, 'Insufficient funds');
    // Validate colorTokenIds
    require(checkHolder(colorTokenIds) == true, 'COLORS not owned by sender.');

    _colorTokenIds[tokenId] = colorTokenIds;
  }

  /**
   * Verify that sender holds supplied colorTokenIds
   */
  function checkHolder(uint16[] calldata colorTokenIds)
    private
    view
    returns (bool)
  {
    address colors_address = THE_COLORS;
    for (uint256 i = 0; i < colorTokenIds.length; i++) {
      if (
        msg.sender !=
        INFTOwner(colors_address).ownerOf(uint256(colorTokenIds[i]))
      ) {
        return false;
      }
    }
    return true;
  }

  /**
   * Return NFT description
   */
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

  function getColorDescriptor(uint256 tokenId)
    private
    view
    returns (string memory)
  {
    uint16[] memory colorTokenIds = _colorTokenIds[tokenId];
    uint256 length = _colorTokenIds[tokenId].length;
    string memory colorDescriptor;
    for (uint256 i = 0; i < length; i++) {
      if (colorTokenIds[i] == 0) {
        break;
      }
      colorDescriptor = string(
        abi.encodePacked(
          colorDescriptor,
          TheColors(THE_COLORS).getHexColor(uint256(colorTokenIds[i])),
          ','
        )
      );
    }
    return colorDescriptor;
  }

  /**
   * Generate attributes json
   */
  function generateAttributes(
    uint256 tokenId,
    SyncTraitsStruct memory syncTraits
  ) internal view returns (string memory) {
    string memory rarity = 'Common';
    if (syncTraits.rarity_index >= 990) {
      rarity = 'Gold';
    } else if (syncTraits.rarity_index >= 950) {
      rarity = 'Silver';
    } else if (syncTraits.rarity_index >= 850) {
      rarity = 'Drift';
    }

    bytes memory buffer = abi.encodePacked(
      '"attributes":[',
      '{"trait_type":"Rarity","value":"',
      rarity,
      '"},',
      '{"trait_type":"Colors","value":"',
      getColorDescriptor(tokenId),
      '"}]'
    );
    return string(abi.encodePacked(buffer));
  }

  /**
   * Returns hex strings representing colorTokenIDs as an array
   */
  function getColorsHexStrings(uint256 tokenId)
    internal
    view
    returns (string[] memory)
  {
    uint16[] memory colorTokenIds = _colorTokenIds[tokenId];
    uint256 length = _colorTokenIds[tokenId].length;
    string[] memory hexColors = new string[](3);
    hexColors[0] = '#222222'; // Defaults (grayscale)
    hexColors[1] = '#777777';
    hexColors[2] = '#AAAAAA';
    for (uint256 i = 0; i < length; i++) {
      hexColors[i] = TheColors(THE_COLORS).getHexColor(
        uint256(colorTokenIds[i])
      );
    }
    return hexColors;
  }

  /**
   * Generates the SVG
   */
  function generateSVGImage(uint256 tokenId, SyncTraitsStruct memory syncTraits)
    private
    view
    returns (string memory)
  {
    string[] memory hexColors = getColorsHexStrings(tokenId);
    string[] memory bgColors = new string[](3);
    string[] memory inColors = new string[](3);
    string[] memory dColors = new string[](3);
    string memory label;
    for (uint256 i = 0; i < 3; i++) {
      bgColors[i] = hexColors[i]; //copy values
      inColors[i] = hexColors[i];
      dColors[i] = 'white';
    } // temporarily set really common for testing purposes
    if (syncTraits.rarity_index >= 700) { //Concave
      label='CONCAVE';
      bgColors[0] = '#214F70'; //Light Blue
      bgColors[1] = '#2E2E3F'; //Dark Blue
      bgColors[2] = '#2E2E3F'; //Dark Blue
      inColors[0] = '#FAF7C0'; //Off-yellow
      inColors[1] = '#214F70'; //Light Blue
      inColors[2] = '#FAF7C0'; //Off-yellow
      dColors[0] = '#FAF7C0'; //Off-yellow
      dColors[1] = '#FAF7C0'; //Off-yellow
      dColors[2] = '#FAF7C0'; //Off-yellow
      hexColors[0] = '#FAF7C0'; //Off-yellow
      hexColors[1] = '#FAF7C0'; //Off-yellow
      hexColors[2] = '#FAF7C0'; //Off-yellow
    } else if (syncTraits.rarity_index >= 400) { //GOOOLLLLLD
      label='GOLD';
      bgColors[0] = '#CD7F32'; //Gold
      bgColors[1] = '#E5E4E2'; //Platinum
      bgColors[2] = '#725d18'; //Darker Gold
      inColors[0] = 'black';
      inColors[1] = '#C0C0C0'; //silver
      inColors[2] = '#E5E4E2';
      hexColors = bgColors;
    } else if (syncTraits.rarity_index >= 300) { //Silver
      label='SILVER';
      dColors[0] = 'black'; //Label color
      bgColors[0] = '#c0c0c0'; //Silver
      bgColors[1] = '#e5e4e2'; //Platinum
      bgColors[2] = '#c0c0c0';
      inColors[0] = 'white';
      inColors[1] = '#C0C0C0'; //silver
      inColors[2] = '#CD7F32';
      hexColors = bgColors;
    } else if (syncTraits.rarity_index >= 100) { //Drift
      label='TOKYO DRIFT';
      dColors[0] = hexColors[0];
      dColors[1] = hexColors[1];
      dColors[2] = hexColors[2];
    }

    bytes memory svgBG = generateSVGBG(bgColors, syncTraits);
    bytes memory svgInfinity = generateSVGInfinity(inColors);
    bytes memory svgLogo = generateSVGLogo(hexColors, syncTraits);
    bytes memory svgDrift = generateSVGDrift(dColors,label);
    return
      string(
        abi.encodePacked(
          '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="500" height="500" viewbox="0 0 500 500" style="background-color:#111111">',
          svgBG,
          svgInfinity,
          svgLogo,
          svgDrift
        )
      );
  }

  /**
   * Generates the SVG Background
   */
  function generateSVGBG(
    string[] memory bgColors,
    SyncTraitsStruct memory syncTraits
  ) private pure returns (bytes memory) {
    bytes memory svgBG = '<g fill-opacity="0.3">';
    bytes memory newShape;

    for (uint256 i = 0; i < 15; i++) {
      if (syncTraits.shape_type[i] == 0) {
        newShape = abi.encodePacked(
          '<circle fill="',
          bgColors[syncTraits.shape_color[i]],
          '" cx="',
          syncTraits.shape_x[i].toString(),
          '" cy="',
          syncTraits.shape_y[i].toString(),
          '" r="',
          syncTraits.shape_sizex[i].toString(),
          '"/>'
        );
      } else if (syncTraits.shape_type[i] == 1) {
        newShape = abi.encodePacked(
          '<rect fill="',
          bgColors[syncTraits.shape_color[i]],
          '" x="',
          (syncTraits.shape_x[i] / 2).toString(),
          '" y="',
          (syncTraits.shape_y[i] / 2).toString(),
          '" width="',
          (syncTraits.shape_sizex[i] * 2).toString(),
          '" height="',
          (syncTraits.shape_sizey[i] * 2).toString(),
          '" transform="rotate(',
          syncTraits.shape_r[i].toString(),
          ')"/>'
        );
      }
      svgBG = abi.encodePacked(svgBG, newShape);
    }
    return abi.encodePacked(svgBG, '</g>');
  }

  /**
   * Generates the infinity
   */
  function generateSVGInfinity(string[] memory inColors)
    private
    pure
    returns (bytes memory)
  {
    bytes memory infinity1 = abi.encodePacked(
      '<g id="infinity_1"><path id="infinity" stroke-dasharray="0" stroke-dashoffset="0" stroke-width="16" ',
      'd="M195.5 248c0 30 37.5 30 52.5 0s 52.5-30 52.5 0s-37.5 30-52.5 0s-52.5-30-52.5 0" fill="none">',
      '<animate begin="s.begin" attributeType="XML" attributeName="stroke"  values="',
      inColors[0],
      ';',
      inColors[1],
      ';',
      inColors[0],
      '" dur="4s" fill="freeze"/>'
    );
    bytes memory infinity2 = abi.encodePacked(
      '<animate begin="s.begin" attributeType="XML" attributeName="stroke-dasharray" values="0;50;0" dur="6s" fill="freeze"/>',
      '<animate begin="a.begin" attributeType="XML" attributeName="stroke-width" values="16;20;16" dur="1s" fill="freeze"/>',
      '</path><path id="infinity_2" stroke-dasharray="300" stroke-dashoffset="300" stroke="#FFFFFF" stroke-width="16" ',
      'd="M195.5 248c0 30 37.5 30 52.5 0s 52.5-30 52.5 0s-37.5 30-52.5 0s-52.5-30-52.5 0" fill="none">'
    );
    bytes memory infinity3 = abi.encodePacked(
      '<animate begin="s.begin" attributeType="XML" attributeName="stroke" values="',
      inColors[2],
      ';',
      inColors[0],
      ';',
      inColors[2],
      '" dur="4s" fill="freeze"/>',
      '<animate id="a" begin="s.begin;s.begin+1s;s.begin+2s;s.begin+3s;s.begin+4s;s.begin+5s;s.begin+6s" ',
      'attributeType="XML" attributeName="stroke-width" values="16;20;16" dur="1s" fill="freeze" />',
      '<animate id="s" attributeType="XML" attributeName="stroke-dashoffset" begin="0s;s.end" to= "-1800" dur="6s"  /></path></g>'
    );
    return abi.encodePacked(infinity1, infinity2, infinity3);
  }

  /**
   * Generates the logo
   */
  function generateSVGLogo(
    string[] memory hexColors,
    SyncTraitsStruct memory syncTraits
  ) private pure returns (bytes memory) {
    bytes memory logo = abi.encodePacked(
      '<g id="b">',
      '<path d="M194 179H131c-34 65 0 143 0 143h63C132 251 194 179 194 179Zm-26 128H144s-25-35 0-111h23S126 245 168 307Z" stroke="black" fill-opacity="0.9" ',
      'stroke-width=".7">',
      '<animate id="p" begin="s.begin+2s" attributeName="fill" values="black;',
      hexColors[0],
      ';black" dur="2s"/>',
      '<animate id="q" begin="s.begin+4s" attributeName="fill" values="black;',
      hexColors[1],
      ';black" dur="2s" />',
      '<animate id="r" begin="s.begin+6s" attributeName="fill" values="black;',
      hexColors[2],
      ';black" dur="2s" />'
    );

    if (syncTraits.rarity_index >= 300) {//Shimmer
      logo = abi.encodePacked(
        logo,
        '<set attributeName="stroke-dasharray" to="20"/>',
        '<animate begin="s.begin;s.end" attributeType="XML" attributeName="stroke-dashoffset" from="0" to="280" dur="6s" fill="freeze" />',
        '<animate begin="s.begin;s.end" attributeType="XML" attributeName="stroke" values="',
        hexColors[0],
        ';',
        hexColors[1],
        ';',
        hexColors[2],
        ';',
        hexColors[0],
        '" dur="6s" fill="freeze" />'
      );
    }
    return logo;
  }

  /**
   * Generates the drift
   */
  function generateSVGDrift(string[] memory dColors, string memory label)
    private
    pure
    returns (bytes memory)
  {
    bytes memory borders1 = abi.encodePacked(
      '</path><text x="10" y="25" fill="',dColors[0],'" >',label,'</text>',
      '<path d="M90 203c-21 41 0 91 0 91h11c0 0-16-42 0-91z" stroke-opacity=".7" fill-opacity=".7" fill="transparent">'
      '<animate id="w" attributeName="fill" values="transparent;',
      dColors[0],
      ';transparent" begin="p.begin+.4s;q.begin+.4s;r.begin+.4s" dur="1s"/>',
      '<animate begin="w.begin" attributeName="stroke" values="transparent;black;transparent" dur="1s"/>',
      '</path>'
    );

    bytes memory borders2 = abi.encodePacked(
      '<path ',
      'd="M60 212c-17 34 0 74 0 74h9c0-1-13-34 0-74z" stroke-opacity=".35" fill-opacity=".5" fill="transparent">',
      '<animate attributeName="fill" values="transparent;',
      dColors[1],
      ';transparent" begin="w.begin+.2s" dur="1s"/>',
      '<animate attributeName="stroke" values="transparent;black;transparent" begin="w.begin+.2s" dur="1s"/>',
      '</path>'
    );

    bytes memory borders3 = abi.encodePacked(
      '<path ',
      'd="M37 221c-13 26 0 57 0 57h7c0 0-10-26 0-57z" stroke-opacity=".05" fill-opacity="0.3" fill="transparent">',
      '<animate attributeName="fill" values="transparent;',
      dColors[2],
      ';transparent" begin="w.begin+.4s" dur="1s"/>',
      '<animate attributeName="stroke" values="transparent;black;transparent" begin="w.begin+.4s" dur="1s"/>',
      '</path></g><use href="#b" x="-500" y="-500" transform="rotate(180)"/></svg>'
    );

    return abi.encodePacked(borders1, borders2, borders3);
  }

  /**
   * Generates the NFT traits by stored seed (note: seed generated and stored at mint)
   */
  function generateTraits(uint256 tokenId)
    private
    view
    returns (SyncTraitsStruct memory)
  {
    SyncTraitsStruct memory syncTraits;
    uint256 seed = _seed[tokenId];

    syncTraits.shape_x = new uint16[](15);
    syncTraits.shape_y = new uint16[](15);
    syncTraits.shape_sizex = new uint16[](15);
    syncTraits.shape_sizey = new uint16[](15);
    syncTraits.shape_r = new uint16[](15);
    syncTraits.shape_type = new uint8[](15);
    syncTraits.shape_color = new uint8[](15);

    syncTraits.rarity_index = uint16(
      1 + ((seed & 0x3FF0000000000000000000000000000) % 1000)
    );
    for (uint256 i = 0; i < 15; i++) {
      //Generate properties for 15 random shapes to form the background (squares/circles)
      syncTraits.shape_x[i] = uint16(1 + ((seed & 0x3FF) % 500));
      syncTraits.shape_y[i] = uint16(1 + (((seed & 0x3FF0000) / 2**4) % 500));
      syncTraits.shape_sizex[i] = uint16(
        250 + (((seed & 0x1FF00000000) / 2**5) % 151)
      );
      syncTraits.shape_sizey[i] = uint16(
        250 + (((seed & 0x1FF000000000000) >> 48) % 151)
      );
      syncTraits.shape_r[i] = uint16(
        1 + (((seed & 0x1FF0000000000000000) / 2**6) % 360)
      );
      syncTraits.shape_type[i] = uint8(
        ((seed & 0x1FF00000000000000000000) >> 80) % 2
      );
      syncTraits.shape_color[i] = uint8(
        ((seed & 0x1FF000000000000000000000000) >> 96) % 3
      );
      seed = seed >> 2;
    }
    return syncTraits;
  }

  /**
   * Produce a PRNG uint256 as hash of several inputs
   */
  function _rng(uint256 tokenId) private view returns (uint256) {
    uint256 _tokenId = tokenId + 1;
    uint256 seed = uint256(uint160(THE_COLORS));
    return
      uint256(
        keccak256(
          abi.encodePacked(
            _tokenId.toString(),
            block.timestamp,
            block.difficulty,
            seed
          )
        )
      ) + uint256(_tokenId * seed);
  }
}
