// /* eslint-disable no-undef */
// const { ethers, utils } = require("ethers")
// const { EXCHANGE_ADDRESS } = require("./config")

// const EXCHANGE_ABI_LOGIC = [
//     {
//         "anonymous": false,
//         "inputs": [
//             {
//                 "indexed": true,
//                 "internalType": "address",
//                 "name": "seller",
//                 "type": "address"
//             },
//             {
//                 "indexed": true,
//                 "internalType": "address",
//                 "name": "buyer",
//                 "type": "address"
//             },
//             {
//                 "indexed": true,
//                 "internalType": "uint256",
//                 "name": "tokenId",
//                 "type": "uint256"
//             },
//             {
//                 "indexed": false,
//                 "internalType": "uint256",
//                 "name": "price",
//                 "type": "uint256"
//             },
//             {
//                 "indexed": false,
//                 "internalType": "address",
//                 "name": "paymentContract",
//                 "type": "address"
//             }
//         ],
//         "name": "OrderERC721",
//         "type": "event"
//     },
//     {
//         "anonymous": false,
//         "inputs": [
//             {
//                 "indexed": true,
//                 "internalType": "address",
//                 "name": "previousOwner",
//                 "type": "address"
//             },
//             {
//                 "indexed": true,
//                 "internalType": "address",
//                 "name": "newOwner",
//                 "type": "address"
//             }
//         ],
//         "name": "OwnershipTransferred",
//         "type": "event"
//     },
//     {
//         "anonymous": false,
//         "inputs": [
//             {
//                 "indexed": false,
//                 "internalType": "address",
//                 "name": "account",
//                 "type": "address"
//             }
//         ],
//         "name": "Paused",
//         "type": "event"
//     },
//     {
//         "anonymous": false,
//         "inputs": [
//             {
//                 "indexed": false,
//                 "internalType": "address",
//                 "name": "pauser",
//                 "type": "address"
//             }
//         ],
//         "name": "Pauser",
//         "type": "event"
//     },
//     {
//         "anonymous": false,
//         "inputs": [
//             {
//                 "indexed": false,
//                 "internalType": "address",
//                 "name": "account",
//                 "type": "address"
//             }
//         ],
//         "name": "Unpaused",
//         "type": "event"
//     },
//     {
//         "anonymous": false,
//         "inputs": [
//             {
//                 "indexed": false,
//                 "internalType": "address",
//                 "name": "unpauser",
//                 "type": "address"
//             }
//         ],
//         "name": "Unpauser",
//         "type": "event"
//     },
//     {
//         "inputs": [],
//         "name": "foundationAddress",
//         "outputs": [
//             {
//                 "internalType": "address payable",
//                 "name": "",
//                 "type": "address"
//             }
//         ],
//         "stateMutability": "view",
//         "type": "function"
//     },
//     {
//         "inputs": [
//             {
//                 "internalType": "address payable",
//                 "name": "addressFoundation",
//                 "type": "address"
//             }
//         ],
//         "name": "initialize",
//         "outputs": [],
//         "stateMutability": "nonpayable",
//         "type": "function"
//     },
//     {
//         "inputs": [
//             {
//                 "internalType": "bytes",
//                 "name": "orderData",
//                 "type": "bytes"
//             }
//         ],
//         "name": "orderERC721",
//         "outputs": [],
//         "stateMutability": "payable",
//         "type": "function"
//     },
//     {
//         "inputs": [],
//         "name": "owner",
//         "outputs": [
//             {
//                 "internalType": "address",
//                 "name": "",
//                 "type": "address"
//             }
//         ],
//         "stateMutability": "view",
//         "type": "function"
//     },
//     {
//         "inputs": [],
//         "name": "pause",
//         "outputs": [],
//         "stateMutability": "nonpayable",
//         "type": "function"
//     },
//     {
//         "inputs": [],
//         "name": "paused",
//         "outputs": [
//             {
//                 "internalType": "bool",
//                 "name": "",
//                 "type": "bool"
//             }
//         ],
//         "stateMutability": "view",
//         "type": "function"
//     },
//     {
//         "inputs": [],
//         "name": "renounceOwnership",
//         "outputs": [],
//         "stateMutability": "nonpayable",
//         "type": "function"
//     },
//     {
//         "inputs": [
//             {
//                 "internalType": "address payable",
//                 "name": "newFoundationAddress",
//                 "type": "address"
//             }
//         ],
//         "name": "setFoundationAddress",
//         "outputs": [],
//         "stateMutability": "nonpayable",
//         "type": "function"
//     },
//     {
//         "inputs": [
//             {
//                 "internalType": "address",
//                 "name": "newVerifier",
//                 "type": "address"
//             }
//         ],
//         "name": "setVerifier",
//         "outputs": [],
//         "stateMutability": "nonpayable",
//         "type": "function"
//     },
//     {
//         "inputs": [
//             {
//                 "internalType": "address",
//                 "name": "tokenContract",
//                 "type": "address"
//             },
//             {
//                 "internalType": "uint256",
//                 "name": "tokenId",
//                 "type": "uint256"
//             },
//             {
//                 "internalType": "address",
//                 "name": "sender",
//                 "type": "address"
//             },
//             {
//                 "internalType": "address",
//                 "name": "receiver",
//                 "type": "address"
//             }
//         ],
//         "name": "transferHelperERC721",
//         "outputs": [],
//         "stateMutability": "nonpayable",
//         "type": "function"
//     },
//     {
//         "inputs": [
//             {
//                 "internalType": "address",
//                 "name": "newOwner",
//                 "type": "address"
//             }
//         ],
//         "name": "transferOwnership",
//         "outputs": [],
//         "stateMutability": "nonpayable",
//         "type": "function"
//     },
//     {
//         "inputs": [],
//         "name": "unpause",
//         "outputs": [],
//         "stateMutability": "nonpayable",
//         "type": "function"
//     },
//     {
//         "inputs": [],
//         "name": "verifier",
//         "outputs": [
//             {
//                 "internalType": "address",
//                 "name": "",
//                 "type": "address"
//             }
//         ],
//         "stateMutability": "view",
//         "type": "function"
//     }
// ]

