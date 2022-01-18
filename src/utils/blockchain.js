import { ethers, utils, constants } from 'ethers'
import { ERC721_PRIVATE_ABI, ERC721_PRIVATE_BYTECODE, EXCHANGE_ABI_LOGIC, ERC20_ABI, PURCHASE_BOX_ABI, PURCHASE_TOKEN_ABI } from './abi-bytecode'
import { getReceipt } from './common';
import { EXCHANGE_ADDRESS, PURCHASE_BOX_ADDRESS, PURCHASE_TOKEN_ADDRESS } from './config'

export const mintToken = (contractAddress, to, tokenUri) => {
    return new Promise( async (resolve, reject) => {
        try {
            const contractWithSigner = new ethers.Contract(contractAddress, ERC721_PRIVATE_ABI, window.signer)
            const tx = await contractWithSigner.safeMint(to, [Math.floor(Math.random() * 12312312312123)], tokenUri)
            resolve(tx.hash)
        } catch (error) {
            reject(error)
        }
    })
};

export const mintTokenReceipt = async (txHash) => {
    return new Promise( async (resolve, reject) => {
        try {
            const {fee, receipt} = await getReceipt(txHash)
            const tokenIdFromLogs = receipt.logs[0].topics
            const tokenId = parseInt(tokenIdFromLogs[tokenIdFromLogs.length - 1], 16)
            resolve({fee, tokenId})
        } catch (error) {
            reject(error)
        }
    })
};

export const deployContract = async (contract_name, contract_symbol) => {
    return new Promise( async (resolve, reject) => {
        try {
            // Build factory for contract
            const factory = new ethers.ContractFactory(ERC721_PRIVATE_ABI, ERC721_PRIVATE_BYTECODE, window.signer)
            // Deploy contract
            const contract = await factory.deploy(contract_name, contract_symbol)
            // Return contract address instead of txHash. Cause txHash not found when deploy contract
            const dataResult = {
                contractAddress: contract.address,
                deployTransaction: contract.deployTransaction
            }
            resolve(dataResult)
        } catch (error) {
            reject(error)
        }
    })
};

export const deployContractReceipt = (deployTransaction) => {
    return new Promise( async (resolve, reject) => {
        try {
            const deployContractReceipt = await deployTransaction.wait()
            // If status = 1 is success
            if(deployContractReceipt.status === 1){
                const dataResult = {
                    txHash: deployContractReceipt.transactionHash,
                    fee: utils.formatEther(deployContractReceipt.gasUsed.mul(deployTransaction.gasPrice)),
                    contractAddress: deployContractReceipt.contractAddress
                }
                resolve(dataResult)
            } else {
                reject("Transaction error with status code 0")
            }
        } catch (error) {
            reject(error)
        }
    })
};

export const purchaseERC721 = (orderBytes, value) => {
    return new Promise( async (resolve, reject) => {
        try {
            const contractWithSigner = new ethers.Contract(EXCHANGE_ADDRESS, EXCHANGE_ABI_LOGIC, window.signer)
            const tx = await contractWithSigner.purchaseERC721(orderBytes, {value})
            resolve(tx.hash)
        } catch (error) {
            reject(error)
        }
    })
};


export const approveForAllERC721 = async (tokenERC721Address) => {
    return new Promise( async (resolve, reject) => {
        try {
            const contractWithSigner = new ethers.Contract(tokenERC721Address, ERC721_PRIVATE_ABI, window.signer)
            const tx = await contractWithSigner.setApprovalForAll(EXCHANGE_ADDRESS, 'true')
            resolve(tx.hash)
        } catch (error) {
            reject(error)
        }
    })
};


export const approveOneERC721 = async (tokenERC721Address, tokenId) => {
    return new Promise( async (resolve, reject) => {
        try {
            const contractWithSigner = new ethers.Contract(tokenERC721Address, ERC721_PRIVATE_ABI, window.signer)
            const tx = await contractWithSigner.approve(EXCHANGE_ADDRESS, tokenId)
            resolve(tx.hash)
        } catch (error) {
            reject(error)
        }
    })
};

export const checkBeforeListing = (tokenERC721Address, tokenId) => {
    return new Promise( async (resolve, reject) => {
        try {
            const contractInstance = new ethers.Contract(tokenERC721Address, ERC721_PRIVATE_ABI, window.provider)
            const [approvedAddress, isApprovedForAll] = await Promise.all([
                contractInstance.getApproved(tokenId),
                contractInstance.isApprovedForAll(window.mainAddress, EXCHANGE_ADDRESS)
            ])
            resolve(approvedAddress.toLowerCase() === EXCHANGE_ADDRESS.toLowerCase() || isApprovedForAll)
        } catch (error) {
            reject(error)
        }
    })
};


