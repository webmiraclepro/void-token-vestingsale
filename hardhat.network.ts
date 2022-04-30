require('dotenv').config();
const { API_URL, PRIVATE_KEY } = process.env;
export const networks = {
    hardhat: {
        forking: {
          url:'https://eth-mainnet.alchemyapi.io/v2/PvSrH4tdBNOxV9rrLRFuzkmR_AbhKsoO',
        //   blockNumber: 11095000, // a specific block number with which you want to work
        // url: 'https://mainnet.infura.io/v3/d0debf79f4554c5d89b825963aacc844'//infura
        }
    },
    // ropsten: {
    //     url: API_URL,
    //     accounts: [`0x${PRIVATE_KEY}`]
    // }
};

function register(name: any, chainId: any, url: any, privateKey: any) {
    if (url && privateKey) {
        networks[name] = {
            url,
            chainId,
            accounts: [privateKey],
        };
        console.log(`Network '${name}' registered`);
    } else {
        // console.log(`Network '${name}' not registered`);
    }
}

register('mainnet', 1, process.env.MAINNET_RPC_URL, process.env.MAINNET_PRIVATE_KEY);
register('bsc', 56, process.env.BSC_RPC_URL, process.env.BSC_PRIVATE_KEY);
register('kovan', 42, process.env.KOVAN_RPC_URL, process.env.KOVAN_PRIVATE_KEY);
register('ropsten', 3, process.env.ROPSTEN_RPC_URL, process.env.ROPSTEN_PRIVATE_KEY);
