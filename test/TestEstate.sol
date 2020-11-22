pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Estate.sol";

contract TestEstate {
    // Truffle will send the TestContract one Ether after deploying the contract.
    uint public initialBalance = 1 ether;

    // The address of the adoption contract to be tested
    Estate estate = Estate(DeployedAddresses.Estate());

    // The id of the pet that will be used for testing
    uint256 expectedEstateId = 1;
    uint256 expectedPrice = 24;

    //The expected owner of adopted pet is this contract
    address expectedAdopter = address(this);

    // Testing the adopt() function
    // Testing the adopt() function
    // function testUserCanAddHouse() public {
    //     uint256 returnedId = estate.addHouse(expectedPrice);

    //     Assert.equal(
    //         returnedId,
    //         expectedEstateId,
    //         "real Estate ID should match"
    //     );
    // }

    // function testUserCanBuyHouse() public payable {
    //     uint256 returnedId = estate.transfer(expectedEstateId);

    //     Assert.equal(
    //         estate.owners(expectedEstateId),
    //         expectedAdopter,
    //         "real Estate owners should match"
    //     );
    // }
}
