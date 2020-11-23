App = {
  web3Provider: null,
  contracts: {},

  init: async function () {
    // Load pets.
    // $.getJSON('../estates.json', function (data) {
    //   var estatesRow = $('#estatesRow');
    //   var estatesTemplate = $('#estatesTemplate');

    //   for (i = 0; i < data.length; i++) {
    //     estatesTemplate.find('.panel-title').text(data[i].name);
    //     estatesTemplate.find('img').attr('src', data[i].picture);
    //     estatesTemplate.find('.price').text(data[i].price);
    //     estatesTemplate.find('.description').text(data[i].description);
    //     estatesTemplate.find('.location').text(data[i].location);
    //     estatesTemplate.find('.btn-adopt').attr('data-id', data[i].id);

    //     estatesRow.append(estatesTemplate.html());
    //   }
    // });

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
      App.getHouses();
      // Use our contract to retrieve and mark the adopted pets
    });

    return App.bindEvents();
  },

  bindEvents: function () {
    $(document).on('click', '.btn-adopt', App.buyHouse);
    $(document).on('click', '.btn-addHouse', App.addHouse);
    $(document).on('click', '.btn-getHouse', App.getHouses);
    $(document).on('click', '.btn-withdraw', App.withdraw);
  },

  addHouse: async function () {
    console.log("add houses called")
    let estateInstance = await App.contracts.Estate.deployed();
    owner = web3.eth.accounts[0];

    await estateInstance.addHouse($("#price").val(), $("#description").val(), $("#location").val(), $("#imgUrl").val(), { from: owner, gas: 3000000 });
    alert("House added!");
    $("#price").val("");
    $("#description").val("");
    $("#location").val("");
    $("#imgUrl").val("")
    App.getHouses();
    
  },

  withdraw: async function () {
    console.log("withdraw")
    let estateInstance = await App.contracts.Estate.deployed();
    owner = web3.eth.accounts[0];

    await estateInstance.withdraw({ from: owner, gas: 3000000 });
    alert("You withdrew your money!");
  },

  getHouses: async function () {
    let estateInstance = await App.contracts.Estate.deployed();

    data = [];
    for (i = 0; i < 16; i++) {
      house = await estateInstance.getHouse(i);
      if (house) {
        console.log(house);
        row = {
          price: house[1]['c'][0],
          owner: house[0],
          desc: house[2],
          loc: house[3],
          imgUrl: house[4]
        }
        data.push(row);
      }
    }
    var num_houses = data.filter(function (elem) {
      return elem.price != 0;
    })

    var estatesRow = $('#estatesRow');
    estatesRow.empty();
    var estatesTemplate = $('#estatesTemplate');
    for (i = 0; i < num_houses.length; i++) {
      estatesTemplate.find('.panel-title').text(data[i].desc);
      estatesTemplate.find('img').attr('src', data[i].imgUrl);
      console.log("New image is");
      console.log(data[i].imgUrl);
      estatesTemplate.find('.owner').text(data[i].owner);
      estatesTemplate.find('.price').text(data[i].price);
      estatesTemplate.find('.location').text(data[i].loc);
      estatesTemplate.find('.btn-adopt').attr('data-id', i);
      estatesRow.append(estatesTemplate.html());
    }
    App.markBought();
  },

  markBought: async function () {
    owner = web3.eth.accounts[0];
    let estateInstance = await App.contracts.Estate.deployed();

    data = [];
    for (i = 0; i < 16; i++) {
      house = await estateInstance.getHouse(i);

      if (house) {
        row = {
          price: house[1]['c'][0],
          owner: house[0],
          desc: house[2],
          loc: house[3],
          imgUrl: house[4]
        }
        data.push(row);
      }
    }
    var num_houses = data.filter(function (elem) {
      return elem.price != 0;
    })

    for (i = 0; i < num_houses.length; i++) {
      if (owner == data[i].owner) {
        $('.panel-pet').eq(i).find('button').text('Owned').attr('disabled', true);
      }
    }
  },

  buyHouse: async function (event) {
    event.preventDefault();

    var estateId = parseInt($(event.target).data('id'));
    let estateInstance = await App.contracts.Estate.deployed();
    house = await estateInstance.getHouse(estateId);
    row = {
      price: house[1]['c'][0],
      owner: house[0],
      desc: house[2],
      loc: house[3],
    }
    owner = web3.eth.accounts[0];
    await estateInstance.buyHouse(estateId, { from: owner, to: row.owner, value: web3.toWei(row.price, "ether"), gas: 3000000 });
    alert("Congratulations on your purchase!");
    await App.getHouses();

  }

};

$(function () {
  $(window).load(function () {
    App.init();
  });
});
