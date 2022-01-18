import React, { useState, useEffect } from 'react';
import { Button, Space, Card, Input, Tag, Form } from 'antd';
import 'antd/dist/antd.css';
import { ethers, utils } from "ethers";
import {
    encrypt,
    recoverPersonalSignature,
    recoverTypedSignatureLegacy,
    recoverTypedSignature,
    recoverTypedSignature_v4 as recoverTypedSignatureV4,
    SignTypedDataVersion
  } from '@metamask/eth-sig-util';
import axios from 'axios'
import moment from 'moment';


// DOMAIN SEPARATOR data  use for eip712 to sign type data
const domain = {
    name: 'SIGN FOR SELL',
    version: '1',
    chainId: 97,
    verifyingContract: '0x74fa719D0e073E68642c8a2C49203A9546ecB392'
};
// Order data use for buyer to buy NFT
const order = {
    NFT: {
        tokenId: 0,
        price: "0.012 ETH",
        tokenContract: '0xD433D84BF68A6F6aB97B35104509E9Ab667BfE74'
    },
    MoreInfo: {
        paymentContract: '0x0000000000000000000000000000000000000000',
        amount: utils.parseUnits("0.012", "ether"),
        royaltyFeePercent: 2000,
        tokenCreator: '0x66C70A059eDD2406f4172821e0C44937e3A2E4f9'
    }
};

// Exprire time is epoch times when buyer request buy a NFT
const exprireTime = 1639117618

function TempMetamask() {
    const [address, setAddress] = useState('');
    const [network, setNetwork] = useState('');
    const [domainEip712, setEip712Domain] = useState('');
    const [eip712, setEip712] = useState('');
    const [eip191, setEip191] = useState('');
    const [encodeData, setEncodeData] = useState('');
    const [encodeInitialData, setEncodeInitialData] = useState('');
    const [login, setLogin] = useState({
        signature: '0x',
        time: '---',
        address: '0x'
    });
    const [jwtToken, setJwtToken] = useState('');

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
        setNetwork(newNetwork)
    });

    // The way appication can connect to metamask
    const handleConnect = async () => {
        window.provider = new ethers.providers.Web3Provider(window.ethereum)
        window.signer = window.provider.getSigner()
          const newAccounts = await window.ethereum.request({
            method: 'eth_requestAccounts',
          });
          setAddress(newAccounts)
          setNetwork(window.ethereum.networkVersion)
    };

    // This method use for get bytes32 DOMAIN_SEPARATOR in EIP712 sign
    const handleGetEIP712Domain = () => {
        // Use "utils.keccak256(utils.defaultAbiCoder.encode()" for "keccak256(abi.encode(...)" in Solidity"
        const DOMAIN_SEPARATOR = utils.keccak256(utils.defaultAbiCoder.encode(
                ["bytes32", "bytes32", "bytes32", "uint256", "address"],
                [
                    utils.keccak256(Buffer.from("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)")),
                    utils.keccak256(Buffer.from(domain.name)),
                    utils.keccak256(Buffer.from(domain.version)),
                    domain.chainId,
                    domain.verifyingContract
                ]
            ))
        console.log(DOMAIN_SEPARATOR)
        setEip712Domain(DOMAIN_SEPARATOR)
    }
    // This method use EIP191 to get seller signature
    const handleSignMessageEIP712 = async () => {
        const types = {
            NFT: [
                { name: 'tokenId', type: 'uint256' },
                { name: 'price', type: 'string' },
                { name: 'tokenContract', type: 'address' },
            ],
            Detail: [
                { name: 'paymentContract', type: 'address' },
                { name: 'amount', type: 'uint256' },
                { name: 'royaltyFeePercent', type: 'uint256' },
                { name: 'tokenCreator', type: 'address' },
            ],
            Order: [
                { name: 'NFT', type: 'NFT' },
                { name: 'MoreInfo', type: 'Detail' },
            ],
        };
        // Ethers signer._signTypedData is just experimental of version 5.5.1
        // _signTypedData => signTypedData. Please check and update to non-experimental
        const signature = await window.signer._signTypedData(domain, types, order);
        console.log(signature)
        setEip712(signature)
    }

