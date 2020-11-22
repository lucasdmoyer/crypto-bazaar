const Estate = artifacts.require("Estate");

contract("Estates", (accounts) => {
    let estate;
    let expectedEstateId = 0;
    let expectedOwner;
    before(async () => {
        estate = await Estate.deployed();
    });

    describe("Adding a house and retrieving account addresses", async () => {
        before("adopt a pet using accounts[0]", async () => {
            await estate.addHouse(24, accounts[expectedEstateId]);
            await estate.addHouse(50, accounts[expectedEstateId]);
            expectedOwner = accounts[expectedEstateId];
        });

        it("can fetch the address of an owner by pet id", async () => {
            const owners = await estate.getOwners();
            console.log(owners);
            console.log(owners[expectedEstateId]);
            console.log(expectedOwner);
            // we already add a house, so this index is the second of owners
            assert.equal(owners[expectedEstateId], expectedOwner, "The owner of the adopted pet should be the first account.");
        });

        it("can buy a house", async () => {
            let newOwner = accounts[0];
            estate.transfer(expectedEstateId, {value: 24});
            const owners = await estate.getOwners();
            assert.equal(owners[expectedEstateId], newOwner, "Ownership of first house should have changed");
        });
        
    });
});