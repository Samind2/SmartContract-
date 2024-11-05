const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Transactions", function () {
  let transactions;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    const Transactions = await ethers.getContractFactory("Transactions");
    transactions = await Transactions.deploy();
    await transactions.deployed();

    [owner, addr1, addr2] = await ethers.getSigners();
  });

  describe("addToBlockchain", function () {
    it("Should add a transaction and emit a Transfer event", async function () {
      const amount = ethers.utils.parseEther("1.0");
      const message = "Hello!";
      const keyword = "Greeting";

      const tx = await transactions.addToBlockchain(addr1.address, amount, message, keyword, { value: amount });
      const receipt = await tx.wait();

      const blockTimestamp = (await ethers.provider.getBlock(receipt.blockNumber)).timestamp;

      await expect(tx)
        .to.emit(transactions, "Transfer")
        .withArgs(owner.address, addr1.address, amount, message, blockTimestamp, keyword);

      const transactionCount = await transactions.getTransactionCount();
      expect(transactionCount).to.equal(1);

      const allTransactions = await transactions.getAllTransactions();
      expect(allTransactions[0].amount).to.equal(amount);
      expect(allTransactions[0].message).to.equal(message);
      expect(allTransactions[0].keyword).to.equal(keyword);
    });
  });

  describe("requestRefund", function () {
    it("Should allow the sender to request a refund", async function () {
      const amount = ethers.utils.parseEther("1.0");
      const message = "Refund Test";
      const keyword = "Test";

      await transactions.addToBlockchain(addr1.address, amount, message, keyword);
      
      // Ensure the transaction exists before requesting a refund
      const transactionCount = await transactions.getTransactionCount();
      expect(transactionCount).to.equal(1);

      // Now request a refund
      await expect(transactions.requestRefund(0))
        .to.emit(transactions, "Transfer")
        .withArgs(addr1.address, owner.address, amount, "Refund", await ethers.provider.getBlock("latest").timestamp, "Refund");

      const refundStatus = await transactions.refundStatus(0);
      expect(refundStatus).to.be.true;
    });

    it("Should revert if the refund is already processed", async function () {
      const amount = ethers.utils.parseEther("1.0");
      const message = "Refund Test";
      const keyword = "Test";

      await transactions.addToBlockchain(addr1.address, amount, message, keyword);
      await transactions.requestRefund(0);

      await expect(transactions.requestRefund(0)).to.be.revertedWith("Refund already processed.");
    });

    it("Should revert if the transaction does not exist", async function () {
      await expect(transactions.requestRefund(0)).to.be.revertedWith("Transaction does not exist.");
    });

    it("Should revert if the sender is not the original sender", async function () {
      const amount = ethers.utils.parseEther("1.0");
      const message = "Refund Test";
      const keyword = "Test";

      await transactions.addToBlockchain(addr1.address, amount, message, keyword, { value: amount });

      await expect(transactions.connect(addr2).requestRefund(0)).to.be.revertedWith("Only the sender can request a refund.");
    });
  });
});