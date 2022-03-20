/* eslint-disable no-undef */
const domain = {
    name: "SIGN FOR SELL",
    version: "1",
    chainId: 97,
    verifyingContract: "0x33d571644c231f599897B9b83CD11A6949C5D622"
}
module.exports = {
    CHAIN_INFO: {
        chainId: "0x61",
        rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
        chainName: "Binance Smart Chain Testnet",
        nativeCurrency: { name: "Binance", decimals: 18, symbol: "BNB" },
        blockExplorerUrls: ["https://testnet.bscscan.com"],
    },
    GET_ORDER_INPUT: "getOrderInput",
    LISTING: "listing",
    BASE_URI: "http://localhost:4000/api/v1",
    EXCHANGE_ADDRESS: domain.verifyingContract,
    PURCHASE_BOX_ADDRESS: "0xC0BF1DC9e6d4E36D79b5f81C1751BbD55969915C",
    PURCHASE_TOKEN_ADDRESS: "0xc4aeC5B2b77536028a84F480F9B6966CaD52B0f3",
    LOGIN_MESSAGE: "This is sign message",
    // LISTING_PARAMS: (message) => {
    //     return {
    //         types: {
    //             EIP712Domain: [
    //                 { name: "name", type: "string"},
    //                 { name: "version", type: "string"},
    //                 { name: 'chainId', type: 'uint256' },
    //                 { name: 'verifyingContract', type: 'address' }
    //             ],
    //             Detail: [
    //                 { name: 'tokenId', type: 'uint256' },
    //                 { name: 'tokenContract', type: 'address' },
    //                 { name: 'price', type: 'uint256' },
    //                 { name: 'decimals', type: 'uint256' },
    //                 { name: 'paymentContract', type: 'address' },
    //                 { name: 'foundationFeePercent', type: 'uint256' },
    //                 { name: 'royaltyFeePercent', type: 'uint256' },
    //                 { name: 'tokenCreator', type: 'address' }
    //             ],
    //             Order: [
    //                 { name: 'more', type: 'Detail' },
    //             ],
    //         },
    //         primaryType: "Order",
    //         domain,
    //         message
    //     }
    // }
    LISTING_PARAMS: (message) => ({
        types: {
            EIP712Domain: [
                { name: "name", type: "string" },
                { name: "version", type: "string" },
                { name: "chainId", type: "uint256" },
                { name: "verifyingContract", type: "address" }
            ],
            Detail: [
                { name: "tokenId", type: "uint256" },
                { name: "tokenContract", type: "address" },
                { name: "price", type: "uint256" },
                { name: "decimals", type: "uint256" },
                { name: "paymentContract", type: "address" },
                { name: "foundationFeePercent", type: "uint256" }
            ],
        },
        primaryType: "Detail",
        domain,
        message: {
            ...message
        }
    })
}

