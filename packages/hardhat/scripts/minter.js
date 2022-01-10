const { ethers, waffle } = require('hardhat')
const { FlashbotsBundleProvider, FlashbotsBundleResolution } = require("@flashbots/ethers-provider-bundle");
const FLASHBOTS_EP = 'https://relay-goerli.flashbots.net/'


const GWEI = ethers.utils.parseUnits('5', 'gwei')
const PRIORITY_FEE = GWEI.mul(3)
const BLOCKS_IN_THE_FUTURE = 2

const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, ethers.provider);

async function main() {
	const flashbotsProvider = await FlashbotsBundleProvider.create(
		ethers.provider, // a normal ethers.js provider, to perform gas estimiations and nonce lookups
		wallet, // ethers.js signer wallet, only for signing request payloads, not transactions
		FLASHBOTS_EP
	)
  ethers.provider.on('block', async (blockNumber) => {
    console.info(blockNumber);
		const block = await ethers.provider.getBlock(blockNumber);
		const maxBaseFeeInFutureBlock = FlashbotsBundleProvider.getMaxBaseFeeInFutureBlock(block.baseFeePerGas, BLOCKS_IN_THE_FUTURE);
		let mintTransaction = {
			type: 2,
			maxFeePerGas: PRIORITY_FEE.add(maxBaseFeeInFutureBlock),
			maxPriorityFeePerGas: PRIORITY_FEE,
			gasLimit: 250000,
			value: ethers.utils.parseEther('0.05'),
			data: '0xbe4bc0b5000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000000',
			chainId: 5,
			to: "0x1cAA1167Ff1BD298d71A2E9b19aA5595C1fbC341"
		}
		let mintRareTransaction = {
			type: 2,
			maxFeePerGas: PRIORITY_FEE.add(maxBaseFeeInFutureBlock),
			maxPriorityFeePerGas: PRIORITY_FEE,
			gasLimit: 30000000,
			value: ethers.utils.parseEther('0.05'),
			data: '0xec4a280b000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000000',
			chainId: 5,
			to: "0x7944c549258a74132D3f21370a8AaFEDeC1d33Ec"
		}
/*
		let testTx =  {
			// GOERLI
			chainId: 5,
			type: 2,
			value: ETHER / 100n * 3n,
			data: "0x1249c58b",
			maxFeePerGas: GWEI * 3n,
			maxPriorityFeePerGas: GWEI * 2n,
			to: "0x1caa1167ff1bd298d71a2e9b19aa5595c1fbc341"
		}
*/
		const signedTransactions = await flashbotsProvider.signBundle([
		{
			transaction: mintRareTransaction,
			signer: wallet
		}
		]);
		const targetBlock = blockNumber + BLOCKS_IN_THE_FUTURE;
		const simulation = await flashbotsProvider.simulate(signedTransactions, targetBlock);
		if ('error' in simulation) {
			console.warn(`Simulation Error: ${simulation.error.message}`)
			process.exit(1)
		} else {
			console.log(`Simulation Success: ${JSON.stringify(simulation, null, 2)}`)
		}
		const bundleSubmission = await flashbotsProvider.sendRawBundle(signedTransactions, targetBlock);
		console.log('bundle submitted, waiting')
		if ('error' in bundleSubmission) {
			throw new Error(bundleSubmission.error.message)
		}
		const waitResponse = await bundleSubmission.wait()
		console.log(`Wait Response: ${FlashbotsBundleResolution[waitResponse]}`)
		if (waitResponse === FlashbotsBundleResolution.BundleIncluded || waitResponse === FlashbotsBundleResolution.AccountNonceTooHigh) {
			process.exit(0)
		} else {
			console.log({
				//bundleStats: await flashbotsProvider.getBundleStats(simulation.bundleHash, targetBlock),
				userStats: await flashbotsProvider.getUserStats()
			})
		}
	})
}

main();
