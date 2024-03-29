import React, { useState } from "react"
import { Button, Card, Input, Tag } from "antd"
import { purchaseBox } from "../utils/blockchain"
import { openNotification, getReceipt, parseEthereumError } from "../utils/common"

const key = "PurchaseBox"

function PurchaseBox() {
    const [txHash, setTxHash] = useState("")
    const [boxInput, setBoxInput] = useState("")
    const [value, setValue] = useState()

    const hanldePurchaseBox = () => {
        purchaseBox(boxInput, value)
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
        <Card title={
            <Button type="text" onClick={hanldePurchaseBox} style={{ color: "magenta", border: "1px solid red" }}>Purchase Box</Button>
        } style={{ width: 1000 }}>
            <Tag color="volcano">Box input</Tag>
            <Input.TextArea rows={5} value={boxInput} onChange={(e) => setBoxInput(e.target.value)} />
            <Tag color="volcano">value</Tag>
            <Input value={value} onChange={(e) => setValue(e.target.value)} />
            <Tag color="volcano">Transaction hash</Tag>
            <Input value={txHash} disabled />
        </Card>
    )
}

export default PurchaseBox
