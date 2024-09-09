import _ from "@nomiclabs/hardhat-ethers";
import { ethers } from "hardhat";

async function deploy() {
  const HelloWorld = await ethers.getContractFactory("HelloWorld");
  const hello = await HelloWorld.deploy();
  await hello.waitForDeployment();

  return hello;
}
//@ts-ignore
async function sayHello(hello) {
      console.log("Say Hello:",await hello.hello());
}

deploy().then(sayHello);
