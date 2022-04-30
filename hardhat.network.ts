require('dotenv').config();


const accounts = {
    mnemonic: process.env.MNEMONIC,
};
export const networks = {
    hardhat: {
        forking: {
            url: 'https://eth-mainnet.alchemyapi.io/v2/PvSrH4tdBNOxV9rrLRFuzkmR_AbhKsoO',
            //   blockNumber: 11095000, // a specific block number with which you want to work
            // url: 'https://mainnet.infura.io/v3/d0debf79f4554c5d89b825963aacc844'//infura
        }
    },
    fantomtest: {
        url: "https://rpc.testnet.fantom.network",
        accounts,
        chainId: 4002,
        live: false,
        saveDeployments: true,
        // gasMultiplier: 2,
        gas: 2100000,
        gasPrice: 350000000000,
    },
};

function register(name: string, chainId: number, url: string, privateKey: string) {
    if (url && privateKey) {
        networks[name] = {
            url,
            chainId,
            accounts: [`0x${privateKey}`],
        };
        console.log(`Network '${name}' registered`);
    } else {
        // console.log(`Network '${name}' not registered`);
    }
}

register('mainnet', 1, process.env.MAINNET_RPC_URL, process.env.MAINNET_PRIVATE_KEY);
register('ropsten', 3, process.env.ROPSTEN_RPC_URL, process.env.ROPSTEN_PRIVATE_KEY);
