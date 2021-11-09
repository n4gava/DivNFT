// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

interface IERC20Token {
  function transfer(address, uint256) external returns (bool);
  function approve(address, uint256) external returns (bool);
  function transferFrom(address, address, uint256) external returns (bool);
  function totalSupply() external view returns (uint256);
  function balanceOf(address) external view returns (uint256);
  function allowance(address, address) external view returns (uint256);

  event Transfer(address indexed from, address indexed to, uint256 value);
  event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract DivNFT is ERC721URIStorage {
    address internal cUsdTokenAddress = 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;

    struct DivNFTData {
        string uri;
        uint256 tokenId;
        address payable owner;
        uint price;
        string content;
        string destinationUrl;
    }

    // counter for auto increment minteds nfts
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // created uris
    mapping(string => uint256) _uris;
    // NFT data storage
    mapping(uint256 => DivNFTData) _nftData;

    constructor() ERC721("Div NFT", "DIVNFT") {}

    /**
     * Mint a new NFT for the URL and div id.
     * Returns the NFT token id
     */
    function mint(string memory uri, uint price) public returns (DivNFTData memory) {
        require(!uriExists(uri), "Div ID already exists");

        _tokenIds.increment();
        uint256 _tokenId = _tokenIds.current();
        _safeMint(msg.sender, _tokenId);
        _setTokenURI(_tokenId, uri);
        _uris[uri] = _tokenId;
        _nftData[_tokenId] = DivNFTData({uri: uri, owner: payable(msg.sender), tokenId: _tokenId, price: price, content: "", destinationUrl: ""});
        return _nftData[_tokenId];
    }

    /**
     * Buy the NFT by it ID
     */
    function buyNFT(uint256 tokenId) public payable tokenIdExists(tokenId) {
        DivNFTData memory _tokenData = getTokenDataByTokenId(tokenId);
        require(_tokenData.price > 0, "Token is not for sale");
        require(
          IERC20Token(cUsdTokenAddress).transferFrom(
            msg.sender,
            _tokenData.owner,
            _tokenData.price
          ),
          "Transfer failed."
        );
        
        _transfer(_tokenData.owner, msg.sender, tokenId);
        _tokenData.price = 0;
        _tokenData.owner = payable(msg.sender);
        _nftData[tokenId] = _tokenData; 
    }

    /**
    * Update the NFT price
    */
    function updatePrice(uint256 tokenId, uint price) public tokenIdExists(tokenId) onlyOwner(tokenId) {
        DivNFTData memory _tokenData = getTokenDataByTokenId(tokenId);
        _tokenData.price = price;
        _nftData[tokenId] = _tokenData; 
    }
    
    /**
     * Returns the last minted tokenId
     */
    function getLastTokenId() public view returns (uint256) {
        return _tokenIds.current();
    }

    /**
     * Change the NFT's content by uri
     */
    function changeContentByUri(string memory uri, string memory content, string memory destination) public returns (DivNFTData memory) {
        uint256 _tokenId = getTokenByUri(uri);
        return changeContentByTokenId(_tokenId, content, destination);
    }

    /**
     * Change the NFT's content by tokenId
     */
    function changeContentByTokenId(uint256 tokenId, string memory content, string memory destination) public tokenIdExists(tokenId) onlyOwner(tokenId) returns (DivNFTData memory) {
        DivNFTData memory _data = getTokenDataByTokenId(tokenId);
        _data.content = content;
        _data.destinationUrl = destination;
        _nftData[tokenId] = _data;
        return _data;
    }
    
    /**
     * Update the price and change de content
     */
    function changeContentAndPriceByTokenId(uint256 tokenId, uint256 price, string memory content, string memory destination) public tokenIdExists(tokenId) onlyOwner(tokenId) returns (DivNFTData memory) {
        updatePrice(tokenId, price);
        return changeContentByTokenId(tokenId, content, destination);
    }

    /**
     * Return NFT Data by uri
     */
    function getTokenDataByUri(string memory uri) public view returns (DivNFTData memory) {
        uint256 _tokenId = getTokenByUri(uri);
        return getTokenDataByTokenId(_tokenId);
    }

    /**
     * Return NFT Data by tokenId
     */
    function getTokenDataByTokenId(uint256 tokenId) public view returns (DivNFTData memory) {
        return _nftData[tokenId];
    }

    /**
     * Verify if uri exists.
     */
    function uriExists(string memory uri) private view returns (bool) {
        return getTokenByUri(uri) > 0;
    }
    
    /**
     * Return the token id by uri
     */
    function getTokenByUri(string memory uri) private view returns (uint256) {
        return _uris[uri];
    }

    
    /**
     * Modifier for validate if token id exists
     */
    modifier tokenIdExists(uint256 tokenId) {
        require(tokenId > 0 && bytes(tokenURI(tokenId)).length > 0, "Token does not exist");
        _;
    }
    
    /**
     * Modifier for validating if the method is called from it token owner
     */
    modifier onlyOwner(uint256 tokenId) {
        address owner = ERC721.ownerOf(tokenId);
        require(msg.sender == owner, "Only the owner can change the NFT data");
        _;
    }
}