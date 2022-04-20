import React, { useState } from "react"
import { Button, Card, Input, Tag, Space } from "antd"
import { utils } from "ethers"
// import { purchaseSlotRI } from "../utils/blockchain"
// import { openNotification, getReceipt, parseEthereumError } from "../utils/common"
const _ = require("lodash")

function ParseOrderInput() {
    const [orderInput, setOrderInput] = useState("")
    const [resultParsed, setResultParsed] = useState()

    const hanldeParseBoxInput = () => {
        const arrField = ["boxId", "boxType", "gameContract", "price", "paymentContract", "qty"]
        const dataDecode = utils.defaultAbiCoder.decode(["tuple(uint256, uint256, address, uint256, address, uint256)", "bytes"], orderInput)
        let result = _.zipObject(arrField, dataDecode[0].map(e => e.toString()))
        result.signatureVerifier = dataDecode[1]
        return setResultParsed(JSON.stringify(result))
    }

    const hanldeParseSlotRIInput = () => {
        const arrField = ["slotId", "gameContract", "price", "paymentContract"]
        const dataDecode = utils.defaultAbiCoder.decode(["tuple(uint256, address, uint256, address)", "bytes"], orderInput)
        let result = _.zipObject(arrField, dataDecode[0].map(e => e.toString()))
        result.signatureVerifier = dataDecode[1]
        return setResultParsed(JSON.stringify(result))
    }

    const hanldeParseGameItemInput = () => {
        const arrFieldData = ["tokenId", "tokenContract", "price", "decimals", "paymentContract", "foundationFeePercent"]
        const arrFieldDoman = ["name", "version", "chainId", "verifyingContract"]
        const dataDecode = utils.defaultAbiCoder.decode(["uint256", "tuple(string, string, uint256, address)", "tuple(uint256, address, uint256, uint256, address, uint256)", "bytes", "bytes"], orderInput)
        let result = _.zipObject(arrFieldData, dataDecode[2].map(e => e.toString()))
        result.expireTime = dataDecode[0].toString()
        result.doman = _.zipObject(arrFieldDoman, dataDecode[1].map(e => e.toString()))
        result.data = _.zipObject(arrFieldData, dataDecode[2].map(e => e.toString()))
        result.signatureUser = dataDecode[3].toString()
        result.signatureVerifier = dataDecode[4].toString()
        return setResultParsed(JSON.stringify(result))
    }

    return (
        <Card title={
            <Space size={30}>
                <Button type="text" onClick={hanldeParseSlotRIInput} style={{ color: "magenta", border: "1px solid red" }}>Parse Order Input For Slot RI</Button>
                <Button type="text" onClick={hanldeParseBoxInput} style={{ color: "magenta", border: "1px solid red" }}>Parse Order Input For Box</Button>
                <Button type="text" onClick={hanldeParseGameItemInput} style={{ color: "magenta", border: "1px solid red" }}>Parse Order Input For Game Item</Button>
            </Space>
        } style={{ width: 1000 }}>
            <Tag color="volcano">Encoded Input</Tag>
            <Input.TextArea rows={5} value={orderInput} onChange={(e) => setOrderInput(e.target.value)} />
            <Tag color="volcano">value</Tag>
            <Input.TextArea rows={5} value={resultParsed} disabled />
        </Card>
    )
}

export default ParseOrderInput
