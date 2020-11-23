App = {
  web3Provider: null,
  contracts: {},

  init: async function () {
    // Load pets.
    $.getJSON('../estates.json', function (data) {
      var estatesRow = $('#estatesRow');
      var estatesTemplate = $('#estatesTemplate');

      for (i = 0; i < data.length; i++) {
        estatesTemplate.find('.panel-title').text(data[i].name);
        estatesTemplate.find('img').attr('src', data[i].picture);
        estatesTemplate.find('.price').text(data[i].price);
        estatesTemplate.find('.description').text(data[i].description);
        estatesTemplate.find('.location').text(data[i].location);
        estatesTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        estatesRow.append(estatesTemplate.html());
      }
    });

    return await App.initWeb3();
  },

  initWeb3: async function () {
    // Modern dapp browsers...
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.eth_requestAccounts();
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function () {
    $.getJSON('Estate.json', function (data) {
      // Get the necessary contract artifact file and instantiate it with @truffle/contract
      var EstateArtifact = data;
      App.contracts.Estate = TruffleContract(EstateArtifact);

      // Set the provider for our contract
      App.contracts.Estate.setProvider(App.web3Provider);

      //App.addHouse(25);
      //App.getHouses();

      // Use our contract to retrieve and mark the adopted pets
      return App.markAdopted();
    });

    return App.bindEvents();
  },

  bindEvents: function () {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
    $(document).on('click', '.btn-addHouse', App.addHouse);
    $(document).on('click', '.btn-getHouse', App.getHouses);
  },

  getHouses: function () {
    console.log("get houses called")
    var estateInstance;

    App.contracts.Estate.deployed().then(function (instance) {
      estateInstance = instance;
      console.log(estateInstance);

      return estateInstance.getOwners.call();
    }).then(function (houses) {
      console.log(houses)
    }).catch(function (err) {
      console.log(err.message);
    });
  },
  addHouse: async function () {
    console.log("add houses called")
    let estateInstance = await App.contracts.Estate.deployed();


    console.log(estateInstance);
    owner = web3.eth.accounts[0];

    console.log(owner);
    estateInstance.addHouse(24, { from: owner, gas: 3000000 });

  },

  // getHouses: async function () {
  //   console.log("get houses called")
  //   let estateInstance = await App.contracts.Estate.deployed();

  //   // App.contracts.Estate.deployed().then(function (instance) {
  //   //   estateInstance = instance;
  //   console.log(estateInstance);
  //   let house =null;
  //   house = await estateInstance.getHouse(0);
  //   // houses = [];
  //   // for (i = 0; i < 16; i++) {
  //   //   console.log(i);
  //   //   house = await estateInstance.getHouse(i);
  //   //   console.log(house);
  //   // }
  //   console.log(house);

  //   //   return estateInstance.getHouse.call(0);
  //   // }).then(function (houses) {
  //   //   console.log(houses)
  //   //   return houses;
  //   // }).catch(function (err) {
  //   //   console.log(err.message);
  //   // });
  // },

  markAdopted: function () {
    var estateInstance;

    App.contracts.Estate.deployed().then(function (instance) {
      estateInstance = instance;

      return estateInstance.getOwners.call();
    }).then(function (adopters) {
      //console.log(adopters);
      for (i = 0; i < adopters.length; i++) {
        if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
          $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
        }
      }
    }).catch(function (err) {
      console.log(err.message);
    });
  },

  handleAdopt: function (event) {
    event.preventDefault();

    var estateId = parseInt($(event.target).data('id'));
    
    var estateInstance;

    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Estate.deployed().then(function (instance) {
        estateInstance = instance;

        // Execute adopt as a transaction by sending account
        return estateInstance.buyHouse(estateId, { from: account, to:accounts[2], value: 24,gas: 3000000 });
      }).then(function (result) {
        return App.markAdopted();
      }).catch(function (err) {
        console.log(err.message);
      });
    });
  }

};

$(function () {
  $(window).load(function () {
    App.init();
  });
});
