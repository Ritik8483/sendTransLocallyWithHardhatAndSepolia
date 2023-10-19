import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
// import { contractABI, contractAddress } from "../utils/constants";
import detectEthereumProvider from "@metamask/detect-provider";
import contractAddress from "../contractsData/SendEther-address.json";
import contractABI from "../contractsData/SendEther.json";

const Home = () => {
  const { ethereum } = window;
  console.log("ethereum", ethereum);

  const walletOwner = JSON.parse(
    localStorage.getItem("smartContractAccount") || "{}"
  );

  const [accountAddress, setAccountAddress] = useState(walletOwner || "");
  const [transactionHash, setTransactionHash] = useState("");
  const [transactionsArr, setTransactionsArr] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValues, setInputValues] = useState({
    amount: "",
    keyword: "",
    addressTo: "",
    message: "",
  });
  // const [account, setAccount] = useState<string>();
  // const { sdk, connected, connecting, provider, chainId } = useSDK();

  // const connect = async () => {
  //   try {
  //     const accounts = await sdk?.connect();
  //     setAccount(accounts?.[0]);
  //   } catch (err) {
  //     console.warn(`failed to connect..`, err);
  //   }
  // };

  const getEthProvider = async () => {
    const provider = await detectEthereumProvider();
    console.log("provider", provider);
    if (provider) {
      const chainId = await ethereum.request({ method: "eth_chainId" });
      console.log("chainId", chainId);
    } else {
      console.log("Please install MetaMask!");
    }
  };

  useEffect(() => {
    getEthProvider();
  }, []);

  const handleChangeInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputValues((lastValues) => {
      return {
        ...lastValues,
        [name]: value,
      };
    });
  };

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      localStorage.setItem("smartContractAccount", JSON.stringify(accounts[0]));
      setAccountAddress(accounts[0]);
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object");
    }
  };

  const createEthereumContract = async () => {
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    console.log("contractAddress",contractAddress);
    console.log("contractABI.abi",contractABI.abi);
    const transactionsContract = new ethers.Contract(
      contractAddress.address,
      contractABI.abi,
      signer
    );

    console.log("transactionsContract", transactionsContract);
    return transactionsContract;
  };

  const sendTransaction = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (ethereum) {
        const transactionsContract = await createEthereumContract();
        const parsedAmount = ethers.utils.parseEther(inputValues.amount);
        console.log("ALLDATA : ", {
          from: accountAddress,
          to: inputValues.addressTo,
          gas: "0x5208", //2100 GWEI
          value: parsedAmount._hex,
        });
        const resp = await ethereum.request({
          method: "eth_sendTransaction", //used to send from ETH one acc to another data on bc
          params: [
            {
              from: accountAddress,
              to: inputValues.addressTo,
              gas: "0x5208", //2100 GWEI
              value: parsedAmount._hex,
            },
          ],
        });

        const transactionHash = await transactionsContract?.addToBlockChain(
          //used to add data on bc
          inputValues.addressTo,
          parsedAmount,
          inputValues.message,
          inputValues.keyword
        );
        console.log("transactionHash",transactionHash);
        const response = await transactionHash.wait();
        console.log("response",response);

        setTransactionHash(response?.blockHash);
        if (response?.blockHash) {
          setInputValues({
            amount: "",
            keyword: "",
            addressTo: "",
            message: "",
          });
          setLoading(false);
        }
      } else {
        console.log("No ethereum object");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllTheTransactions = async () => {
    try {
      if (ethereum) {
        const transactionsContract = await createEthereumContract();
        console.log("transactionsContract", transactionsContract);
        const availableTransactions =
          await transactionsContract.getAllTransactions();
        // const availableTransactions =
        // await transactionsContract.transactions();
        console.log("availableTransactions", availableTransactions);
        const structuredTransactions = availableTransactions?.map(
          (transaction) => {
            console.log("transaction", transaction);

            return {
              addressTo: transaction.receiver,
              addressFrom: transaction.sender,
              timestamp: new Date(
                transaction.timestamp.toNumber() * 1000
              ).toLocaleString(),
              message: transaction.message,
              keyword: transaction.keyword,
              amount: parseInt(transaction.amount._hex) / 10 ** 18,
            };
          }
        );
        setTransactionsArr(structuredTransactions);
      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfWalletIsConnect = async () => {
    //it is used to switch wallet from one to another
    try {
      if (!ethereum) return alert("Please install MetaMask.");
      const accounts = await ethereum.request({ method: "eth_accounts" });
      ethereum.on("chainChanged", (chainId) => {
        window.location.reload();
      });
      ethereum.on("accountsChanged", async function (accounts) {
        console.log("acc", accounts);
        setAccountAddress(accounts[0]);
        localStorage.setItem(
          "smartContractAccount",
          JSON.stringify(accounts[0])
        );
      });
      console.log("accounts", accounts);

      if (accounts.length) {
        getAllTheTransactions();
      } else {
        console.log("No accounts found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfTransactionsExists = async () => {
    try {
      if (ethereum) {
        const transactionsContract = await createEthereumContract();
        console.log("transactionsContract", transactionsContract);
        const currentTransactionCount =
          await transactionsContract.transactionCount();
        console.log("currentTransactionCount", currentTransactionCount);
        const hexValue = currentTransactionCount?._hex;
        const regularNumber = parseInt(hexValue, 16);
        console.log(regularNumber);
      }
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };
  console.log(accountAddress.length > 0);

  useEffect(() => {
    console.log("transactionHash", transactionHash);

    if (accountAddress.length > 0) {
      console.log("called", transactionHash);
      checkIfTransactionsExists();
    }
  }, [transactionHash]);

  useEffect(() => {
    checkIfWalletIsConnect();
  }, []);

  const disConnectWallet = () => {
    localStorage.setItem("smartContractAccount", JSON.stringify(""));
    setAccountAddress("");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        gap: "20px",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* <button style={{ padding: 10, margin: 10 }} onClick={connect}>
        Connect
      </button>
      {connected && (
        <div>
          <>
            {chainId && `Connected chain: ${chainId}`}
            <p></p>
            {account && `Connected account: ${account}`}
          </>
        </div>
      )} */}
      {accountAddress.length > 0 ? (
        <button onClick={disConnectWallet}>Disconnect Wallet</button>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}

      {accountAddress.length > 0 && (
        <form
          style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          onSubmit={sendTransaction}
        >
          <h3>
            Account Address : {accountAddress.length > 0 ? accountAddress : ""}
          </h3>
          <input
            type="number"
            placeholder="Enter amount"
            onChange={handleChangeInput}
            name="amount"
            value={inputValues.amount}
          />
          <input
            type="text"
            placeholder="Enter keyword"
            onChange={handleChangeInput}
            name="keyword"
            value={inputValues.keyword}
          />
          <input
            type="text"
            placeholder="Enter reciever address"
            onChange={handleChangeInput}
            name="addressTo"
            value={inputValues.addressTo}
          />
          <input
            type="text"
            placeholder="Enter message"
            onChange={handleChangeInput}
            name="message"
            value={inputValues.message}
          />
          <button disabled={loading} type="submit">
            {loading ? "Sending..." : "Send Transaction"}
          </button>
        </form>
      )}
      {transactionsArr?.length && (
        <h5>Total Transactions : {transactionsArr.length}</h5>
      )}
      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          // justifyContent: "center",
          // alignItems: "center",
        }}
      >
        {transactionsArr?.length &&
          transactionsArr?.map((item) => {
            return (
              <>
                <div style={{ border: "1px solid black" }}>
                  <p>Sender Address : {item.addressFrom}</p>
                  <p>Receiver Address : {item.addressTo}</p>
                  <p>Amount : {item.amount}</p>
                  <p>Message : {item.message}</p>
                  <p>Keyword : {item.keyword}</p>
                  <p>Timestamp : {item.timestamp}</p>
                </div>
              </>
            );
          })}
      </div>
    </div>
  );
};

export default Home;