///
const msgParams = {
    types: {
        EIP712Domain: [
            { name: "name", type: "string"},
            { name: "version", type: "string"},
            { name: 'chainId', type: 'uint256' },
            { name: 'verifyingContract', type: 'address' }
        ],
        Detail: [
            { name: 'tokenId', type: 'uint256' },
            { name: 'tokenContract', type: 'address' },
            { name: 'price', type: 'uint256' },
            { name: 'decimals', type: 'uint256' },
            { name: 'paymentContract', type: 'address' },
            { name: 'foundationFeePercent', type: 'uint256' },
            { name: 'royaltyFeePercent', type: 'uint256' },
            { name: 'tokenCreator', type: 'address' }
        ],
        Order: [
            { name: 'more', type: 'Detail' },
        ],
    },
    primaryType: "Order",
    domain,
    message: {
        info: {
            id: 0,
            name: 'Bepple version 222',
            collectible: 'Bepple famous collection in the word',
            price: "1.1 ETH",
            foundationFee: "3%",
            royaltyFee: "2%",
            realRecieve: "1.1 ETH",
            time: moment().unix()
        },
        more: {
            tokenId: 0,
            tokenContract: '0xD433D84BF68A6F6aB97B35104509E9Ab667BfE74',
            price: utils.parseUnits("15", "ether").toString(),
            decimals: 18,
            paymentContract: '0x8559e768764D56F4d6F578E91cA0fdD2D70B20cb',
            foundationFeePercent: 0,
            royaltyFeePercent: 0,
            tokenCreator: '0x0000000000000000000000000000000000000000'
        },
    },

}
    const handleRecoverMessageEIP712 = async () => {

        // const addressRecover =  recoverTypedSignature({
        //     data: {
        //         types,
        //         primaryType: "Order",
        //         domain,
        //         message: order
        //     },
        //     signature: "0xd1a31b510bbcdcad395275f231c7f2e3ca55ba10f8160ecf19e44a9f810466135667adabe058adaabf72197e041a4bc6bddd42d106549bb36e9cdeebc2e930561b",
        //     version: "V3"
        // })
    //[[0,"0.012 ETH","0xD433D84BF68A6F6aB97B35104509E9Ab667BfE74"],["0x0000000000000000000000000000000000000000",12000000000000000,2000,"0x66C70A059eDD2406f4172821e0C44937e3A2E4f9"]]
        // console.log(new BN('12000000000000000000', 16))
        // console.log(utils.parseUnits("0.012", "ether").toHexString())

        const sign = await window.ethereum.request({
            method: 'eth_signTypedData_v4',
            params: [address[0], JSON.stringify(msgParams)],
          });
        console.log(sign)
        console.log(JSON.stringify(msgParams))

        // const rs = await axios.post('/user', {
        //     firstName: 'Fred',
        //     lastName: 'Flintstone'
        //   })
        //   .then(function (response) {
        //     console.log(response);
        //   })
        //   .catch(function (error) {
        //     console.log(error);
        //   });

        const addressRecover = recoverTypedSignature({
            data: msgParams,
            version: "V4",
            signature: sign,
          });
        console.log(addressRecover)
        // let typedDataEncoder = utils._TypedDataEncoder.getPayload(msgParams.domain, msgParams.types, msgParams.message)
        // console.log(typedDataEncoder)
        // console.log(msgParams)
        // console.log(JSON.stringify(typedDataEncoder))
        // console.log(JSON.stringify(msgParams))
    }

    // This method use EIP191 to get verifier signature
    // Cái này dùng được trong solidity, con cách recorery ở js ntn thì k biết
    const handleSignMessageEIP191 = async () => {
        let a = utils.arrayify(Buffer.from(JSON.stringify(order), 'utf8'))
        // Used "utils.arrayify(utils.solidityKeccak256()" for "keccak256(abi.encodePacked(...)" in Solidity
        // This method include (arrayify and solidityKeccak256) is equal abi.soliditySHA3()
        // Use this method instead of ethereumjs-abi.soliditySHA3() order to can use utils.parseUnits("0.012", "ether") [ethers Bignumber]
        // ethereumjs-abi.soliditySHA3() can not use [ethers Bignumber], just can use BN.js
        // ethers.utils.solidityKeccak256 = web3.utils.soliditySha3()
        const Uint8ArrayData = utils.arrayify(utils.solidityKeccak256(
            ["uint256", "address", "uint256", "uint256", "address", "uint256", "uint256", "address", "uint256", "address"],
            [
                msgParams.message.more.tokenId,
                msgParams.message.more.tokenContract,
                msgParams.message.more.price,
                msgParams.message.more.decimals,
                msgParams.message.more.paymentContract,
                msgParams.message.more.foundationFeePercent,
                msgParams.message.more.royaltyFeePercent,
                msgParams.message.more.tokenCreator,
                exprireTime,
                domain.verifyingContract
            ]
        ))
        console.log(Uint8ArrayData)
        const signatureEIP191 = await window.signer.signMessage(Uint8ArrayData)
        console.log(signatureEIP191)
        console.log(utils.recoverAddress(Uint8ArrayData,signatureEIP191))
        setEip191(signatureEIP191)
    }
