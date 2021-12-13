// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;
pragma abicoder v2;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/Strings.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import "@openzeppelin/contracts/security/Pausable.sol";
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
    address public constant TREASURY = address(0x48aE900E9Df45441B2001dB4dA92CE0E7C08c6d2);
    address constant public THE_COLORS = address(0x3C4CfA9540c7aeacBbB81532Eb99D5E870105CA9);
    string public PROVENANCE_HASH = "";
    uint256 public maxMintAmount = 10; // Max amount of mints per transaction

    // Declare Private
    bool internal _isPublicMintActive;	
	
	mapping(uint256 => uint256) private _seed;
    mapping(uint256 => uint16[]) private _colorTokenIds;
    bool internal locked;

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
    constructor(uint256 _maxTokenId) ERC721("Sync x Colors", "SYNC Beta") ReentrancyGuard() Pausable() public{
        maxTokenId = _maxTokenId;      
        _pause();
    }
   
    function tokenURI(uint256 tokenId) public view virtual override(ERC721) returns (string memory) {
        require (_exists(tokenId), "ERC721: operator query for nonexistent token");
        
        uint16[] memory colorTokenIds = _colorTokenIds[tokenId];
        SyncTraitsStruct memory syncTraits = generateTraits(tokenId);

        string memory svgData = generateSVGImage(tokenId, colorTokenIds, syncTraits);
        string memory image = Base64.encode(bytes(svgData));
		
		
        return string(
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

    function getTokenMetadata(uint256 tokenId) external view returns (string memory) {
		require (_exists(tokenId), "ERC721: operator query for nonexistent token");
		uint16[] memory colorTokenIds = _colorTokenIds[tokenId];
        SyncTraitsStruct memory syncTraits = generateTraits(tokenId);
        string memory image = Base64.encode(bytes(generateSVGImage(tokenId, colorTokenIds, syncTraits)));

        return string(
            abi.encodePacked(
                'data:application/json',
                '{',
                '"image":"',
                'data:image/svg+xml;base64,',
                image,
                '",',
                generateNameDescription(tokenId),',',
                generateAttributes(tokenId, colorTokenIds, syncTraits),
                '}'
            )
        );
    }
	
	function getColorDescriptor(uint16[] memory colorTokenIds) private view returns (string memory) {
		string memory colorDescriptor;
        for (uint i=0; i<3; i++){
			if (colorTokenIds[i] == 0) {break;}
			colorDescriptor = string(abi.encodePacked(colorDescriptor, TheColors(THE_COLORS).getHexColor(uint256(colorTokenIds[i])),','));
        }
        return colorDescriptor;
	}
	
    function getTokenSVG(uint256 tokenId) external view returns (string memory) {
		require (_exists(tokenId), "ERC721: operator query for nonexistent token");
        uint16[] memory colorTokenIds = _colorTokenIds[tokenId];
        SyncTraitsStruct memory syncTraits = generateTraits(tokenId);

        return generateSVGImage(tokenId,colorTokenIds, syncTraits);
    }

    function getBase64TokenSVG(uint256 tokenId) external view returns (string memory) {
		require (_exists(tokenId), "ERC721: operator query for nonexistent token");
        uint16[] memory colorTokenIds = _colorTokenIds[tokenId];
        SyncTraitsStruct memory syncTraits = generateTraits(tokenId);
        string memory image = Base64.encode(bytes(generateSVGImage(tokenId,colorTokenIds,syncTraits)));
        return string(
            abi.encodePacked(
                'data:application/json;base64',
                image
            )
        );
    }
    
    function getColorsOwnedByUser(address user) external view returns (uint256[] memory tokenIds) {
        uint256[] memory tokenIds = new uint256[](4317);

        uint index = 0;
        for (uint i = 0; i < 4317; i++) {
            address tokenOwner = INFTOwner(THE_COLORS).ownerOf(i);

            if (user == tokenOwner) {
                tokenIds[index] = i;
                index += 1;
            }
        }

        uint left = 4317 - index;
        for (uint i = 0; i < left; i++) {
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

    function withdraw() nonReentrant external payable onlyOwner {
        uint256 balance = address(this).balance;
        uint256 for_treasury = balance * 33 / 100;  //33% 1 way
        uint256 for_r1 = (balance * 67) / (5*100);  //67% 5 ways
        uint256 for_r2 = (balance * 67) / (5*100);
        uint256 for_r3 = (balance * 67) / (5*100);
        uint256 for_r4 = (balance * 67) / (5*100);
        uint256 for_r5 = (balance * 67) / (5*100);
        payable(TREASURY).transfer(for_treasury);
        //payable(0x).transfer(for_r1);
        //payable(0x).transfer(for_r2);
        //payable(0x).transfer(for_r3);
        //payable(0x).transfer(for_r4);
        //payable(0x).transfer(for_r5);
        balance = address(this).balance;
        payable(msg.sender).transfer(balance);
    }

    /*
    * Set provenance once it's calculated
    */
    function setProvenanceHash(string memory provenanceHash) external onlyOwner {
        PROVENANCE_HASH = provenanceHash;
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
    * Mint single SYNCxCOLOR NFT
    */
    function mint(uint16[] calldata colorTokenIds) nonReentrant whenNotPaused external payable returns (bool){
		// Requires
        uint256 _mintIndex = totalSupply();
        
		require (_mintIndex < maxTokenId, "Mint would exceed max supply."); 
		require(colorTokenIds.length <= 3, "# Supplied 'THE COLORS' tokenIds must be <=3");
		require (msg.value > mintPrice, "Insufficient funds");
        
        // Validate colorTokenIds
        address colors_address = THE_COLORS;
		for (uint i = 0; i < colorTokenIds.length; i++) {
			require (msg.sender == INFTOwner(colors_address).ownerOf(uint256(colorTokenIds[i])),"Supplied 'THE COLORS' tokenId not owned by msg.sender.") ;
		}

		// Update state
		_colorTokenIds[_mintIndex] = colorTokenIds;
        _seed[_mintIndex] = _rng(_mintIndex);

        // Mint
        _mintOnce(_mintIndex);

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
	function updateColors(uint256 tokenId, uint16[] memory colorTokenIds) nonReentrant external{ 
		require(msg.sender == ownerOf(tokenId),"Only the NFT holder can update its colors");
		require(colorTokenIds.length <= 3, "Supplied 'THE COLORS' tokenIds must be between 0 and 3.");
		
		for (uint i = 0; i < colorTokenIds.length; i++) {
			require (msg.sender == INFTOwner(THE_COLORS).ownerOf(uint256(colorTokenIds[i])),"Supplied 'THE COLORS' tokenId is not owned by msg.sender.") ;
		}

		_colorTokenIds[tokenId] = colorTokenIds;

	}
    /**
    * Return NFT description
    */
    function generateNameDescription(uint256 tokenId) internal pure returns (string memory) {
        return string(
            abi.encodePacked(
                '"external_url":"https://thecolors.art",',
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
    function generateAttributes(uint256 tokenId, uint16[] memory colorTokenIds, SyncTraitsStruct memory syncTraits) internal view returns (string memory) {
		string memory rarity;
        if (syncTraits.rarity_index >= 990){rarity = 'Gold'; }
        else if (syncTraits.rarity_index >= 970){rarity = 'Silver'; }
        else {rarity = 'Common'; }

        bytes memory buffer = abi.encodePacked(
                '"attributes":[',
                '{"trait_type":"Rarity","value":"',
                'tbd',
                '"},',
                '{"trait_type":"Colors","value":"',
                getColorDescriptor(colorTokenIds),
                '"},',
                '{"trait_type":"Rarity","value":"',
                rarity,
                '"}]'
        );
		return string(
            abi.encodePacked(
                buffer
            )
        );
    }
	
    /**
    * Returns hex strings representing colorTokenIDs as an array
    */
	function getHexStrings(uint16[] memory colorTokenIds) internal view returns (string[] memory){
		string[] memory hexColors = new string[](3);
		hexColors[0] = "#222222"; // Defaults (grayscale)
		hexColors[1] = "#777777";
		hexColors[2] = "#AAAAAA";
		for (uint i=0; i<3; i++){
			hexColors[i] = TheColors(THE_COLORS).getHexColor(uint256(colorTokenIds[i]));	
		}
		return hexColors;
	}
	
    /**
    * Generates the SVG
    */
    function generateSVGImage(uint256 tokenId, uint16[] memory colorTokenIds, SyncTraitsStruct memory syncTraits) internal view returns (string memory) {
		
        string[] memory hexColors = getHexStrings(colorTokenIds);

        bytes memory svgBG = generateSVGBG(hexColors,syncTraits);
        bytes memory svgPartA = generateSVGPartA(hexColors);
        bytes memory svgPartB = generateSVGPartB(hexColors);
		bytes memory svgPartC = generateSVGPartC(hexColors);
		bytes memory svgPartD = generateSVGPartD(hexColors);
        return string(
            abi.encodePacked(
              svgBG,
              svgPartA,
              svgPartB,
			  svgPartC,
			  svgPartD
            )
        );
    }
	function generateSVGBG(string[] memory hexColors,SyncTraitsStruct memory syncTraits) internal pure returns (bytes memory) {

        bytes memory svgBG;
        bytes memory newShape;
        if (syncTraits.rarity_index > 990){hexColors[1] = '#CD7F32';
                                           hexColors[2] = '#e5e4e2';
                                           hexColors[0] = '#CD7F32';
        }
        else if (syncTraits.rarity_index > 970){hexColors[1] = '#c0c0c0';
                                                hexColors[2] = '#e5e4e2';
                                                hexColors[0] = '#c0c0c0';
        }
        for (uint i =0; i<16; i++){
            if (syncTraits.shape_type[i] == 1){
                newShape = abi.encodePacked('<circle fill=',hexColors[syncTraits.shape_color[i]],
                                            'cx=',syncTraits.shape_x[i],
                                            'cy=',syncTraits.shape_y[i],
                                            'r=',syncTraits.shape_sizex[i],'/>');
            }
            else if (syncTraits.shape_type[i] == 2){
                newShape = abi.encodePacked('<rect fill=',hexColors[syncTraits.shape_color[i]],
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

    function generateSVGPartA(string[] memory hexColors) internal pure returns (bytes memory) {
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
			hexColors[0],";",
			hexColors[1],";",
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

    function generateSVGPartB(string[] memory hexColors) internal pure returns (bytes memory)
    {
	
        bytes memory bufferPath = abi.encodePacked(
            '<path id="infinity_2" stroke-dasharray="1000" stroke-dashoffset="1000" stroke-width="70" ',
			'd="M 75,250 C 75,350 200,350 250,250 S 425,150 425,250 S 300,350 250,250 S 75,150 75,250" ',
			'transform="translate(173 173) scale(0.3)" fill="none">',
			'<animate begin="s.end" attributeType="XML" attributeName="stroke"  values="',
			hexColors[2],";",
			hexColors[0],";",
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

   function generateSVGPartC(string[] memory hexColors) internal pure returns (bytes memory)
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
	
	function generateSVGPartD(string[] memory hexColors) internal pure returns (bytes memory)
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
    function generateTraits(uint256 tokenId) internal view returns (SyncTraitsStruct memory) {
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
            seed = seed >> 1;
        }
        

        return syncTraits;
    }

    function _rng(uint256 tokenId) internal view returns(uint256) {
        uint256 _tokenId = tokenId + 1;
        uint256 seed = uint256(uint160(THE_COLORS));
        return uint256(keccak256(abi.encodePacked(_tokenId.toString(), block.timestamp, block.difficulty))) +
                uint256(_tokenId * seed);
    }
}