// purchaseERC721 = (signer, orderBytes, value) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const contractWithSigner = new ethers.Contract(EXCHANGE_ADDRESS, EXCHANGE_ABI_LOGIC, signer)
//             const tx = await contractWithSigner.orderERC721(orderBytes, { value })
//             resolve(tx.hash)
//         } catch (error) {
//             reject(error)
//         }
//     })
// }
// const orderBytesTest = "0x0000000000000000000000000000000000000000000000000000000061bc192300000000000000000000000000000000000000000000000000000000000001800000000000000000000000000000000000000000000000000000000000000013000000000000000000000000d433d84bf68a6f6ab97b35104509e9ab667bfe74000000000000000000000000000000000000000000000000002bb2c8eabcc0000000000000000000000000000000000000000000000000000000000000000012000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002800000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000006100000000000000000000000074fa719d0e073e68642c8a2c49203a9546ecb392000000000000000000000000000000000000000000000000000000000000000d5349474e20464f522053454c4c00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000131000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000041e154c3b39b418ba51e2a3338fcf3c319d559b7f27b9cd6ad9d7f3538837baf30629811a3318eecb109461497d3093425144ba980f4419b49e77083e6a2aa437d1c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000416a5b8270c2c3c3533d5b30cdc14d05a6d7b0ef6b894bc1576804280125ddf57b7db4036a267edc0a1c3c6bc2d248760c9c960a6de119e5f720275a82c51d5aea1b00000000000000000000000000000000000000000000000000000000000000"
// const networkish = {
//     name: "Binace Smart Chain Testnet",
//     chainId: 97
// }
// let provider = new ethers.providers.JsonRpcProvider("https://data-seed-prebsc-2-s3.binance.org:8545/", networkish)
// const privatekey1 = "a594d02a51354571d93c1cbf87d3ff1a7fb79dfc9afaba8f528e4892fb32d402"
// const privatekey2 = "9b539a9ded9a0dc1acfebf63102e8c91f3634f747c3c40b78784703875308dd9"
// const privatekey3 = "b35dce03bb6e8ad6689fa43eaeb54ce15351384fd5bbb68e94b4b39f514bc825"
// const privatekey4 = "719d6f656a5ba6ecd49cf09d700a8604fb91f9b448cb6ebbc9767099aa02b224"
// const privatekey5 = "2c4104e79ea8936fa6c0d0e7b796b391de814890066b8b8640e13a554dece084"
// const main = async () => {
//     // const signer1 = new ethers.Wallet(privatekey1, provider);
//     // const signer2 = new ethers.Wallet(privatekey2, provider);
//     // const signer3 = new ethers.Wallet(privatekey3, provider);
//     // const signer4 = new ethers.Wallet(privatekey4, provider);
//     // const signer5 = new ethers.Wallet(privatekey5, provider);
//     // const rs = await Promise.all([
//     //     purchaseERC721(signer1, orderBytesTest, '12300000000000000'),
//     //     purchaseERC721(signer2, orderBytesTest, '12300000000000000'),
//     //     purchaseERC721(signer3, orderBytesTest, '12300000000000000'),
//     //     purchaseERC721(signer4, orderBytesTest, '12300000000000000'),
//     //     purchaseERC721(signer5, orderBytesTest, '12300000000000000')
//     // ]).catch(error => {
//     //     console.log(error)
//     // })
//     // console.log(rs)

//     //// Marketpalce
//     // const ABI = [{
//     //     "inputs": [
//     //         {
//     //             "internalType": "address payable",
//     //             "name": "_foundation",
//     //             "type": "address"
//     //         },
//     //         {
//     //             "internalType": "address",
//     //             "name": "_verifier",
//     //             "type": "address"
//     //         }
//     //     ],
//     //     "name": "initialize",
//     //     "outputs": [],
//     //     "stateMutability": "nonpayable",
//     //     "type": "function"
//     // }]
//     // let iface = new utils.Interface(ABI);
//     // const encodeInitialize = iface.encodeFunctionData("initialize", ["0x419C17B6907ccc5118cC94A544d44FD6185cBF03", "0x3dDd5Fa359470B499162D67DdAfa9D7eEc94Acc3"])
//     // console.log(encodeInitialize)

//     const ABI = [{
//         "inputs": [],
//         "name": "initialize",
//         "outputs": [],
//         "stateMutability": "nonpayable",
//         "type": "function"
//     }]
//     let iface = new utils.Interface(ABI)
//     const encodeInitialize = iface.encodeFunctionData("initialize", [])
//     console.log(encodeInitialize)
// }
// main()