export const checkBeforeBuy = (addressApproved, tokenERC20Address, amountNeeded) => {
    return new Promise( async (resolve, reject) => {
        try {
            if(tokenERC20Address === constants.AddressZero) resolve(true)
            const contractInstance = new ethers.Contract(tokenERC20Address, ERC20_ABI, window.provider)
            const approveAmount = await contractInstance.allowance(window.mainAddress, addressApproved)
            if(approveAmount.toString() < amountNeeded) resolve(approveAmount.toString() < amountNeeded ? false : true)
            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
};

export const approveAllERC20 = async (tokenERC20Address) => {
    return new Promise( async (resolve, reject) => {
        try {
            const contractWithSigner = new ethers.Contract(tokenERC20Address, ERC20_ABI, window.signer)
            const balance = await getTotalSupply(tokenERC20Address)
            const tx = await contractWithSigner.approve(EXCHANGE_ADDRESS, balance.amountDecimal)
            resolve(tx.hash)
        } catch (error) {
            reject(error)
        }
    })
};

export const approveERC20 = async (addressApproved, tokenERC20Address, amount) => {
    return new Promise( async (resolve, reject) => {
        try {
            console.log(amount)
            const contractWithSigner = new ethers.Contract(tokenERC20Address, ERC20_ABI, window.signer)
            const tx = await contractWithSigner.approve(addressApproved, amount)
            resolve(tx.hash)
        } catch (error) {
            reject(error)
        }
    })
};

export const getTotalSupply = async (tokenERC20Address) => {
    return new Promise( async (resolve, reject) => {
        try {
            let result = {
                amountReadable: '',
                amountDecimal: '',
            }
            if (tokenERC20Address === constants.AddressZero) {
                throw new Error("Can not get total supply of native coin")
                // const amountBalance = await window.provider.getBalance(window.mainAddress);
                // console.log(amountBalance)
                // result.amountReadable = utils.formatEther(amountBalance)
                // result.amountDecimal = amountBalance.toString()
            } else {
                const contractInstance = new ethers.Contract(tokenERC20Address, ERC20_ABI, window.provider)
                const [amountBalance, decimals] = await Promise.all([
                    contractInstance.totalSupply(),
                    contractInstance.decimals()
                ])
                console.log(amountBalance, decimals)
                result.amountReadable = utils.formatUnits(amountBalance, decimals)
                result.amountDecimal = amountBalance.toString()
            }
            resolve(result)
        } catch (error) {
            reject(error)
        }
    })
};

export const getBalanceERC20 = async (tokenERC20Address) => {
    return new Promise( async (resolve, reject) => {
        try {
            if (tokenERC20Address === constants.AddressZero) {
                const balanceNative = await window.provider.getBalance(window.mainAddress);
                resolve(balanceNative)
            } else {
                const contractInstance = new ethers.Contract(tokenERC20Address, ERC20_ABI, window.provider)
                const balanceERC20 = await contractInstance.balanceOf(window.mainAddress)
                resolve(balanceERC20)
            }
        } catch (error) {
            reject(error)
        }
    })
};

export const purchaseBox = async (inputData, value) => {
    return new Promise( async (resolve, reject) => {
        try {
            const contractInstance = new ethers.Contract(PURCHASE_BOX_ADDRESS, PURCHASE_BOX_ABI, window.signer)
            const tx = await contractInstance.purchaseBox(inputData, {value})
            resolve(tx.hash)
        } catch (error) {
            reject(error)
        }
    })
};

export const purchaseToken = async (tokenAddress, value) => {
    return new Promise( async (resolve, reject) => {
        try {
            const contractInstance = new ethers.Contract(PURCHASE_TOKEN_ADDRESS, PURCHASE_TOKEN_ABI, window.signer)
            const tx = await contractInstance.purchaseToken(tokenAddress, {value})
            resolve(tx.hash)
        } catch (error) {
            reject(error)
        }
    })
};

export const getPriceListedToken = async (tokenAddress) => {
    return new Promise( async (resolve, reject) => {
        try {
            const contractInstance = new ethers.Contract(PURCHASE_TOKEN_ADDRESS, PURCHASE_TOKEN_ABI, window.provider)
            const price = await contractInstance.ListedToken(tokenAddress)
            console.log(price)
            resolve(price)
        } catch (error) {
            reject(error)
        }
    })
};

export const getDecimalToken = async (tokenAddress) => {
    return new Promise( async (resolve, reject) => {
        try {
            const contractInstance = new ethers.Contract(tokenAddress, ERC20_ABI, window.provider)
            const decimal = await contractInstance.decimals()
            resolve(decimal)
        } catch (error) {
            reject(error)
        }
    })
};


// const main = async () => {
//     // console.log(await getBalance("0x8559e768764D56F4d6F578E91cA0fdD2D70B20cb", "0x8d4857A7b17ffaD461D39BE5a92168fdC7812811"))
//     checkBeforeListing("0xD433D84BF68A6F6aB97B35104509E9Ab667BfE74", '0').then(rs => {
//         console.log(rs)
//     })
// }
// main()
