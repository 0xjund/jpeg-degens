//SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

contract Hero {
    enum Class {Mage, Healer, Barbarian}
      
    mapping(address => uint[]) addressToHeroes;
      
    // Marking generateRandom as virtual to allow overriding
    function generateRandom() public view virtual returns (uint) {
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp)));
    }

    function getHeroes() public view returns (uint[] memory) {
        return addressToHeroes[msg.sender];  
    } 
    
    function getStrength(uint hero) public view returns (uint) {
        return (hero >> 2) & 0x1F; 
    }

    function createHero(Class class) public payable {
        require(msg.value >= 0.05 ether, "Please send more money");

        uint[] memory stats = new uint[](5); 
        stats[0] = 2; 
        stats[1] = 7; 
        stats[2] = 12;
        stats[3] = 17;
        stats[4] = 22;

        uint len = 5;
        uint hero = uint(class);

        do {
            uint pos = generateRandom() & len;
            uint value = generateRandom() % (13 + len) + 1;

            hero |= value << stats[pos];

            len--;
            stats[pos] = stats[len]; 
        } while (len > 0);
        
        addressToHeroes[msg.sender].push(hero);
    }
}

