import React, { useState } from 'react';
import { utils, BigNumber } from 'ethers'
import { Button, Card, Input, Tag } from 'antd';
import { getPriceListedToken, purchaseToken, getDecimalToken } from '$/src/utils/blockchain'
import { openNotification, getReceipt, parseEthereumError } from '../utils/common'

const key = "PurchaseToken"

function PurchaseToken() {
    const [txHash, setTxHash] = useState('');
    const [tokenAddress, setTokenAddress] = useState('0x8559e768764D56F4d6F578E91cA0fdD2D70B20cb');
    const [amountNativeCoin, setAmountNativeCoin] = useState('');
    const [amountToken, setAmountToken] = useState('');

    const hanldePurchaseToken = () => {
        console.log(utils.parseUnits(amountNativeCoin.toString(), "ether").toString())
        purchaseToken(tokenAddress, utils.parseUnits(amountNativeCoin.toString(), "ether").toString())
        .then( txHash => {
            openNotification(key, "Waiting transaction pending!", txHash).loading()
            setTxHash(txHash)
            return getReceipt(txHash)
        })
        .then(receipt => {
            openNotification(key, "Transaction successed!", `Transaction fee : ${receipt.fee} BNB`).success()
        })
        .catch( error => {
            openNotification(key, "Transaction error!", parseEthereumError(error)).error()
        })
    };

    const handleChangeAmount = (value) => {
        let bnValue
        try {
            bnValue = utils.parseUnits(value.toString(), "ether")
        } catch (error) {
            bnValue = BigNumber.from('0')
        }
        getPriceListedToken(tokenAddress)
        .then(async price => {
            const decimal = await getDecimalToken(tokenAddress)
            const amountToken = parseFloat(Number(utils.formatUnits(bnValue, 18))/Number(utils.formatUnits(price, decimal)))
            // const amountToken = bnValue.div(price)
            setAmountNativeCoin(value)
            setAmountToken(amountToken.toString())
        })
    }

    return (
        <Card title={<Button type="text" onClick={hanldePurchaseToken} style={{ color: 'magenta', border: '1px solid red'}}>Purchase token</Button>
        } style={{ width: 1000 }}>
            <Tag color="volcano">Token address</Tag>
            <Input value={tokenAddress} onChange={(e)=>setTokenAddress(e.target.value)}/>
            <Tag color="volcano">Amount native coin</Tag>
            <Input value={amountNativeCoin} onChange={(e)=>handleChangeAmount(e.target.value)}/>
            <Tag color="volcano">Amount token receive</Tag>
            <Input value={amountToken} disabled/>
            <Tag color="volcano">Transaction hash</Tag>
            <Input value={txHash} disabled/>
        </Card>
    )
}

export default PurchaseToken
