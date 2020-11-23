pragma solidity ^0.5.0;

contract Estate {
    uint256 public count = 0;

    struct House {
        address payable owner;
        uint256 price;
        string desc;
        string location;
        string imgUrl;
    }
    House[100] public houses;
    mapping(address => uint256) pendingWithdrawals;



    // add houses if you are the owner of the contract
    //1,0xA340E91B92A1B88690a2f9A3F049Cf647288aC1B,1000000
    function addHouse(uint256 price, string memory desc, string memory location, string memory imgUrl) public returns (address payable) {
        houses[count] = House(msg.sender, price, desc, location, imgUrl);

        //idtoHouse[count] = houses[count]
        count += 1;
        return msg.sender;
    }

    // buy a house
    function buyHouse(uint256 estateID) public payable returns (uint256) {
        // check if house exists
        require(houses[estateID].price > 0, "House doesn't exist");
        // check if sender has enough ether
        require(msg.value >= houses[estateID].price, "Not enough money sent.");
        //houses[estateID].owner.transfer(houses[estateID].price);
        pendingWithdrawals[houses[estateID].owner] += msg.value;
        houses[estateID].owner = msg.sender;

        return estateID;
    }

    function withdraw() public {
        uint256 amount = pendingWithdrawals[msg.sender];
        // Remember to zero the pending refund before
        // sending to prevent re-entrancy attacks
        pendingWithdrawals[msg.sender] = 0;
        msg.sender.transfer(amount);
    }

    function getBalance(address _address) public view returns (uint256) {
        return (pendingWithdrawals[_address]);
    }
    function getHouse(uint index) public view returns(address , uint256, string memory, string memory, string memory) {
        return (houses[index].owner,houses[index].price, houses[index].desc, houses[index].location, houses[index].imgUrl);
    }

}
