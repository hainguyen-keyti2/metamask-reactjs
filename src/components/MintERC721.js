import React, { useState } from 'react';
import { Button, Card, Input, Tag, Form } from 'antd';
import { mintToken, mintTokenReceipt } from '../utils/blockchain'
import { openNotification, parseEthereumError } from '../utils/common'

const key = 'MintERC721'

function MintERC721() {

    const [mintInfo, setMintInfo] = useState({
        txHash: '',
        tokenId: ''
    });

    const [ form ] = Form.useForm()

    const onFinishForm = (values) => {
        mintToken(values.contractAddress, values.toAddress, values.tokenUri)
        .then( txHash => {
            openNotification(key, "Waiting transaction pending!", txHash).loading()
            setMintInfo((prevState) => {
                return {
                    ...prevState,
                    txHash
                }
            })
            return mintTokenReceipt(txHash)
        })
        .then (receipt => {
            openNotification(key, "Transaction successed!", `Transaction fee : ${receipt.fee} BNB`).success()
            setMintInfo((prevState) => {
                return {
                    ...prevState,
                    tokenId: receipt.tokenId
                }
            })
        })
        .catch( error => {
            openNotification(key, "Transaction error!", parseEthereumError(error)).error()
        })
    };

    return (
        <Card title={
                <Button type="text" onClick={form.submit} style={{ color: 'magenta', border: '1px solid red'}}>Mint NFT</Button>
            } style={{ width: 1000 }}>
            <Form
                form={form}
                initialValues={{
                    contractAddress: "0x5584b9477dcB734C4589D14d6409bc763F01dF19",
                    toAddress: "0xb1868FeEb5D9306BF5eee12f5a56b3C74616DF3C",
                    tokenUri: "https://bafkreif7egndgkopo5sxdjvbezpfigwcmyeeqpxjfo7inmzquefmvcusqi.ipfs.dweb.link/"
                }}
                style={{ backgroundColor: '#f5f6f7', padding: '15px', border: '1px solid #d9dadb'}}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                layout="horizontal"
                onFinish={onFinishForm}
                size="small"
                >
                <Tag color="volcano">NFT information</Tag>
                <Form.Item name='contractAddress' label="Collectible address" rules={[{ type: 'string', required: true, pattern: (/^0x[a-fA-F0-9]{40}$/), message: 'Please input string of number, max 256 character!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name='toAddress' label="Mint to address" rules={[{ type: 'string', required: true, pattern: (/^0x[a-fA-F0-9]{40}$/), message: 'Please input hexstring of address!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name='tokenUri' label="Token uri" rules={[{ type: 'string', required: true, message: 'Please input token uri!' }]}>
                    <Input.TextArea rows={2} />
                </Form.Item>
            </Form>
            <Tag color="volcano">Transaction hash</Tag>
            <Input value={mintInfo.txHash} disabled />
            <Tag color="volcano">Token ID</Tag>
            <Input value={mintInfo.tokenId} disabled />
        </Card>
    )
}

export default MintERC721
