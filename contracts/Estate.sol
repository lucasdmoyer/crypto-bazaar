pragma solidity ^0.5.0;

contract Estate {

    uint256 count = 0;

    struct House {
        uint256 id;
        address payable owner;
        uint256 price;
    }
    House[16] public houses;
    address[16] public owners;
    mapping (address => uint) pendingWithdrawals;


    // add houses if you are the owner of the contract
    //1,0xA340E91B92A1B88690a2f9A3F049Cf647288aC1B,1000000
    function addHouse(uint256 price)
        public
        returns (uint256)
    {
        houses[count] = House(count, msg.sender, price);
        owners[count] = msg.sender;
        //idtoHouse[count] = houses[count]
        count += 1;
        return (count - 1);
    }

    // buy a house
    function buyHouse(uint256 estateID) public payable returns (uint256) {
        // check if house exists
        require(houses[estateID].price > 0, "House doesn't exist");
        // check if sender has enough ether
        require(msg.value >= houses[estateID].price, "Not enough money sent.");
        //houses[estateID].owner.transfer(houses[estateID].price);
        pendingWithdrawals[houses[estateID].owner] += msg.value;
        owners[estateID] = msg.sender;
        houses[estateID].owner = msg.sender;

        return estateID;
    }
    
    function withdraw() public {
        uint amount = pendingWithdrawals[msg.sender];
        // Remember to zero the pending refund before
        // sending to prevent re-entrancy attacks
        pendingWithdrawals[msg.sender] = 0;
        msg.sender.transfer(amount);
    }
    
    function getBalance(address _address) public view returns (uint256) {
        return(pendingWithdrawals[_address]);
    }

    // Retrieving the adopters
    function getOwners() public view returns (address[16] memory) {
        return owners;
    }

    function getHouse(uint256 estateID)
        public
        view
        returns (
            uint256,
            address payable,
            uint256
        )
    {
        House storage house = houses[estateID];
        return (house.id, house.owner, house.price);
    }
}
