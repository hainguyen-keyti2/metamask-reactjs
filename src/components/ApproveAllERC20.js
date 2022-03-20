import React, { useState } from "react"
import { Button, Card, Input, Tag } from "antd"
import { approveAllERC20 } from "../utils/blockchain"
import { openNotification, getReceipt, parseEthereumError } from "../utils/common"

const key = "ApproveAllERC20"
function ApproveAllERC20() {
    const [txHash, setTxHash] = useState("")
    const [paymentAddress, setPaymentAddress] = useState("")

    const handleApproveAllERC20 = () => {
        approveAllERC20(paymentAddress)
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
        <Card title={<Button type="text" onClick={handleApproveAllERC20} style={{ color: "magenta", border: "1px solid red" }}>Approve unlimit ERC20</Button>} style={{ width: 1000 }}>
            <Tag color="volcano">Payment address</Tag>
            <Input value={paymentAddress} onChange={(e) => setPaymentAddress(e.target.value)} />
            <Tag color="volcano">Transaction hash</Tag>
            <Input value={txHash} disabled />
        </Card>
    )
}

export default ApproveAllERC20