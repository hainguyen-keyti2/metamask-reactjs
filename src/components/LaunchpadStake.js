import React, { useState } from "react"
import { utils } from "ethers"
import { Button, Card, Input, Tag } from "antd"
import { RightCircleFilled } from '@ant-design/icons';
import { launchpadStaking, checkBeforeBuy, approveERC20, getStakingPoolPaymentContract } from "../utils/blockchain"
import { openNotification, getReceipt, parseEthereumError } from "../utils/common"
import { LAUNCHPAD_STAKING_ADDRESS } from "../utils/config"

const key = "Staking"

function LaunchpadStake() {
    const [txHash, setTxHash] = useState("")
    const [stakeId, setStakeId] = useState("")
    const [amountStake, setAmountStake] = useState(0)

    const hanldeLaunchpadStake = async () => {
        const convertToWeiAmount = utils.parseEther(amountStake.toString()).toString()
        const paymentContract = await getStakingPoolPaymentContract(stakeId)
        if (paymentContract === null) return openNotification(key, "Invalid stake id!", "Please type valid stake id").error()
        checkBeforeBuy(LAUNCHPAD_STAKING_ADDRESS, paymentContract, convertToWeiAmount)
            .then(async isOK => {
                if (!isOK) {
                    openNotification(key, "Transaction error!", "Please approve amount token before listing").loading()
                    await approveERC20(LAUNCHPAD_STAKING_ADDRESS, paymentContract, convertToWeiAmount)
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
                launchpadStaking(stakeId, convertToWeiAmount)
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
            })
    }

    return (
        <Card title={<Button type="text" onClick={hanldeLaunchpadStake} style={{ color: "magenta", border: "1px solid red" }}>Launchpad Stake</Button>
        } style={{ width: 1000 }}>
            <Tag color="volcano">Stake ID</Tag>
            <Input value={stakeId} onChange={(e) => setStakeId(e.target.value)} />
            <Tag color="volcano">Stake amount</Tag>
            <Input value={amountStake} onChange={(e) => setAmountStake(e.target.value)} />
            <Tag color="volcano">Transaction hash</Tag>
            <a href={txHash ? `https://testnet.bscscan.com/tx/${txHash}` : null} target="_blank" rel="noreferrer">
                <RightCircleFilled />
            </a>
            <Input value={txHash} disabled />
        </Card>
    )
}

export default LaunchpadStake
