require("@nomiclabs/hardhat-waffle");

module.exports = {
  //This line begins the export of the configuration object that will define the settings for your Hardhat environment.
  solidity: "0.8.9",
  paths: {
    artifacts: "./src/backend/artifacts", //artifacts will be placed in the ./src/backend/artifacts
    sources: "./src/backend/contracts",
    cache: "./src/backend/cache",
    tests: "./src/backend/test",
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      accounts: [
        "c526ee95bf44d8fc405a158bb884d9d1238d99f0612e9f33d006bb0789009aaa",
      ],
    },
  },
};

// require("@nomiclabs/hardhat-waffle");

// module.exports = {
//   //This line begins the export of the configuration object that will define the settings for your Hardhat environment.
//   solidity: "0.8.9",
//   paths: {
//     artifacts: "./src/backend/artifacts", //artifacts will be placed in the ./src/backend/artifacts
//     sources: "./src/backend/contracts",
//     cache: "./src/backend/cache",
//     tests: "./src/backend/test",
//   },
//   networks: {
//     sepolia: {
//       url: "https://eth-sepolia.g.alchemy.com/v2/JU8kvb1Dozaa46lCSzGS99uUcCRv46px",
//       accounts: [
//         "429e5438078f99c07fefb922b7c9b207b684f157f9e9c28f159dc210f58ec8f0",
//       ],
//     },
//   },
// };
