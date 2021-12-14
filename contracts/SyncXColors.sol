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
contract Sync is ERC721Enumerable, Ownable, ReentrancyGuard, Pausable {
  using Strings for uint256;
  using Strings for uint32;
  using Strings for uint8;

  uint256 public immutable maxTokenId; //2122

  // Declare Public
  uint256 public mintPrice = 0.04 ether; // Price per mint
  address public constant TREASURY =
    address(0x48aE900E9Df45441B2001dB4dA92CE0E7C08c6d2);
  address public constant THE_COLORS =
    address(0x3C4CfA9540c7aeacBbB81532Eb99D5E870105CA9);
  uint256 public maxMintAmount = 10; // Max amount of mints per transaction

  // Declare Private
  bool internal _isPublicMintActive;
  mapping(uint256 => uint256) private _seed;
  mapping(uint256 => uint16[]) private _colorTokenIds;

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
  constructor(uint256 _maxTokenId)
    public
    ERC721('Sync x Colors', 'SYNC Beta')
    ReentrancyGuard()
    Pausable()
  {
    maxTokenId = _maxTokenId;
    _pause();
  }

  function tokenURI(uint256 tokenId)
    public
    view
    virtual
    override(ERC721)
    returns (string memory)
  {
    require(_exists(tokenId), 'ERC721: operator query for nonexistent token');

    uint16[] memory colorTokenIds = _colorTokenIds[tokenId];
    SyncTraitsStruct memory syncTraits = generateTraits(tokenId);

    string memory svgData = generateSVGImage(
      tokenId,
      colorTokenIds,
      syncTraits
    );
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
                generateAttributes(tokenId, colorTokenIds, syncTraits),
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
    uint16[] memory colorTokenIds = _colorTokenIds[tokenId];
    SyncTraitsStruct memory syncTraits = generateTraits(tokenId);
    string memory image = Base64.encode(
      bytes(generateSVGImage(tokenId, colorTokenIds, syncTraits))
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
          generateAttributes(tokenId, colorTokenIds, syncTraits),
          '}'
        )
      );
  }

  function getColorDescriptor(uint16[] memory colorTokenIds)
    private
    view
    returns (string memory)
  {
    string memory colorDescriptor;
    for (uint256 i = 0; i < 3; i++) {
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

  function getTokenSVG(uint256 tokenId) external view returns (string memory) {
    require(_exists(tokenId), 'ERC721: operator query for nonexistent token');
    uint16[] memory colorTokenIds = _colorTokenIds[tokenId];
    SyncTraitsStruct memory syncTraits = generateTraits(tokenId);

    return generateSVGImage(tokenId, colorTokenIds, syncTraits);
  }

  function getBase64TokenSVG(uint256 tokenId)
    external
    view
    returns (string memory)
  {
    require(_exists(tokenId), 'ERC721: operator query for nonexistent token');
    uint16[] memory colorTokenIds = _colorTokenIds[tokenId];
    SyncTraitsStruct memory syncTraits = generateTraits(tokenId);
    string memory image = Base64.encode(
      bytes(generateSVGImage(tokenId, colorTokenIds, syncTraits))
    );
    return string(abi.encodePacked('data:application/json;base64', image));
  }

  function getColorsOwnedByUser(address user)
    external
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

  function unpause() public onlyOwner {
    _unpause();
  }

  function pause() public onlyOwner {
    _pause();
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
    function mintMany(uint256 _mintAmount, uint16[] calldata colorTokenIds) nonReentrant external payable whenNotPaused {
        // Requires
        uint256 _mintIndex = totalSupply();
        require(_mintAmount <= maxMintAmount,"Max mint 10 per tx");
        require(_mintAmount > 0,"Mint should be > 0");
        require(_mintIndex + _mintAmount <= maxTokenId, "Exceeds supply");
        require(colorTokenIds.length <= 3, "# Supplied 'THE COLORS' tokenIds must be <=3");
        require (msg.value >= (mintPrice * _mintAmount), "Insufficient funds");
        
        // Validate colorTokenIds
        address colors_address = THE_COLORS;
        for (uint i = 0; i < colorTokenIds.length; i++) {
			require (msg.sender == INFTOwner(colors_address).ownerOf(uint256(colorTokenIds[i])),"Supplied 'THE COLORS' tokenId not owned by msg.sender.") ;
		}

        for (uint i = _mintIndex; i < (_mintIndex + _mintAmount); i++) {
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
    function mint(uint16[] calldata colorTokenIds) nonReentrant external payable whenNotPaused returns (bool){
		// Requires
        uint256 mintIndex = totalSupply();
		require (mintIndex < maxTokenId, "Mint would exceed max supply."); 
		require(colorTokenIds.length <= 3, "Supplied 'THE COLORS' tokenIds must be <=3");
        require (msg.value >= mintPrice, "Insufficient funds");
		
        // Validate colorTokenIds
        address colors_address = THE_COLORS; //Avoid accessing on-chain storage more than once here
		for (uint i = 0; i < colorTokenIds.length; i++) {
			require (msg.sender == INFTOwner(colors_address).ownerOf(uint256(colorTokenIds[i])),"Supplied 'THE COLORS' tokenId not owned by msg.sender.") ;
		}
		
        //Update states
		_colorTokenIds[mintIndex] = colorTokenIds;
        _seed[mintIndex] = _rng(mintIndex);

        //Mint
        _mintOnce(mintIndex);

        return true;
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
  function updateColors(uint256 tokenId, uint16[] memory colorTokenIds)
    external
    nonReentrant
  {
    require(
      msg.sender == ownerOf(tokenId),
      'Only the NFT holder can update its colors'
    );
    require(
      colorTokenIds.length <= 3,
      "Supplied 'THE COLORS' tokenIds must be between 0 and 3."
    );

    for (uint256 i = 0; i < colorTokenIds.length; i++) {
      require(
        msg.sender == INFTOwner(THE_COLORS).ownerOf(uint256(colorTokenIds[i])),
        "Supplied 'THE COLORS' tokenId is not owned by msg.sender."
      );
    }

    _colorTokenIds[tokenId] = colorTokenIds;
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

  /**
   * Generate attributes json
   */
  function generateAttributes(
    uint256 tokenId,
    uint16[] memory colorTokenIds,
    SyncTraitsStruct memory syncTraits
  ) internal view returns (string memory) {
    string memory rarity;
    if (syncTraits.rarity_index >= 990) {
      rarity = 'Gold';
    } else if (syncTraits.rarity_index >= 950) {
      rarity = 'Silver';
    } else if (syncTraits.rarity_index >= 850) {
      rarity = 'Drift';
    } else {
      rarity = 'Common';
    }

    bytes memory buffer = abi.encodePacked(
      '"attributes":[',
      '{"trait_type":"Rarity","value":"',
      rarity,
      '"},',
      '{"trait_type":"Colors","value":"',
      getColorDescriptor(colorTokenIds),
      '"}]'
    );
    return string(abi.encodePacked(buffer));
  }

  /**
   * Returns hex strings representing colorTokenIDs as an array
   */
  function getHexStrings(uint16[] memory colorTokenIds)
    internal
    view
    returns (string[] memory)
  {
    string[] memory hexColors = new string[](3);
    hexColors[0] = '#222222'; // Defaults (grayscale)
    hexColors[1] = '#777777';
    hexColors[2] = '#AAAAAA';
    for (uint256 i = 0; i < 3; i++) {
      hexColors[i] = TheColors(THE_COLORS).getHexColor(
        uint256(colorTokenIds[i])
      );
    }
  }
    /**
    * Generates the SVG
    */
    function generateSVGImage(uint256 tokenId, uint16[] memory colorTokenIds, SyncTraitsStruct memory syncTraits) private view returns (string memory) {
		
        string[] memory hexColors = getHexStrings(colorTokenIds);
        string[] memory bgColors = new string[](3);
        string[] memory inColors = new string[](3);
        string[] memory dColors = new string[](3);
        for (uint i=0; i < 3; i++) {
            bgColors[i] = hexColors[i]; //copy values
            inColors[i] = hexColors[i];
            dColors[i] = 'white';
        }
        if (syncTraits.rarity_index >= 990){bgColors[0] = '#CD7F32';//Gold
                                           bgColors[1] = '#E5E4E2';//Platinum
                                           bgColors[2] = '#725d18';//Darker Gold
                                           inColors[0] = 'black';
                                           inColors[1] = '#C0C0C0';//silver
                                           inColors[2] = '#E5E4E2';

        }
        else if (syncTraits.rarity_index >= 950){bgColors[1] = '#c0c0c0';//Silver
                                                bgColors[2] = '#e5e4e2';//Platinum
                                                bgColors[0] = '#c0c0c0';
                                                inColors[0] = 'white';
                                                inColors[1] = '#C0C0C0';//silver
                                                inColors[2] = '#CD7F32';
        }
        else if (syncTraits.rarity_index>=850){ //Tokyo Drift
            dColors[0] = hexColors[0];
            dColors[1] = hexColors[1];
            dColors[2] = hexColors[2];
        }

        bytes memory svgBG = generateSVGBG(bgColors,syncTraits);
        bytes memory svgInfinity = generateSVGInfinity(inColors);
		bytes memory svgLogo = generateSVGLogo(bgColors,syncTraits);
		bytes memory svgDrift = generateSVGDrift(dColors);
        return string(
            abi.encodePacked(
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
	function generateSVGBG(string[] memory bgColors, SyncTraitsStruct memory syncTraits) private pure returns (bytes memory) {
        bytes memory svgBG;
        bytes memory newShape;

        for (uint i =0; i<16; i++){
            if (syncTraits.shape_type[i] == 1){
                newShape = abi.encodePacked('<circle fill=',bgColors[syncTraits.shape_color[i]],
                                            'cx=',syncTraits.shape_x[i],
                                            'cy=',syncTraits.shape_y[i],
                                            'r=',syncTraits.shape_sizex[i],'/>');
            }
            else if (syncTraits.shape_type[i] == 2){
                newShape = abi.encodePacked('<rect fill=',bgColors[syncTraits.shape_color[i]],
                                            'x=',syncTraits.shape_x[i]/2,
                                            'y=',syncTraits.shape_y[i]/2,
                                            'width=',syncTraits.shape_sizex[i]*2,
                                            'height=',syncTraits.shape_sizey[i]*2,
                                            'transform="rotate(',syncTraits.shape_r[i],')"/>');
            }
            svgBG = abi.encodePacked( svgBG, newShape );       
        }
        return svgBG;
    }

    /**
    * Generates the infinity
    */
    function generateSVGInfinity(string[] memory inColors) private pure returns (bytes memory) {
		bytes memory infinity1 = abi.encodePacked(
			'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="500" height="500" viewbox="0 0 500 500">',
            '<g id="infinity_1"><path id="infinity" stroke-dasharray="0" stroke-dashoffset="0" stroke-width="16" ',
        	'd="M195.5 248c0 30 37.5 30 52.5 0s 52.5-30 52.5 0s-37.5 30-52.5 0s-52.5-30-52.5 0" fill="none">',
        	'<animate begin="s.begin" attributeType="XML" attributeName="stroke"  values="',
            inColors[0],';',inColors[1],';',inColors[0],'" dur="4s" fill="freeze"/>'
        );
        bytes memory infinity2 = abi.encodePacked(
			'<animate begin="s.begin" attributeType="XML" attributeName="stroke-dasharray" values="0;50;0" dur="6s" fill="freeze"/>',
        	'<animate begin="a.begin" attributeType="XML" attributeName="stroke-width" values="16;20;16" dur="1s" fill="freeze"/>',
        	'</path><path id="infinity_2" stroke-dasharray="300" stroke-dashoffset="300" stroke="#FF1111" stroke-width="16" ',
        	'd="M195.5 248c0 30 37.5 30 52.5 0s 52.5-30 52.5 0s-37.5 30-52.5 0s-52.5-30-52.5 0" fill="none">'
        );
        bytes memory infinity3 = abi.encodePacked(    
        	'<animate begin="s.end" attributeType="XML" attributeName="stroke" values="',
            inColors[2],';',inColors[0],';',inColors[2],'" dur="4s" fill="freeze"/>',
        	'<animate id="a" begin="s.begin;s.begin+1s;s.begin+2s;s.begin+3s;s.begin+4s;s.begin+5s;s.begin+6s" ',
            'attributeType="XML" attributeName="stroke-width" values="16;20;16" dur="1s" fill="freeze" />',
        	'<animate id="s" attributeType="XML" attributeName="stroke-dashoffset" begin="0s;s.end" to= "-1800" dur="6s"  /></path></g>'
        );
        return abi.encodePacked(infinity1, infinity2, infinity3);
    }

    /**
    * Generates the logo
    */
    function generateSVGLogo(string[] memory hexColors, SyncTraitsStruct memory syncTraits) private pure returns (bytes memory)
    {
        bytes memory logo = abi.encodePacked(
            '<g id="borders">',
            '<path d="M144.4 89.31h-31.3c-16.88 32.57 0 71.38 0 71.38h31.3c-30.95-35 0-71.38 0-71.38Zm-13.17 ',
            '63.76h-11.65s-12.47-17.38 0-55.68h11.65s-20.8 25.18 0 55.68Z" transform="matrix(2 0 0 2 -95 0)" stroke="black" fill-opacity="0.9" ', 
            'stroke-width=".7" stroke-dasharray="20" stroke-dashoffset="10"',
            '<animate id="p" begin="s.begin+2s" attributeName="fill" values="black;',hexColors[0],';black" dur="2s"/>',
			'<animate id="q" begin="s.begin+4s" attributeName="fill" values="black;',hexColors[1],';black" dur="2s" />',
			'<animate id="r" begin="s.begin+6s" attributeName="fill" values="black;',hexColors[2],';black" dur="2s" />'
        );

        if (syncTraits.rarity_index>=950){
            logo = abi.encodePacked(logo, 
            '<animate begin="p.begin;q.begin;r.begin" attributeType="XML" attributeName="stroke-dashoffset" from="0" to="230" dur="1s" fill="freeze" />',
		    '<animate begin="s.begin;s.end" attributeType="XML" attributeName="stroke" values="',
            hexColors[0],';',hexColors[1],';',hexColors[2],';',hexColors[0],'" dur="6s" fill="freeze" />'
            );
        }
   
        return logo;
    }	
	
    /**
    * Generates the drift
    */
	function generateSVGDrift(string[] memory dColors) private pure returns (bytes memory)
    {
        bytes memory borders1 = abi.encodePacked(
            '</path><path d="M107.3179 117.5457c 13.3985 25.8524 0 56.658 0 56.658 h 6.873c-0.1535-0.4067-9.7724-26.1184 .0305-56.2648z" ',
			'transform="translate(-85,15) scale(1.6,1.6)" stroke-opacity=".7" fill-opacity=".7" fill="transparent">'
			'<animate id="w" attributeName="fill" values="transparent;',dColors[0],';transparent" begin="p.begin+.4s";q.begin+.4s;r.begin+.4s" dur="1s"/>',
			'<animate begin="w.begin" attributeName="stroke" values="transparent;black;transparent" dur="1s"/>',
			'</path>'
        );

        bytes memory borders2 = abi.encodePacked(
			'<path ',
			'd="M 107.3179 117.5457 c -13.3985 25.8524 0 56.658 0 56.658 h 6.873 c -0.1535 -0.4067 -9.7724 -26.1184 .0305 -56.2648 z" ',
			'transform="translate(-88,60) scale(1.3,1.3)" stroke-opacity=".35" fill-opacity=".5" fill="transparent">',
			'<animate attributeName="fill" values="transparent;',dColors[1],';transparent" begin="w.begin+.2s" dur="1s"/>',
			'<animate attributeName="stroke" values="transparent;black;transparent" begin="w.begin+.2s" dur="1s"/>',
			'</path>'
        );
        
        bytes memory borders3 = abi.encodePacked(
            '<path ',
			'd="M107.3179 117.5457 c-13.3985 25.8524 0 56.658 0 56.658 h6.873 c-0.1535-0.4067-9.7724-26.1184 .0305-56.2648z" ',
			'transform="translate(-82,104) scale(1,1)" stroke-opacity=".05" fill-opacity="0.3" fill="transparent">',
			'<animate attributeName="fill" values="transparent;',dColors[2],';transparent" begin="w.begin+.4s" dur="1s"/>',
			'<animate attributeName="stroke" values="transparent;black;transparent" begin="w.begin+.4s" dur="1s"/>',
			'</path>'
		);

        return abi.encodePacked(borders1, borders2, borders3);
    }	

    /**
    * Generates the NFT traits by stored seed (note: seed generated and stored at mint)
    */
    function generateTraits(uint256 tokenId) private view returns (SyncTraitsStruct memory) {
        SyncTraitsStruct memory syncTraits;
        uint256 seed = _seed[tokenId];
        syncTraits.rarity_index = uint16(1 + (seed & 0x3FF0000000000000000000000000000) % 1000);
        for (uint i = 0; i<16; i++){    //Generate properties for 16 random shapes to form the background (squares/circles)
            syncTraits.shape_x[i] = uint16(1 + (seed & 0x1FF) % 500);
            syncTraits.shape_y[i] = uint16(1 + (seed & 0x1FF0000) % 500);
            syncTraits.shape_sizex[i] = uint16(250 + (seed & 0x1FF00000000) % 151);
            syncTraits.shape_sizey[i] = uint16(250 + (seed & 0x1FF000000000000) % 151);
            syncTraits.shape_r[i] = uint16(1 + (seed & 0x1FF0000000000000000) % 360);
            syncTraits.shape_type[i] = uint8((seed & 0x1FF00000000000000000000) % 2);
            syncTraits.shape_color[i] = uint8((seed & 0x1FF000000000000000000000000) % 3);
            seed = seed >> 2;
        }       
        return syncTraits;
    }

    /**
    * Produce a PRNG uint256 as hash of several inputs
    */
    function _rng(uint256 tokenId) private view returns(uint256) {
        uint256 _tokenId = tokenId + 1;
        uint256 seed = uint256(uint160(THE_COLORS));
        return uint256(keccak256(abi.encodePacked(_tokenId.toString(), block.timestamp, block.difficulty))) +
                uint256(_tokenId * seed);
    }
}
