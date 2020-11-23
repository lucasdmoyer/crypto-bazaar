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
            await estate.addHouse(24, accounts[2]);
            //await estate.addHouse(50, accounts[2]);
            expectedOwner = accounts[2];
        });

        it("can fetch the address of an owner by pet id", async () => {
            const owners = await estate.getOwners();
            // console.log(owners);
            // console.log(owners[expectedEstateId]);
            // console.log(expectedOwner);
            // checking if the first house has ownership
            assert.equal(owners[expectedEstateId], expectedOwner, "The owner of the house should be the third account.");
        });

        // transfer ownership from 2 to 0
        it("can buy a house", async () => {
            const owners = await estate.getOwners();
            //console.log(owners[expectedEstateId]);
            estate.buyHouse(expectedEstateId, { from: accounts[0], to: accounts[2], value: 24,gas: 3000000 });

            //console.log(owners);
            //console.log(owners[expectedEstateId]);
            assert.equal(owners[expectedEstateId], accounts[0], "Ownership of first house should have changed");
        });

    });
});