import React, { useState } from "react"
import { Button, Card, Input, Tag } from "antd"
import { RightCircleFilled } from '@ant-design/icons';
import { launchpadWithdraw, getReward } from "../utils/blockchain"
import { openNotification, getReceipt, parseEthereumError } from "../utils/common"

const key = "Withdraw"

function LaunchpadWithdraw() {
    const [txHash, setTxHash] = useState("")
    const [stakeId, setStakeId] = useState("")
    const [stakeIndex, setStakeIndex] = useState(0)
    const [rewardEstimate, setRewardEstimate] = useState()

    const hanldeLaunchpadWithdrawStake = async () => {
        launchpadWithdraw(stakeId, stakeIndex)
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

    const handleGetReward = async () => {
        getReward(stakeId, stakeIndex)
            .then(data => {
                console.log("console.log(data)")
                console.log(data)
                setRewardEstimate(data)
            })
            .catch(err => {
                console.log("console.log(data)")
                console.log(err)
                setRewardEstimate(0)
            })
    }

    return (
        <Card title={<Button type="text" onClick={hanldeLaunchpadWithdrawStake} style={{ color: "magenta", border: "1px solid red" }}>Launchpad Withdraw Stake</Button>
        } style={{ width: 1000 }}>
            <Tag color="volcano">Stake ID</Tag>
            <Input value={stakeId} onChange={(e) => setStakeId(e.target.value)} />
            <Tag color="volcano">Stake index</Tag>
            <Input value={stakeIndex} onChange={(e) => setStakeIndex(e.target.value)} />
            <Tag color="volcano">Reward estimate result</Tag>
            <Button disabled={stakeId !== "" ? false : true} type="text" onClick={handleGetReward} style={{ color: "green", border: "1px solid green" }}>Get reward estimate</Button>
            <Input.TextArea rows={2} value={JSON.stringify(rewardEstimate)} disabled />
            <Tag color="volcano">Transaction hash</Tag>
            <a href={txHash ? `https://testnet.bscscan.com/tx/${txHash}` : null} target="_blank" rel="noreferrer">
                <RightCircleFilled />
            </a>
            <Input value={txHash} disabled />
        </Card>
    )
}

export default LaunchpadWithdraw
