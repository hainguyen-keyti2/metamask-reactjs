import React from 'react';
import MintERC721 from '$/src/components/MintERC721'
import Connect from '$/src/components/Connect'
import Login from '$/src/components/Login'
import ListingAndPurchase from '$/src/components/ListingAndPurchase'
import DeployContractERC721 from '$/src/components/DeployContractERC721'
import ApproveForAllERC721 from '$/src/components/ApproveForAllERC721'
import ApproveOneERC721 from '$/src/components/ApproveOneERC721'
import ApproveAllERC20 from '$/src/components/ApproveAllERC20'
import ApproveERC20 from '$/src/components/ApproveERC20'
import PurchaseBox from '$/src/components/PurchaseBox'
import PurchaseToken from '$/src/components/PurchaseToken'

function MetamaskInteract() {
    return (
        <div>
            <Connect/>
            <Login/>
            <ApproveForAllERC721/>
            <ApproveOneERC721/>
            <ApproveAllERC20/>
            <ApproveERC20/>
            <PurchaseBox/>
            <PurchaseToken/>
            <ListingAndPurchase/>
            <MintERC721/>
            <DeployContractERC721/>
        </div>
    )
}

export default MetamaskInteract
