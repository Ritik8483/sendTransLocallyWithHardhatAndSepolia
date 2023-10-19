import "./App.css";
import Home from "./frontend/components/Home";

function App() {
  return (
    <div className="App">
      <Home />
    </div>
  );
}

export default App;

//Make 2 folders namely frontend and backend
//cd src/backend
//npx hardhat init and install dependencies suggested by hardhat
//Paste hardhat config outside the main src folder
//Inside backend folder
//npm i @nomiclabs/hardhat-waffle
//npx hardhat node(Inside backend)
//Account 10,Account 11 are made up 
// (Only in main folder)
//npm i ethers@5.7.2 @metamask/detect-provider hardhat @nomiclabs/hardhat-waffle @nomiclabs/hardhat-ethers
//  npx hardhat run src/backend/scripts/deploy.js --network localhost (inside main send_trans_locally)

//To view transactions locally on blockchain use hardhat-ethernal(outside)
// https://app.tryethernal.com/transactions
// http://127.0.0.1:8545/,31337,GO

//To store data on bl we need a ens server which is not available locally so
//To deploy with sepolia use 
// npx hardhat run src/backend/scripts/deploy.js --network sepolia 
