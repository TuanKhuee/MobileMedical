import { appAxios } from '@service/apiInterceptors';
import { BASE_URL } from '@service/config';
import { useAuthStore } from '@state/authStorage';
import { tokenStorage } from '@state/storage';
import { resetAndNavigate } from '@utils/NavigationUtils';
import axios from 'axios';

export const customerLogin = async(phone: string) => {
    try {
        const response = await axios.post(`${BASE_URL}/customer/login`, {phone})
        const {accessToken, refreshToken, deliveryPartner} = response.data
        tokenStorage.set("accessToken", accessToken)
        tokenStorage.set("refreshToken", refreshToken)
        const { setUser } = useAuthStore.getState();
        setUser(deliveryPartner);
    } catch (error) {
        console.log("Login Error", error)
    }
}

export const deliveryLogin = async(email: string, password: string) => {
    try {
        const response = await axios.post(`${BASE_URL}/delivery/login`, { email, password })
        const {accessToken, refreshToken, customer} = response.data
        tokenStorage.set("accessToken", accessToken)
        tokenStorage.set("refreshToken", refreshToken)
        const { setUser } = useAuthStore.getState();
        setUser(response.data.customer);
    } catch (error) {
        console.log("Login Error", error)
    }
}

export const refetchUser = async(setUser: any) => {
    try {
        const response = await appAxios.get(`/user`)
        
        setUser(response.data.user);
    } catch (error) {
        console.log("Login Error", error)
    }
}

export const refresh_tokens = async() => {
    try {
        const refreshToken = tokenStorage.getString('refreshToken')
        const response = await axios.post(`${BASE_URL}/refresh-token`, {
            refreshToken
        })

        const new_access_token = response.data.accessToken
        const new_refresh_token = response.data.refreshToken

        tokenStorage.set('accessToken', new_access_token);
        tokenStorage.set('refreshToken', new_refresh_token);
        return new_access_token;
    } catch (error) {
        console.log("refresh token Error", error);
        tokenStorage.clearAll();
        resetAndNavigate("CustomerLogin")
    }
}
