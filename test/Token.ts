import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("Token", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployContract() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await hre.viem.getWalletClients();

    const token = await hre.viem.deployContract("Token");

    const publicClient = await hre.viem.getPublicClient();

    return {
      token,
      owner,
      otherAccount,
      publicClient,
    };
  }

  describe("Deployment", function () {
    it("Should set the right totalSupply", async function () {
      const { token } = await loadFixture(deployContract);
      expect(await token.read.totalSupply()).to.equal(
        BigInt(100 * 10 ** 18)
      );
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const { token, owner } = await loadFixture(deployContract);
      expect(await token.read.balanceOf([owner.account.address])).to.equal(
        BigInt(100 * 10 ** 18)
      );
    })
  });

  describe("Mint", function () {
    it("Should mint tokens to an account", async function () {
      const { token, otherAccount } = await loadFixture(deployContract);
      const mintAmount = BigInt(50 * 10 ** 18);
      await token.write.mint([otherAccount.account.address, mintAmount]);
      expect(await token.read.balanceOf([otherAccount.account.address])).to.equal(
        mintAmount,
      );
    })

    it("Should mint upto max supply", async function () {
      const { token } = await loadFixture(deployContract);
      const mintAmount = BigInt(900 * 10 ** 18);
      await token.write.mint([token.address, mintAmount]);
      expect(await token.read.totalSupply()).to.equal(
        BigInt(1000 * 10 ** 18)
      )
    })

    it("Should increase the balance of the account", async function () {
      const { token, owner } = await loadFixture(deployContract);
      const mintAmount = BigInt(50 * 10 ** 18);
      await token.write.mint([owner.account.address, mintAmount]);
      expect(await token.read.balanceOf([owner.account.address])).to.equal(
        BigInt(150 * 10 ** 18)
      );
    })

    it("Should increase the totalSupply", async function () {
      const { token } = await loadFixture(deployContract);
      const mintAmount = BigInt(50 * 10 ** 18);
      await token.write.mint([token.address, mintAmount]);
      expect(await token.read.totalSupply()).to.equal(
        BigInt(150 * 10 ** 18)
      );
    })

    it("Should fail if the sender is not the owner", async function () {
      const { token, otherAccount } = await loadFixture(deployContract);
      const mintAmount = BigInt(50 * 10 ** 18);
      const tokenAsOtherAccount = await hre.viem.getContractAt(
        "Token",
        token.address,
        { walletClient: otherAccount }
      )

      await expect(
        tokenAsOtherAccount.write
          .mint([otherAccount.account.address, mintAmount])
      ).to.be.rejectedWith("OwnableUnauthorizedAccount");
    })

    it("Should fail if the mint amount exceeds the totalSupply", async function () {
      const { token, owner } = await loadFixture(deployContract);
      const mintAmount = BigInt(901 * 10 ** 18);
      await expect(
        token.write
          .mint([owner.account.address, mintAmount])
      ).to.be.rejectedWith("Max supply exceeded");
    })
  });
});
