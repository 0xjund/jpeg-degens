import { ethers } from "hardhat"; 
import { expect } from "chai"; 

describe("Hero", function () {
  async function createHero() {
    const Hero = await ethers.getContractFactory("TestHero");
    const hero = await Hero.deploy(); 
    await hero.deployed(); 

    return hero;
  }

  let hero: any;

  before(async function () {
    hero = await createHero();
  });

  it("should get a zero hero array.", async function () {
    expect(await hero.getHeroes()).to.deep.equal([]);
  });

  it("should fail at creating hero because of payment", async function () {
    let e: any;

    try {
      await hero.createHero(0, {
        value: ethers.parseEther("0.4999"),       });
    } catch (err) {
      e = err;
    }

    expect(e.message.includes("Please send more money")).to.equal(true);

    await hero.setRandom(69);
    const h = await hero.createHero(0);
    expect(await hero.getMagic(h[0])).to.equal(16);   
  });
});

