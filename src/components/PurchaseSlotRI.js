import React, { useState } from "react"
import { Button, Card, Input, Tag } from "antd"
import { purchaseSlotRI } from "../utils/blockchain"
import { openNotification, getReceipt, parseEthereumError } from "../utils/common"

const key = "PurchaseSlotRI"

function PurchaseSlotRI() {
    const [txHash, setTxHash] = useState("")
    const [slotRIInput, setSlotRIInput] = useState("")
    const [value, setValue] = useState()

    const hanldePurchaseSlotRI = () => {
        purchaseSlotRI(slotRIInput, value)
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
            <Button type="text" onClick={hanldePurchaseSlotRI} style={{ color: "magenta", border: "1px solid red" }}>Purchase Slot RI</Button>
        } style={{ width: 1000 }}>
            <Tag color="volcano">Slot RI input</Tag>
            <Input.TextArea rows={5} value={slotRIInput} onChange={(e) => setSlotRIInput(e.target.value)} />
            <Tag color="volcano">value</Tag>
            <Input value={value} onChange={(e) => setValue(e.target.value)} />
            <Tag color="volcano">Transaction hash</Tag>
            <Input value={txHash} disabled />
        </Card>
    )
}

export default PurchaseSlotRI
