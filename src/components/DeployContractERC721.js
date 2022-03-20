import React, { useState } from "react"
import { Button, Card, Input, Tag, Form } from "antd"
import { deployContract, deployContractReceipt } from "../utils/blockchain"
import { openNotification, parseEthereumError } from "../utils/common"

const key = "DeployContractERC721"

function DeployContractERC721() {

    const [deployInfo, setDeployInfo] = useState({
        txHash: "",
        contractAddress: ""
    })

    const [form] = Form.useForm()

    const onFinishForm = (values) => {
        console.log(values)
        deployContract(values.contractName, values.contractSymbol)
            .then(result => {
                openNotification(key, "Waiting transaction pending!", result.contractAddress).loading()
                setDeployInfo((prevState) => {
                    return {
                        ...prevState,
                        contractAddress: result.contractAddress
                    }
                })
                return deployContractReceipt(result.deployTransaction)
            })
            .then(receipt => {
                openNotification(key, "Transaction successed!", `Transaction fee : ${receipt.fee} BNB`).success()
                setDeployInfo((prevState) => {
                    return {
                        ...prevState,
                        txHash: receipt.txHash
                    }
                })
            })
            .catch(error => {
                openNotification(key, "Transaction error!", parseEthereumError(error)).error()
            })
    }

    return (
        <Card title={
            <Button type="text" onClick={form.submit} style={{ color: "magenta", border: "1px solid red" }}>Create collectible</Button>
        } style={{ width: 1000 }}>
            <Form
                form={form}
                initialValues={{
                    contractName: "HAI DEP TRAI",
                    contractSymbol: "HDT"
                }}
                style={{ backgroundColor: "#f5f6f7", padding: "15px", border: "1px solid #d9dadb" }}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                layout="horizontal"
                onFinish={onFinishForm}
                size="small"
            >
                <Tag color="volcano">NFT information</Tag>
                <Form.Item name='contractName' label="Collectible Name" rules={[{ type: "string", required: true, message: "Please input name!" }]}>
                    <Input />
                </Form.Item>
                <Form.Item name='contractSymbol' label="Collectible Symbol" rules={[{ type: "string", required: true, message: "Please input symbol!" }]}>
                    <Input />
                </Form.Item>
            </Form>
            <Tag color="volcano">Transaction hash</Tag>
            <Input value={deployInfo.txHash} disabled />
            <Tag color="volcano">Contract address</Tag>
            <Input value={deployInfo.contractAddress} disabled />
        </Card>
    )
}

export default DeployContractERC721