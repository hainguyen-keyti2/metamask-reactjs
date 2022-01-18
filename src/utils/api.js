import axios from 'axios'
import {BASE_URI} from'./config'

export const loginAction = async (body) => {
    return axios.post(`${BASE_URI}/login`, body)
    .then(rs => {
        return rs.data.status?rs.data.result:rs.data.error.details?(`${rs.data.error.message} - ${rs.data.error.details}`):rs.data.error.message
    })
    .catch((error) => {
        console.log('Error at login kiaaaaa')
        console.log(error)
    });
}

export const listingAction = async (body) => {
    console.log(body)
    return axios.post(`${BASE_URI}/listing`, body)
    .then(rs => {
        console.log(rs)
        return rs.data.status?rs.data.result:rs.data.error.details?(`${rs.data.error.message} - ${rs.data.error.details}`):rs.data.error.message
    })
    .catch((error) => {
        console.log('Error at login kiaaaaa')
        console.log(error)
    });
}

export const getOrderInputAction = async (body) => {
    return axios.post(`${BASE_URI}/get-order-input`, body)
    .then(rs => {
        return rs.data.status?rs.data.result.input_encode:rs.data.error.details?(`${rs.data.error.message} - ${rs.data.error.details}`):rs.data.error.message
    })
    .catch((error) => {
        console.log('Error at login kiaaaaa')
        console.log(error)
    });
}

export const getBoxInputAction = async (body) => {
    return axios.post(`${BASE_URI}/get-box-input`, body)
    .then(rs => {
        return rs.data.status?rs.data.result.input_encode:rs.data.error.details?(`${rs.data.error.message} - ${rs.data.error.details}`):rs.data.error.message
    })
    .catch((error) => {
        console.log('Error at login kiaaaaa')
        console.log(error)
    });
}

export const getParseBoxParse = async (txHash) => {
    return axios.get(`${BASE_URI}/get-parse-box-paid`, {
        params: {
            tx_hash: txHash
        }
    })
    .then(rs => {
        console.log(rs.data.status?rs.data.result:rs.data.error.details?(`${rs.data.error.message} - ${rs.data.error.details}`):rs.data.error.message)
        return rs.data.status?rs.data.result:rs.data.error.details?(`${rs.data.error.message} - ${rs.data.error.details}`):rs.data.error.message
    })
    .catch((error) => {
        console.log('Error at login kiaaaaa')
        console.log(error)
    });
}
