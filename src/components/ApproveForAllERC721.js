import React, { useState } from "react"
import { Button, Card, Input, Tag } from "antd"
import { approveForAllERC721 } from "../utils/blockchain"
import { openNotification, getReceipt, parseEthereumError } from "../utils/common"

const key = "ApproveForAllERC721"
function ApproveForAllERC721() {
    const [txHash, setTxHash] = useState("")
    const [collectibleAddress, setCollectibleAddress] = useState("")

    const handleApproveForAllERC721 = () => {
        approveForAllERC721(collectibleAddress)
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
        <Card title={<Button type="text" onClick={handleApproveForAllERC721} style={{ color: "magenta", border: "1px solid red" }}>Approve for all ERC721</Button>} style={{ width: 1000 }}>
            <Tag color="volcano">Collectible address</Tag>
            <Input value={collectibleAddress} onChange={(e) => setCollectibleAddress(e.target.value)} />
            <Tag color="volcano">Transaction hash</Tag>
            <Input value={txHash} disabled />
        </Card>
    )
}

export default ApproveForAllERC721