// Cái này có thể sign và recovery tại js được, không hiểu sao không được ở solidity
    const handleRecoverMessageEIP191 = async () => {
        const Uint8ArrayData = utils.solidityKeccak256(
            ["uint256", "address", "uint256", "uint256", "address", "uint256", "uint256", "address", "uint256", "address"],
            [
                msgParams.message.more.tokenId,
                msgParams.message.more.tokenContract,
                msgParams.message.more.price,
                msgParams.message.more.decimals,
                msgParams.message.more.paymentContract,
                msgParams.message.more.foundationFeePercent,
                msgParams.message.more.royaltyFeePercent,
                msgParams.message.more.tokenCreator,
                exprireTime,
                domain.verifyingContract
            ]
        )
        console.log(            [
            msgParams.message.more.tokenId,
            msgParams.message.more.tokenContract,
            msgParams.message.more.price,
            msgParams.message.more.decimals,
            msgParams.message.more.paymentContract,
            msgParams.message.more.foundationFeePercent,
            msgParams.message.more.royaltyFeePercent,
            msgParams.message.more.tokenCreator,
            exprireTime,
            domain.verifyingContract
        ])
      const msg = Uint8ArrayData;
      console.log(Uint8ArrayData)
      const ethResult = await window.ethereum.request({
        method: 'eth_sign',
        params: [address[0], msg],
      });
      console.log(ethResult)
      console.log(utils.recoverAddress(Uint8ArrayData,ethResult))
    }


    const handleLogin = async () => {
        const time = moment().unix()
        const mess = `Please sign this message to login into this website with address: ${address[0].toLowerCase()} at time: ${time}`
        const data = `0x${Buffer.from(mess, 'utf8').toString('hex')}`
        const signature = await window.ethereum.request({
            method: 'personal_sign',
            params: [data, address[0]],
        });
        const recoveryAddress = recoverPersonalSignature({
            data,
            signature,
        });
        setLogin(() => {
            return {
                signature,
                time,
                address: recoveryAddress
            }
        })
    }

    const handleUpdateProfile = async () => {
        const mess = {
            userName: "Khong co gi",
            bio: "Khong co gi de gio thieu het~~~",
            time: moment().unix()
        }
        const data = `0x${Buffer.from(JSON.stringify(mess), 'utf8').toString('hex')}`
        const signature = await window.ethereum.request({
            method: 'personal_sign',
            params: [data, address[0]],
        });
        console.log(signature)
        const recoveredAddr = recoverPersonalSignature({
            data,
            signature,
        });
        console.log(recoveredAddr)
    }

    // This method return encode data which is parameter use for method "orderERC721(bytes)" in smart contract
    const handleEncodeData = () => {
        // Tuple Order example:
        // [[0,"0.012 ETH","0xD433D84BF68A6F6aB97B35104509E9Ab667BfE74"],["0x0000000000000000000000000000000000000000",12000000000000000,2000,"0x66C70A059eDD2406f4172821e0C44937e3A2E4f9"]]
        const encode = utils.defaultAbiCoder.encode(
            ["uint256", "bytes32", "tuple(tuple(uint256, string, address), tuple(address, uint256, uint256, address))", "bytes", "bytes"],
            [
                exprireTime,
                domainEip712,
                [
                    [
                        order.NFT.tokenId,
                        order.NFT.price,
                        order.NFT.tokenContract
                    ],
                    [
                        order.MoreInfo.paymentContract,
                        order.MoreInfo.amount,
                        order.MoreInfo.royaltyFeePercent,
                        order.MoreInfo.tokenCreator
                    ]
                ],
                "0xf653e37f372626bc00f9fb049ee84a8c2dcda61ddf2c8fd02fb0135356fee8f00935f5c02fe85c0897955a2d715f0104995762c78d9d0e5aed05919e6bd35a441b",
                eip191
            ]
        )
        console.log(encode)
        setEncodeData(encode)
    }

    const handleEncodeInitalizeProxy = () => {
        const ABI = [{
            "inputs": [
                {
                    "internalType": "address payable",
                    "name": "_foundation",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "_verifier",
                    "type": "address"
                }
            ],
            "name": "initialize",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }]
        let iface = new utils.Interface(ABI);
        const encodeInitialize = iface.encodeFunctionData("initialize", ["0x419C17B6907ccc5118cC94A544d44FD6185cBF03", "0x3dDd5Fa359470B499162D67DdAfa9D7eEc94Acc3"])
        console.log(encodeInitialize)
        setEncodeInitialData(encodeInitialize)
    }

    const handleChangeJWTToken = (e) => {
        e.defaultPrevented = true
        setJwtToken(e.target.value)
    }

    const onSubmitUpdateProfile = (values) => {
        console.log('Success:', values);
    };
    return (
        <div>
            <div>
                <h5>Address: {address}</h5>
                <h5>Network: {network}</h5>
            </div>
            <button style={{padding: '10px', marginTop: '10px'}} onClick={handleConnect} >Connect</button>
            <br/>
            <div>
                <button style={{padding: '10px', marginTop: '10px'}} onClick={handleGetEIP712Domain} >Get domain EIP712(Contract domain)</button>
                <br/>
                <textarea style={{width: '500px', height: '60px', paddingRight: '15px'}} disabled value={domainEip712}/>
            </div>
            <br/>
            <div>
                <button style={{padding: '10px', marginTop: '10px'}} onClick={handleSignMessageEIP712} >Sign message EIP712(Seller)</button>
                <br/>
                <textarea style={{width: '500px', height: '60px', paddingRight: '15px'}} disabled value={eip712}/>
                <button style={{padding: '10px', marginTop: '10px', backgroundColor: 'red'}} onClick={handleRecoverMessageEIP712} >Recover message EIP712(Seller)</button>
            </div>
            <br/>
            <div>
                <button style={{padding: '10px', marginTop: '10px', backgroundColor: 'red'}} onClick={handleSignMessageEIP191} >Sign message EIP191(Verifier)</button>
                <br/>
                <textarea style={{width: '500px', height: '60px', paddingRight: '15px'}} disabled value={eip191}/>
                <button style={{padding: '10px', marginTop: '10px'}} onClick={handleRecoverMessageEIP191} >Recover message EIP191(Verifier)</button>
            </div>
            <br/>
            <div>
                <button style={{padding: '10px', marginTop: '10px'}} onClick={handleEncodeData} >Encode data(Buyer)</button>
                <br/>
                <textarea style={{width: '500px', height: '60px', paddingRight: '15px'}} disabled value={encodeData}/>
            </div>
            <br/>
            <div>
                <button style={{padding: '10px', marginTop: '10px'}} onClick={handleEncodeInitalizeProxy} >Encode initialize for upgrade proxy(Admin)</button>
                <br/>
                <textarea style={{width: '500px', height: '60px', paddingRight: '15px'}} disabled value={encodeInitialData}/>
            </div>
            <br/>
            <div>
                <button style={{padding: '10px', marginTop: '10px', backgroundColor: 'red'}} onClick={handleLogin} >Login</button>
                <br/>
                <button style={{padding: '10px', marginTop: '10px', backgroundColor: 'red'}} onClick={handleUpdateProfile} >Update profile</button>
            </div>
            <Space size={30}>
                <Button type="danger" shape="round" size="large">Connect</Button>
                <Button type="primary" shape="round" size="large">Update Profile</Button>
            </Space>

            <Space direction="vertical">
            <Card title={<Button type="text" onClick={handleLogin} style={{ color: 'magenta' }}>Login</Button>} style={{ width: 1000 }}>
                <Input.TextArea rows={2} value={login.signature} disabled />
                <Tag color="volcano">{login.time}</Tag>
                <Tag color="geekblue">{login.address}</Tag>
                <Input placeholder="Input JWT token" value={jwtToken} onChange={handleChangeJWTToken}/>
            </Card>
            <Card title={<Button type="text" disabled style={{ color: 'magenta' }}>Update profile</Button>} style={{ width: 1000 }}>
                <Form
                    name="Update profile"
                    initialValues={{ remember: true }}
                    onFinish={onSubmitUpdateProfile}
                    autoComplete="off"
                    >
                    <Form.Item
                        label="Username"
                        name="userName"
                        rules={[{ required: true, message: 'Please input your Username!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Bio"
                        name="bio"
                        rules={[{ required: true, message: 'Please input your Bio!' }]}
                    >
                        <Input.TextArea rows={4} />
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                        Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
            <Card title={<Button type="text" style={{ color: 'magenta' }}>Encode initialize for upgrade proxy(Admin)</Button>} style={{ width: 1000 }}>
                <Input.TextArea rows={4} disabled />
            </Card>
            </Space>
        </div>
    )
}

export default TempMetamask
