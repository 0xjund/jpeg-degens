
import { ethers } from "ethers";
import Counter from "../artifacts/contracts/Counter.sol/Counter.json";

// Extend the Window interface to include ethereum
interface EthereumWindow extends Window {
  ethereum: any;
}

declare let window: EthereumWindow;

async function hasSigners(): Promise<boolean> {
  const metamask = window.ethereum;
  const signers = await (metamask.request({ method: 'eth_accounts' }) as Promise<string[]>);
  return signers.length > 0;
}

async function requestAccess(): Promise<boolean> {
  const result = (await window.ethereum.request({ method: 'eth_requestAccounts' })) as string[];
  return result && result.length > 0;
}

async function getContract() {
  const address = process.env.CONTRACT_ADDRESS;

  if (!address) {
    console.error("Contract address is not defined in environment variables.");
    return;
  }

  if (!(await hasSigners()) && !(await requestAccess())) {
    console.log("You are in trouble, no one wants to play");
    return;
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  const contract = new ethers.Contract(
    address,
    Counter.abi,
    signer
  );

  console.log("We have done it, time to call");
  console.log(await contract.getCounter()); // Assuming getCounter() is the correct function to call
  return contract;
}

const el = document.createElement("div");
async function setCounter(counter: any, count?: any) {
  el.innerHTML = count || await counter.getCounter();
}

async function main() {
  const counter = await getContract();
  if (!counter) return;

  await setCounter(counter);

  const button = document.createElement("button");
  button.innerText = "increment";
  button.onclick = async function () {
    await counter.count();
  };

  counter.on(counter.filters.CounterInc(), function(count: any) {
    setCounter(counter, count);
  });

  document.body.appendChild(el);
  document.body.appendChild(button);
}

main();

