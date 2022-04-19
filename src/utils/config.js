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
    PURCHASE_BOX_ADDRESS: "0x04E59EC7496238578c65aAB9FBd91F59FF0d71A9",
    PURCHASE_SLOT_RI_ADDRESS: "0xdbC76A547bED8662BB978d7c9ad35F93485c5047",
    LAUNCHPAD_IDO_ADDRESS: "0x1208EA6f29f6319E5d10A43f3209Ea54f0F28d69",
    LAUNCHPAD_STAKING_ADDRESS: "0x3ad53851147Bb11796e295163126192dA0834fcA",
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

