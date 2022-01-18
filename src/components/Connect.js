import React, { useState, useEffect } from 'react';
import { Button, Card, Input, Tag, Modal } from 'antd';
import { ethers } from 'ethers'
import { CHAIN_INFO } from '$/src/utils/config'

let isOpenModal = false

function Connect() {
    const [address, setAddress] = useState('');
    const [network, setNetwork] = useState('97');

    useEffect(() => {
        if (Number(network) !== 97 && !isOpenModal) changeChain()
      }, [network]);

    useEffect(() => {
    // Auto connect to metamask
        handleConnect()
    }, []);

    // Listen metamask change account
    window.ethereum.on('accountsChanged', newAccounts => {
        setAddress(newAccounts)
    });

    // Listen metamask change network
    window.ethereum.on('chainChanged', newNetwork => {
        setNetwork(parseInt(newNetwork, 16).toString())
    });

    const changeChain = async () => {
        isOpenModal = true
        Modal.warning({
          title: 'Switch chain request',
          content: 'The marketplace is being operated on the Binance Smart Chain Testnet. Please switch to that chain!',
          okText: 'Switch to BSC',
          async onOk() {
            await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [CHAIN_INFO],
            });
            isOpenModal = false
          },
        });
    }

    const handleConnect = async () => {
        window.provider = new ethers.providers.Web3Provider(window.ethereum)
        window.signer = window.provider.getSigner()
        const newAccounts = await window.ethereum.request({
            method: 'eth_requestAccounts',
        });
        setAddress(newAccounts)
        setNetwork(window.ethereum.networkVersion)
    };

    window.mainAddress = address[0]

    return (
        <Card title={<Button type="text" onClick={handleConnect} style={{ color: 'magenta', border: '1px solid red'}}>Connect</Button>} style={{ width: 1000 }}>
            <Tag color="volcano">Address</Tag>
            <Input value={address} disabled/>
            <Tag color="volcano">Network</Tag>
            <Input value={network} disabled/>
        </Card>
    )
}

export default Connect