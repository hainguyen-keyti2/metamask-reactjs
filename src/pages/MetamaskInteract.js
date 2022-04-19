import React from "react"
import MintERC721 from "../components/MintERC721"
import Connect from "../components/Connect"
import Login from "../components/Login"
import ListingAndPurchase from "../components/ListingAndPurchase"
import DeployContractERC721 from "../components/DeployContractERC721"
import ApproveForAllERC721 from "../components/ApproveForAllERC721"
import ApproveOneERC721 from "../components/ApproveOneERC721"
import ApproveAllERC20 from "../components/ApproveAllERC20"
import ApproveERC20 from "../components/ApproveERC20"
import PurchaseBox from "../components/PurchaseBox"
import PurchaseSlotRI from "../components/PurchaseSlotRI"
import ParseOrderInput from "../components/ParseOrderInput"
import LaunchpadIDO from "../components/LaunchpadIDO"
import LaunchpadStake from "../components/LaunchpadStake"
import LaunchpadWithdrawStake from "../components/LaunchpadWithdraw"

function MetamaskInteract() {
    return (
        <div>
            <Connect />
            <Login />
            <ApproveForAllERC721 />
            <ApproveOneERC721 />
            <ApproveAllERC20 />
            <ApproveERC20 />
            <PurchaseBox />
            <PurchaseSlotRI />
            <ParseOrderInput />
            <LaunchpadIDO />
            <LaunchpadStake />
            <LaunchpadWithdrawStake />
            <ListingAndPurchase />
            <MintERC721 />
            <DeployContractERC721 />
        </div>
    )
}

export default MetamaskInteract
