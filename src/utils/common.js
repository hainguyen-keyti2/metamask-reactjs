/* eslint-disable no-throw-literal */
import { notification } from "antd"
import { utils, BigNumber } from "ethers"
import _ from "lodash"

export const getReceipt = async (txHash) => {
    const receipt = await window.provider.waitForTransaction(txHash)
    if (receipt.status === 1) {
        const gasPrice = await window.provider.getGasPrice()
        // Get real Transaction fee
        const realGasUsed = utils.formatEther(receipt.gasUsed.mul(gasPrice))
        // Set data return to object dataResult
        // So have many fields in receipt object, you can console.log it and get value needed
        // gasPrice just a example trigger for know is transaction have done or not.
        const dataResult = {
            fee: realGasUsed,
            receipt
        }
        return dataResult
    } else {
        throw ("Transaction error with status code 0")
    }
}

export const parseEthereumError = (exception) => {
    let objErr = {}
    console.log(exception)
    let errorMessage = exception.toString()
    if (exception.tx) {
        objErr = JSON.parse(exception.error.error.body)
        errorMessage = objErr.error.message
    } else if (exception.method && !exception.errorArgs) {
        if (exception.error) {
            objErr = JSON.parse(exception.error.body)
            errorMessage = objErr.error.message
        } else {
            errorMessage = "[Smartcontract check] Address not found on chain"
        }
    } else if (exception.argument || exception.errorArgs || exception.requestBody) {
        if (exception.argument || exception.requestBody) {
            errorMessage = `[Blockchain format check] ${exception.reason}`
        } else {
            errorMessage = `[Smartcontract check] Error at ${exception.reason}`
        }
    } else if (exception.stack) {
        if (exception.data) errorMessage = exception.data.message
        else errorMessage = exception.message
    } else {
        console.log(errorMessage)
        errorMessage = "Unknown error"
    }
    const modifyErrorMessage = errorMessage.replace("execution reverted:", "[Smartcontract check] Error at")
    return modifyErrorMessage
}

export const openNotification = (key, message, description) => {
    return {
        loading: () => notification.info({ key, message, description, duration: 0 }),
        error: () => notification.error({ key, message, description, duration: 0 }),
        success: () => notification.success({ key, message, description, duration: 0 }),
    }
}

export const convertObjectKeyToSnakeCase = (object) => {
    let result = {}
    for (const property in object)
        if (!Number.isInteger(Number(property)))
            result[_.snakeCase(property)] = BigNumber.isBigNumber(object[property]) ? autoFormatEtherAmount(object[property]) : object[property]
    return result
}

export const autoFormatEtherAmount = (bnValue) => {
    return (Number.isInteger(Number(utils.formatUnits(bnValue))) ? Number(utils.formatUnits(bnValue)) : Number(bnValue.toString())).toString()
}