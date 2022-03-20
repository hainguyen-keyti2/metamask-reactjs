/* eslint-disable no-throw-literal */
import { ethers, utils, constants } from "ethers"
import { ERC721_PRIVATE_ABI, ERC721_PRIVATE_BYTECODE, EXCHANGE_ABI_LOGIC, ERC20_ABI, PURCHASE_BOX_ABI, PURCHASE_TOKEN_ABI } from "./abi-bytecode"
import { getReceipt, convertObjectKeyToSnakeCase } from "./common"
import { EXCHANGE_ADDRESS, PURCHASE_BOX_ADDRESS, PURCHASE_TOKEN_ADDRESS } from "./config"

export const mintToken = async (contractAddress, to, tokenUri) => {
    const contractWithSigner = new ethers.Contract(contractAddress, ERC721_PRIVATE_ABI, window.signer)
    return contractWithSigner.safeMint(to, [Math.floor(Math.random() * 12312312312123)], tokenUri)
        .then(tx => tx.hash)
}

export const mintTokenReceipt = async (txHash) => {
    return getReceipt(txHash)
        .then(({ fee, receipt }) => {
            const tokenIdFromLogs = receipt.logs[0].topics
            const tokenId = parseInt(tokenIdFromLogs[tokenIdFromLogs.length - 1], 16)
            return ({ fee, tokenId })
        })
}

export const deployContract = async (contract_name, contract_symbol) => {
    // Build factory for contract
    const factory = new ethers.ContractFactory(ERC721_PRIVATE_ABI, ERC721_PRIVATE_BYTECODE, window.signer)
    // Deploy contract
    return factory.deploy(contract_name, contract_symbol)
        .then(contract => {
            const dataResult = {
                contractAddress: contract.address,
                deployTransaction: contract.deployTransaction
            }
            return dataResult
        })
}

export const deployContractReceipt = async (deployTransaction) => {
    return deployTransaction.wait()
        .then(receipt => {
            // If status = 1 is success
            if (receipt.status === 1) {
                const dataResult = {
                    txHash: receipt.transactionHash,
                    fee: utils.formatEther(receipt.gasUsed.mul(deployTransaction.gasPrice)),
                    contractAddress: receipt.contractAddress
                }
                return dataResult
            } else {
                throw ("Transaction error with status code 0")
            }
        })
}

export const purchaseERC721 = async (orderBytes, value) => {
    const contractWithSigner = new ethers.Contract(EXCHANGE_ADDRESS, EXCHANGE_ABI_LOGIC, window.signer)
    return contractWithSigner.purchaseERC721(orderBytes, { value })
        .then(tx => tx.hash)
}


export const approveForAllERC721 = async (tokenERC721Address) => {
    const contractWithSigner = new ethers.Contract(tokenERC721Address, ERC721_PRIVATE_ABI, window.signer)
    return contractWithSigner.setApprovalForAll(EXCHANGE_ADDRESS, "true")
        .then(tx => tx.hash)
}


export const approveOneERC721 = async (tokenERC721Address, tokenId) => {
    const contractWithSigner = new ethers.Contract(tokenERC721Address, ERC721_PRIVATE_ABI, window.signer)
    return contractWithSigner.approve(EXCHANGE_ADDRESS, tokenId)
        .then(tx => tx.hash)
}

export const checkBeforeListing = async (tokenERC721Address, tokenId) => {
    const contractInstance = new ethers.Contract(tokenERC721Address, ERC721_PRIVATE_ABI, window.provider)
    return Promise.all([
        contractInstance.getApproved(tokenId),
        contractInstance.isApprovedForAll(window.mainAddress, EXCHANGE_ADDRESS)
    ])
        .then(([approvedAddress, isApprovedForAll]) => {
            return approvedAddress.toLowerCase() === EXCHANGE_ADDRESS.toLowerCase() || isApprovedForAll
        })
}


export const checkBeforeBuy = async (addressApproved, tokenERC20Address, amountNeeded) => {
    if (tokenERC20Address === constants.AddressZero) return true
    const contractInstance = new ethers.Contract(tokenERC20Address, ERC20_ABI, window.provider)
    return contractInstance.allowance(window.mainAddress, addressApproved)
        .then(approveAmount => {
            if (approveAmount.toString() < amountNeeded) return approveAmount.toString() < amountNeeded ? false : true
            return true
        })
}

export const approveAllERC20 = async (tokenERC20Address) => {
    const contractWithSigner = new ethers.Contract(tokenERC20Address, ERC20_ABI, window.signer)
    return getTotalSupply(tokenERC20Address)
        .then(balance => {
            return contractWithSigner.approve(EXCHANGE_ADDRESS, balance.amountDecimal)
        })
        .then(tx => tx.hash)
}

export const approveERC20 = async (addressApproved, tokenERC20Address, amount) => {
    const contractWithSigner = new ethers.Contract(tokenERC20Address, ERC20_ABI, window.signer)
    return contractWithSigner.approve(addressApproved, amount)
        .then(tx => tx.hash)
}

export const getTotalSupply = async (tokenERC20Address) => {
    let result = {
        amountReadable: "",
        amountDecimal: "",
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
    return result

}

export const getBalanceERC20 = async (tokenERC20Address) => {
    if (tokenERC20Address === constants.AddressZero) {
        const balanceNative = await window.provider.getBalance(window.mainAddress)
        return balanceNative
    } else {
        const contractInstance = new ethers.Contract(tokenERC20Address, ERC20_ABI, window.provider)
        const balanceERC20 = await contractInstance.balanceOf(window.mainAddress)
        return balanceERC20
    }
}

export const purchaseBox = async (inputData, value) => {
    const contractInstance = new ethers.Contract(PURCHASE_BOX_ADDRESS, PURCHASE_BOX_ABI, window.signer)
    const tx = await contractInstance.purchaseBox(inputData, { value })
    return tx.hash
}

export const purchaseToken = async (roundId, qty) => {
    const contractInstance = new ethers.Contract(PURCHASE_TOKEN_ADDRESS, PURCHASE_TOKEN_ABI, window.signer)
    const tx = await contractInstance.purchaseToken(roundId, qty)
    return tx.hash
}

export const getRoundInfo = async (roundId) => {
    const contractInstance = new ethers.Contract(PURCHASE_TOKEN_ADDRESS, PURCHASE_TOKEN_ABI, window.signer)
    return contractInstance.rounds(roundId)
        .then(data => convertObjectKeyToSnakeCase({ ...data }))
}

export const getIDOPaymentContract = () => {
    const contractInstance = new ethers.Contract(PURCHASE_TOKEN_ADDRESS, PURCHASE_TOKEN_ABI, window.signer)
    return contractInstance.paymentContract()
}

export const getPriceListedToken = async (tokenAddress) => {
    const contractInstance = new ethers.Contract(PURCHASE_TOKEN_ADDRESS, PURCHASE_TOKEN_ABI, window.provider)
    const price = await contractInstance.ListedToken(tokenAddress)
    return price
}

export const getDecimalToken = async (tokenAddress) => {
    const contractInstance = new ethers.Contract(tokenAddress, ERC20_ABI, window.provider)
    const decimal = await contractInstance.decimals()
    return decimal
}


// const main = async () => {
//     // console.log(await getBalance("0x8559e768764D56F4d6F578E91cA0fdD2D70B20cb", "0x8d4857A7b17ffaD461D39BE5a92168fdC7812811"))
//     checkBeforeListing("0xD433D84BF68A6F6aB97B35104509E9Ab667BfE74", '0').then(rs => {
//         console.log(rs)
//     })
// }
// main()
