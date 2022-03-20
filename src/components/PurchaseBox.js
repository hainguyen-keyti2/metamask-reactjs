import React, { useState } from "react"
import { constants } from "ethers"
import { Button, Card, Input, Tag, Space } from "antd"
import { purchaseBox, checkBeforeBuy, approveERC20 } from "../utils/blockchain"
import { openNotification, getReceipt, parseEthereumError } from "../utils/common"
import { getParseBoxParse } from "../utils/api"
import { PURCHASE_BOX_ADDRESS } from "../utils/config"

const key = "PurchaseBox"

const data = [
    {
        id: 1,
        type: "ANGEL",
        price: 0.00200000,
        paymentContract: "0x0000000000000000000000000000000000000000",
        scPrice: "2000000000000000",
        available: 1000,
        scInput: "0x00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ed34e576b7795c735fe9acc5217566d9a92d5aea00000000000000000000000000000000000000000000000000071afd498d0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000041fcbecbb8739e8c86c4157095bf923776d20d7e5c8b9a1fd8c6f707bfaf64d67b10536c6730b88209e69f45c39cd92649743436a9325bf98bd6b0696615029d5b1b00000000000000000000000000000000000000000000000000000000000000"
    },
    {
        id: 2,
        type: "MINION_COMMON",
        price: 8,
        scPrice: "8000000000000000000",
        paymentContract: "0x8559e768764D56F4d6F578E91cA0fdD2D70B20cb",
        available: 1000,
        scInput: "0x00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000001000000000000000000000000ed34e576b7795c735fe9acc5217566d9a92d5aea0000000000000000000000000000000000000000000000006f05b59d3b2000000000000000000000000000008559e768764d56f4d6f578e91ca0fdd2d70b20cb000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000000419a3927548ddd82e5a4b3170413fc4fe2c0f2e73efe9edc1d309fbd2a74f5f036074cbb5159a5f6109b47d197ac91f8da6b47a265f75940d8a173da2b8a9322481c00000000000000000000000000000000000000000000000000000000000000"
    },
    {
        id: 3,
        type: "MINION_EPIC",
        price: 0.00400000,
        scPrice: "4000000000000000",
        paymentContract: "0x0000000000000000000000000000000000000000",
        available: 1000,
        scInput: "0x00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000001000000000000000000000000ed34e576b7795c735fe9acc5217566d9a92d5aea000000000000000000000000000000000000000000000000000e35fa931a00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000041a898885898d63ba972ace629b33557347a33d6ebbed39b8a788e6ab011c7b0943519e06582a28c62d2ab1fdab454f6b3b926445827f0c0506ec37df806a958561b00000000000000000000000000000000000000000000000000000000000000"
    }
]

function PurchaseBox() {
    const [txHash, setTxHash] = useState("")

    const hanldePurchaseBox = (boxId) => {
        const boxData = data[boxId - 1]
        checkBeforeBuy(PURCHASE_BOX_ADDRESS, boxData.paymentContract, boxData.scPrice)
            .then(async isOK => {
                if (!isOK) {
                    openNotification(key, "Transaction error!", "Please approve amount token before listing").loading()
                    await approveERC20(PURCHASE_BOX_ADDRESS, boxData.paymentContract, boxData.scPrice)
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
                return boxData.scInput
            })
            .then(inputData => {
                const value = (boxData.paymentContract === constants.AddressZero) ? boxData.scPrice : "0"
                return purchaseBox(inputData, value)
            })
            .then(txHash => {
                openNotification(key, "Waiting transaction pending!", txHash).loading()
                getParseBoxParse(txHash)
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
            <Space size={30}>
                <Button type="text" onClick={() => hanldePurchaseBox(1)} style={{ color: "magenta", border: "1px solid red" }}>Purchase Box 1</Button>
                <Button type="text" onClick={() => hanldePurchaseBox(2)} style={{ color: "magenta", border: "1px solid red" }}>Purchase Box 2</Button>
                <Button type="text" onClick={() => hanldePurchaseBox(3)} style={{ color: "magenta", border: "1px solid red" }}>Purchase Box 3</Button>
            </Space>
        } style={{ width: 1000 }}>
            <Tag color="volcano">Transaction hash</Tag>
            <Input value={txHash} disabled />
        </Card>
    )
}

export default PurchaseBox
