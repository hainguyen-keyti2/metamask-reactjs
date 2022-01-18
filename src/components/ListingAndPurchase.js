import React, { useState } from 'react';
import { Button, Space, Card, Input, Tag, Form, Select, InputNumber } from 'antd';
import { utils, ethers } from "ethers";
// import { recoverTypedSignature } from '@metamask/eth-sig-util';
// import axios from 'axios'
import { listingAction, getOrderInputAction} from '../utils/api'
// import { wormholeABI } from '$/src/untils/abi';
import { LISTING_PARAMS, GET_ORDER_INPUT, LISTING, EXCHANGE_ADDRESS } from '../utils/config'
import { purchaseERC721, checkBeforeListing, approveOneERC721, checkBeforeBuy, approveERC20, getBalanceERC20 } from '../utils/blockchain'
import { openNotification, getReceipt, parseEthereumError } from '../utils/common'
import { constants } from 'ethers'

const { Option } = Select;
const key = "ListingAndPurchase"

function ListingAndPurchase() {

    const [action, setAction] = useState('');
    const [listing, setListing] = useState({
        signature: '',
        address: '',
        readablePrice: 0.123,
        resultListing: '',
        resultPurchase: ''
    });
    const [purchaseTxHash, setPurchaseTxHash] = useState('')

    const [ form ] = Form.useForm()

    const HandleChangeReadablePrice = (value) => {
        // console.log(e)
        value = value ? value : 0
        setListing((prevState => {
            return {
                ...prevState,
                readablePrice: value
            }
        }))
        form.setFieldsValue({
            price: utils.parseUnits(value.toString(), "ether").toString()
        });
    }

    const handleGetOrderInput = () => {
        setAction(GET_ORDER_INPUT)
        form.submit()
    };
    const handleListing = () => {
        setAction(LISTING)
        form.submit()
    };

    const onFinishForm = async (values) => {
        if(action === LISTING) {
            checkBeforeListing(values.tokenContract, values.tokenId)
            .then( async isOK => {
                if(!isOK){
                    openNotification(key, "Transaction error!", "Please approve NFT before listing").loading()
                    await approveOneERC721(values.tokenContract, values.tokenId)
                    .then( txHash => {
                        openNotification(key, "Waiting transaction pending!", txHash).loading()
                        return getReceipt(txHash)
                    })
                    .then(receipt => {
                        openNotification(key, "Transaction successed!", `Transaction fee : ${receipt.fee} BNB`).success()
                    })
                    .catch( error => {
                        openNotification(key, "Transaction error!", parseEthereumError(error)).error()
                    })
                }
                // const message = {
                //     info: {
                //         id: values.tokenId,
                //         name: 'Bepple version 222',
                //         collectible: 'Bepple famous collection in the word',
                //         price: `${listing.readablePrice} ETH`,
                //         foundationFee: `${values.foundationFeePercent/100}%`,
                //         royaltyFee: `${values.royaltyFeePercent/100}%`,
                //         realRecieve: `${listing.readablePrice - (listing.readablePrice*(values.foundationFeePercent/100 + values.royaltyFeePercent/100)/100)} ETH`,
                //         time: moment().unix()
                //     },
                //     more: {...values}
                // }
                console.log(values)
                const listingParams = LISTING_PARAMS(values)
                const signature = await window.ethereum.request({
                    method: 'eth_signTypedData_v4',
                    params: [window.mainAddress, JSON.stringify(listingParams)],
                    });
                // console.log(signature)
                // console.log(JSON.stringify(listingParams))
                // const addressRecover = recoverTypedSignature({
                //     data: listingParams,
                //     version: "V4",
                //     signature,
                //   });
                // console.log(addressRecover)
                delete values.foundationFeePercent
                const rsListing = await listingAction({
                    signature,
                    data: {
                        address: window.mainAddress,
                        readablePrice: listing.readablePrice,
                        message: {...values}
                    }
                })
                console.log(rsListing)
                setListing((prevState) => {
                    return {
                        ...prevState,
                        signature,
                        address: window.mainAddress,
                        resultListing: rsListing
                    }
                })
                openNotification(key, "Listing information", rsListing.toString()).loading()
            })
        } else if (action === GET_ORDER_INPUT){
            delete values.foundationFeePercent
            const rsPurchase = await getOrderInputAction({
                signature: listing.signature,
                data: {
                    address: listing.address,
                    readablePrice: listing.readablePrice,
                    message: {...values}
                }
            })
            console.log(rsPurchase)
            setListing((prevState) => {
                return {
                    ...prevState,
                    resultPurchase: rsPurchase
                }
            })
            openNotification(key, "Get order bytes information", rsPurchase).loading()
        }
      };


    const handleBuyERC721 = async () => {
        const paymentContract = form.getFieldValue('paymentContract')
        const amountPrice = form.getFieldValue('price')
        const amountValue = paymentContract === constants.AddressZero ? utils.parseUnits(listing.readablePrice.toString(), "ether").toString() : '0'
        getBalanceERC20(paymentContract)
        .then( balance => {
            console.log(balance)
            if(balance.lt(ethers.BigNumber.from(amountPrice))) throw new Error("Balance is not enough to buy!")
            if(paymentContract === constants.AddressZero) return true
            else return checkBeforeBuy(EXCHANGE_ADDRESS, paymentContract, amountPrice)
        })
        .then( async isOK => {
            if (!isOK) {
                openNotification(key, "Transaction error!", "Please approve amount token before listing").loading()
                await approveERC20(EXCHANGE_ADDRESS, paymentContract, amountPrice)
                .then( txHash => {
                    openNotification(key, "Waiting transaction pending!", txHash).loading()
                    return getReceipt(txHash)
                })
                .then(receipt => {
                    openNotification(key, "Transaction successed!", `Transaction fee : ${receipt.fee} BNB`).success()
                })
                .catch( error => {
                    throw error
                })
            }
            return purchaseERC721(listing.resultPurchase, amountValue)
        })
        .then( txHash => {
            openNotification(key, "Waiting transaction pending!", txHash).loading()
            setPurchaseTxHash(txHash)
            return getReceipt(txHash)
        })
        .then (receipt => {
            openNotification(key, "Transaction successed!", `Transaction fee : ${receipt.fee} BNB`).success()
        })
        .catch( error => {
            openNotification(key, "Transaction error!", parseEthereumError(error)).error()
        })
    };

    return (
        <Card title={
            <Space size={30}>
                <Button type="text" onClick={handleListing} style={{ color: 'magenta', border: '1px solid red'}}>Listing</Button>
                <Button type="text" onClick={handleGetOrderInput} style={{ color: 'magenta', border: '1px solid red'}}>Get order input</Button>
                <Button type="text" onClick={handleBuyERC721} style={{ color: 'magenta', border: '1px solid red'}}>Buy NFT</Button>
            </Space>
        } style={{ width: 1000 }}>
            <Tag color="volcano">Readable price</Tag>
            <span>
                <InputNumber value={listing.readablePrice} min={0} max={50} onChange={HandleChangeReadablePrice}/>
                <Select
                    style={{ width: 80, margin: '0 8px' }}
                    defaultValue="eth"
                >
                    <Option value="eth">ETH</Option>
                    <Option value="hkt">HKT</Option>
                </Select>
            </span>
            <Form
                form={form}
                initialValues={{
                    tokenId: "0",
                    tokenContract: "0x5584b9477dcB734C4589D14d6409bc763F01dF19",
                    price: utils.parseUnits(listing.readablePrice.toString(), "ether").toString(),
                    decimals: 18,
                    paymentContract: "0x8559e768764D56F4d6F578E91cA0fdD2D70B20cb",
                    foundationFeePercent: 0
                }}
                style={{ backgroundColor: '#f5f6f7', padding: '15px', border: '1px solid #d9dadb'}}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                layout="horizontal"
                onFinish={onFinishForm}
                size="small"
                >
                <Tag color="volcano">NFT information</Tag>
                <Form.Item name='tokenId' label="Token ID" rules={[{ type: 'string', required: true, pattern: (/^[0-9]{1,256}$/), message: 'Please input string of number, max 256 character!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name='tokenContract' label="Token Contract" rules={[{ type: 'string', required: true, pattern: (/^0x[a-fA-F0-9]{40}$/), message: 'Please input hexstring of address!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name='price' label="Price" rules={[{ type: 'string', required: true, pattern: (/^(?!(0))[0-9]{1,50}$/), message: 'Please input string of number without zero prefix, max 50 character!' }]}>
                    <Input disabled/>
                </Form.Item>
                <Form.Item name='decimals' label="Decimals" rules={[{ type: 'number', required: true, min: 0, max: 50, message: 'Please input number with range [0,50]' }]}>
                    <InputNumber />
                </Form.Item>
                <Form.Item name='paymentContract' label="Payment Contract" rules={[{ type: 'string', required: true, pattern: (/^0x[a-fA-F0-9]{40}$/), message: 'Please input hexstring of address!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name='foundationFeePercent' label="Foundation Fee" rules={[{ type: 'number', required: true, min: 0, max: 100000, message: 'Please input number with range [0,100000]' }]}>
                    <InputNumber />
                </Form.Item>
            </Form>
            <Tag color="volcano">Signature</Tag>
            <Input.TextArea rows={2} value={listing.signature} disabled />
            <Tag color="volcano">Address</Tag>
            <Input value={listing.address} disabled/>
            <Tag color="volcano">Result listing</Tag>
            <Input value={listing.resultListing} disabled/>
            <Tag color="volcano">Result get order input</Tag>
            <Input.TextArea rows={10} value={listing.resultPurchase} disabled />
            <Tag color="volcano">Purchase transaction hash</Tag>
            <Input value={purchaseTxHash} disabled/>
        </Card>
    )
}

export default ListingAndPurchase
