pragma solidity ^0.5.0;

contract Estate {
    uint256 public count = 0;

    struct House {
        address payable owner;
        uint256 price;
        string desc;
        string location;
    }
    House[16] public houses;
    address[16] public owners;
    mapping(address => uint256) pendingWithdrawals;

    event HouseAdded(address owner, uint256 price);

    // add houses if you are the owner of the contract
    //1,0xA340E91B92A1B88690a2f9A3F049Cf647288aC1B,1000000
    function addHouse(uint256 price, string memory desc, string memory location) public returns (address payable) {
        houses[count] = House(msg.sender, price, desc, location);
        owners[count] = msg.sender;
        //idtoHouse[count] = houses[count]
        count += 1;
        emit HouseAdded(msg.sender, price);
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
        owners[estateID] = msg.sender;
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

    // Retrieving the adopters
    function getOwners() public view returns (address[16] memory) {
        return owners;
    }

    function getHouse(uint index) public view returns(address , uint256, string memory, string memory) {
        return (houses[index].owner,houses[index].price, houses[index].desc, houses[index].location);
    }

    function getHouseCount() public view returns (uint256) {
        return houses.length;
    }

    // function getHouse(uint256 estateID)
    //     public
    //     view
    //     returns (
    //         uint256,
    //         address payable,
    //         uint256
    //     )
    // {
    //     House storage house = houses[estateID];
    //     return (house.id, house.owner, house.price);
    // }
}
