pragma solidity ^0.5.0;

contract Estate {
    uint256 count = 0;

    struct House {
        uint256 id;
      address payable owner;
      uint256 price;
    }
   House[100] public houses;
    address[16] public owners;

    // add houses if you are the owner of the contract
    //1,0xA340E91B92A1B88690a2f9A3F049Cf647288aC1B,1000000
    function addHouse(uint256 price) public returns (uint256){
        houses[count] = House(count, msg.sender, price);
        owners[count] = msg.sender;
        count += 1;
        return (count-1);
    }
    
    
    // buy a house
    function transfer(uint256 estateID) public payable returns (uint256) {
        // check if house exists
        require(houses[estateID].id != 0);
        // check if sender has enough ether
        require(msg.value  >= houses[estateID].price);
        owners[estateID] = msg.sender;                          
        houses[estateID].owner.transfer(houses[estateID].price);
        houses[estateID].owner = msg.sender;

        return estateID;
    }

    // Retrieving the adopters
    function getOwners() public view returns (address[16] memory) {
        return owners;
    }
}
