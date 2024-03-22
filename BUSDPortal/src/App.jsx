import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useEffect, useState } from "react";
import { useAccount, useAccountEffect } from "wagmi";
import { formatEther, parseEther } from "viem/utils";
// import { ethers } from "ethers"
// import { readContract } from '@wagmi/core'
import { readContract, waitForTransactionReceipt } from "wagmi/actions";
import { writeContract, getAccount, connect, getBalance } from '@wagmi/core'
import { injected } from '@wagmi/connectors'
import "./App.css";
import { abi } from "./constants/abi";
import { erc20abi } from "./constants/erc20ABI";
import { config } from './config'

function App() {
  const { chain, address, isConnected } = useAccount();

  const [walletConnected, setWalletConnected] = useState(false);
  const [amount, setAmount] = useState("");
  const [receiver, setReceiver] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  // const [conn, setConn] = useState();

  const BUSDAddress = '0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee';
  const BUSDHandler = '0xCd333d7d027BbC51dcdE3EeB7361F8E02cf699E7';

  const { connector } = getAccount(config)

  // try {
  // useAccountEffect({
  //   onConnect(data) {
  //     console.log('Connected!', data);
  //     setWalletConnected(true);
  //   },
  //   onDisconnect() {
  //     console.log('Disconnected!');
  //     setWalletConnected(false);
  //   },
  // })
  // } catch (error) {
  //   console.error(error);
  // }

  const conn = async () => {
    await connect(config, {
      connector: injected(),
    })
  }

  const checkAllowance = async () => {
    try {
      console.log("Address: ", address);
      console.log("Connector: ", connector);
      const balance = await getBalance(config, {
        address: address,
      })
      console.log("balance: ", balance);
      const allowance = await readContract(config, {
        abi: erc20abi,
        address: BUSDAddress,
        functionName: 'allowance',
        args: [address, BUSDHandler],
      });
      console.log("Allowance: ", allowance);
      if (amount > allowance) {
        console.log("Approving...");
        setLoading(true);
        const hash = await writeContract(config, {
          address: BUSDAddress,
          abi: erc20abi,
          functionName: "approve",
          args: [BUSDHandler, amount],
          connector
        });
        console.log("Approval hash: ", hash);
        await waitForTransactionReceipt(config, { hash });
        setLoading(false);
      }
      return true;
    } catch (error) {
      console.error(error);
      window.alert(error);
      setLoading(false);
      return false;
    }
  }

  const sendBUSD = async () => {
    try {
      const result = await checkAllowance();
      console.log("amount: ", amount);
      console.log("receiver: ", receiver);
      if (result && amount && receiver) {
        setLoading(true);
        const hash = await writeContract(config, {
          address: BUSDHandler,
          abi: abi,
          functionName: 'sendBUSD',
          args: [amount, receiver],
        });

        console.log("sent!: ", hash);

        await waitForTransactionReceipt(config, { hash });

        window.alert(`${formatEther(amount)} BUSD successfully transferred to ${receiver}\nView the TX: https://testnet.bscscan.com/tx/${hash}`);

        setLoading(false);
      }

    } catch (error) {
      console.error(error);
      window.alert(error);
      setLoading(false);
    }
  }

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    console.log(walletConnected);
    console.log("Connector: ", connector);
    if (isConnected) {
      setWalletConnected(true);
      conn();
    }
  }, [isConnected]);

  if (!isMounted) return null;

  const renderConnect = () => {
    if (walletConnected) {
      return (
        <div>
          <w3m-button />
          <div >
            <br />
            <br />
            <strong> BUSD PORTAL</strong>
            <br />
            <br />
            <label>
              <input
                id="deposit"
                type="number"
                min="0.1"
                step="0.1"
                placeholder="Amount of BUSD"
                onChange={(e) => setAmount(parseEther(e.target.value || "0"))}
              // className={styles.input}
              />
              <br />
              <br />
              <input
                id="address"
                type="text"
                placeholder="Recipient Address"
                // required minLength="42"
                // maxLength="42"
                size="50"
                onChange={(e) => setReceiver(e.target.value || "0")}
              // className={styles.input}
              />
              <br />
              <br />
              <button
                disabled={loading || !amount || !receiver}
                onClick={sendBUSD}>
                {loading ? 'Confirming...' : 'Transfer'}
              </button>
            </label>

          </div>

        </div>

      )
    }

  };

  const renderOnDisconnect = async () => {
    return (
      <div>
        <w3m-button />
        {conn()}
        <br />
        <br />
        <strong> BUSD PORTAL</strong>
      </div>

    );
  }


  return (
    <div className="App">
      {walletConnected ?
        renderConnect()
        : renderOnDisconnect()}
      {/* <w3m-button /> */}
      {/* <button onClick={() => open({ view: "Networks" })}>Send</button> */}
      {/* <p>{chain?.name}</p> */}
    </div>
  );
}

export default App;
