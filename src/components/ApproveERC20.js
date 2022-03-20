import React, { useState } from "react"
import { Button, Card, Input, Tag } from "antd"
import { approveERC20 } from "../utils/blockchain"
import { openNotification, getReceipt, parseEthereumError } from "../utils/common"
import { EXCHANGE_ADDRESS } from "../utils/config"

const key = "ApproveERC20"
function ApproveERC20() {
    const [txHash, setTxHash] = useState("")
    const [paymentAddress, setPaymentAddress] = useState("")
    const [amount, setAmount] = useState("")

    const handleApproveERC20 = () => {
        approveERC20(EXCHANGE_ADDRESS, paymentAddress, amount)
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
    }

    return (
        <Card title={<Button type="text" onClick={handleApproveERC20} style={{ color: "magenta", border: "1px solid red" }}>Approve ERC20</Button>} style={{ width: 1000 }}>
            <Tag color="volcano">Payment address</Tag>
            <Input value={paymentAddress} onChange={(e) => setPaymentAddress(e.target.value)} />
            <Tag color="volcano">Amount</Tag>
            <Input value={amount} onChange={(e) => setAmount(e.target.value)} />
            <Tag color="volcano">Transaction hash</Tag>
            <Input value={txHash} disabled />
        </Card>
    )
}

export default ApproveERC20
