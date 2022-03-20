import React, { useState } from "react"
import { Button, Card, Input, Tag } from "antd"
import { LOGIN_MESSAGE } from "../utils/config"
import { loginAction } from "../utils/api"
import moment from "moment"

function Login() {

    const [login, setLogin] = useState({
        signature: "",
        time: "",
        address: "",
        resultLogin: ""
    })

    const handleLogin = async () => {
        const time = moment().unix()
        // eslint-disable-next-line no-undef
        const data = `0x${Buffer.from(LOGIN_MESSAGE, "utf8").toString("hex")}`
        const signature = await window.ethereum.request({
            method: "personal_sign",
            params: [data, window.mainAddress],
        })
        // const recoveryAddress = recoverPersonalSignature({
        //     data,
        //     signature,
        // });
        const result = await loginAction({
            signature,
            timestamp: time,
            address: window.mainAddress
        })

        setLogin(() => {
            return {
                signature,
                time,
                address: window.mainAddress,
                resultLogin: result
            }
        })
    }

    return (
        <Card title={<Button type="text" onClick={handleLogin} style={{ color: "magenta", border: "1px solid red" }}>Login</Button>} style={{ width: 1000 }}>
            <Tag color="volcano">Unix timestamp</Tag>
            <Input value={login.time} disabled />
            <Tag color="volcano">Signature</Tag>
            <Input.TextArea rows={2} value={login.signature} disabled />
            <Tag color="volcano">Address</Tag>
            <Input value={login.address} disabled />
            <Tag color="volcano">Result login</Tag>
            <Input value={login.resultLogin} disabled />
        </Card>
    )
}

export default Login
