require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.0',
  networks: {
    sepolia: {
      url: 'https://eth-sepolia.g.alchemy.com/v2/Xm8pV3Ny9NKHrHSQEGJ8FCdPL8r9Wgnt',
      accounts: ['34e7fe56cb64ffa72536504c6dfc32aadafe3993bc6f16e6e90c2eda8120e962'],
    },
  },
};