import React, { useState } from "react"
import { utils } from "ethers"
import { Button, Card, Input, Tag } from "antd"
import { RightCircleFilled } from '@ant-design/icons';
import { purchaseToken, getRoundInfo, checkBeforeBuy, approveERC20, getIDOPaymentContract } from "../utils/blockchain"
import { openNotification, getReceipt, parseEthereumError } from "../utils/common"
import { PURCHASE_TOKEN_ADDRESS } from "../utils/config"

const key = "PurchaseToken"

function PurchaseToken() {
    const [txHash, setTxHash] = useState("")
    const [roundId, setRoundId] = useState("")
    const [qty, setQty] = useState(0)
    const [roundInfo, setRoundInfo] = useState()
    const [amountDue, setAmountDue] = useState(0)

    const hanldePurchaseToken = async () => {
        if (!roundInfo || qty === 0) return openNotification(key, "Invalid input!", "Please get round info and fill in qty more than 0!").error()
        const convertToWei = utils.parseUnits(qty.toString(), "ether").toString()
        const paymentContract = await getIDOPaymentContract()
        const amountDueParsed = utils.parseEther(Math.ceil(amountDue).toString()).toString()
        checkBeforeBuy(PURCHASE_TOKEN_ADDRESS, paymentContract, amountDueParsed)
            .then(async isOK => {
                if (!isOK) {
                    openNotification(key, "Transaction error!", "Please approve amount token before listing").loading()
                    await approveERC20(PURCHASE_TOKEN_ADDRESS, paymentContract, amountDueParsed)
                        .then(txHash => {
                            openNotification(key, "Waiting transaction pending!", txHash).loading()
                            return getReceipt(txHash)
                        })
                        .then(receipt => {
                            openNotification(key, "Transaction successed!", `Transaction fee : ${receipt.fee} BNB`).success()
                        })
                        .catch(error => {
                            throw error
                        })
                }
                purchaseToken(roundId, convertToWei)
                    .then(txHash => {
                        openNotification(key, "Waiting transaction pending!", txHash).loading()
                        setTxHash(txHash)
                        return getReceipt(txHash)
                    })
                    .then(receipt => {
                        openNotification(key, "Transaction successed!", `Transaction fee : ${receipt.fee} BNB`).success()
                    })
                    .catch(error => {
                        openNotification(key, "Transaction error!", parseEthereumError(error)).error()
                    })
            })
    }
    const handleGetRoundInfo = async () => {
        getRoundInfo(roundId)
            .then(data => {
                console.log("console.log(data)")
                console.log(data)
                setRoundInfo(data)
            })
    }

    const handleChangeDueAmount = (value) => {
        // console.log(e)
        setQty(value)
        value = value ? value : 0
        setAmountDue(value / roundInfo.price_per_payment_token)
        // form.setFieldsValue({
        //     price: utils.parseUnits(value.toString(), "ether").toString()
        // })
    }

    return (
        <Card title={<Button type="text" onClick={hanldePurchaseToken} style={{ color: "magenta", border: "1px solid red" }}>Purchase token</Button>
        } style={{ width: 1000 }}>
            <Tag color="volcano">Round ID</Tag>
            <Button disabled={roundId ? false : true} type="text" onClick={handleGetRoundInfo} style={{ color: "green", border: "1px solid green" }}>Get round info</Button>
            <Input value={roundId} onChange={(e) => setRoundId(e.target.value)} />
            <Tag color="volcano">Result get round id</Tag>
            <Input.TextArea rows={5} value={JSON.stringify(roundInfo)} disabled />
            <Tag color="volcano">Qty</Tag>
            <Tag color="green">TPP (SPC)</Tag>
            <Input value={qty} onChange={(e) => handleChangeDueAmount(e.target.value)} disabled={roundInfo ? false : true} />
            <Tag color="volcano">Due amount</Tag>
            <Tag color="green">ING (BUSD)</Tag>
            <Input value={amountDue} disabled />
            <Tag color="volcano">Transaction hash</Tag>
            <a href={txHash ? `https://testnet.bscscan.com/tx/${txHash}` : null} target="_blank" rel="noreferrer">
                <RightCircleFilled />
            </a>
            <Input value={txHash} disabled />
        </Card>
    )
}

export default PurchaseToken
