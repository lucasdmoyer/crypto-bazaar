pragma solidity ^0.5.0;

contract Estate {
    address payable  private owner;
    uint256 count = 1;
    constructor() public {
        owner = msg.sender; // 'msg.sender' is sender of current call, contract deployer for a constructor
    }
    
    
    address payable[] public owners;
    mapping (address => uint256) public balances;
    
    struct House {
        uint256 id;
      address payable owner;
      uint256 price;
    }
    House[100] public houses;
    
    // add houses if you are the owner of the contract
    //1,0xA340E91B92A1B88690a2f9A3F049Cf647288aC1B,1000000
    function addHouse(uint256 price) public returns (uint256){
        houses[count] = House(count, msg.sender, price);
        count += 1;
        return (count-1);
    }
    
    
    // buy a house
    function transfer(uint256 estateID) public payable returns (uint256) {
        // check if house exists
        require(houses[estateID].id != 0);
        // check if sender has enough ether
        require(msg.value  >= houses[estateID].price);
                                      
        houses[estateID].owner.transfer(houses[estateID].price);
        houses[estateID].owner = msg.sender;

        return estateID;
    }
    
    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }
    
    // gets balance of wei of an address
    // NOTE: 1 ether = 1000000000000000000 wei
}
