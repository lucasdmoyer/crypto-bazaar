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
            await estate.addHouse(24,accounts[2]);
            expectedOwner = accounts[2];
        });

        it("can fetch the address of an owner by estate id", async () => {
            const owners = await estate.getOwners();
            assert.equal(owners[expectedEstateId], expectedOwner, "The owner of the house should be the third account.");
        });

        // transfer ownership from 2 to 0
        it("can buy a house", async () => {
            estate.buyHouse(expectedEstateId, { from: accounts[0], to:accounts[2], value: 24,gas: 3000000 });
            const owners = await estate.getOwners();
            assert.equal(owners[expectedEstateId], accounts[0], "Ownership of first house should have changed");
        });

    });
});