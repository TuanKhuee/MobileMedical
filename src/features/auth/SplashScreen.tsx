import { StyleSheet, Text, View, Image, Alert } from 'react-native'
import React, { useEffect } from 'react'
import { Colors } from '@utils/Constants'
import Logo from '@assets/images/splash_logo.jpeg'
import { screenHeight, screenWidth } from '@utils/Scaling'
import GeoLocation from '@react-native-community/geolocation'
import { useAuthStore } from '@state/authStorage'
import { tokenStorage } from '@state/storage'
import { resetAndNavigate } from '@utils/NavigationUtils'
import { jwtDecode } from 'jwt-decode'
import { refetchUser, refresh_tokens } from '@service/authService'

GeoLocation.setRNConfiguration({
  skipPermissionRequests: false,
  authorizationLevel: 'always',
  enableBackgroundLocationUpdates: true,
  locationProvider: 'auto'
})

interface DecodedToken {
  exp: number;
}

const SplashScreen = () => {

  const {user, setUser} = useAuthStore();

  const tokenCheck = async() => {
    const accessToken = tokenStorage.getString('accessToken') as string
    const refreshToken = tokenStorage.getString('refreshToken') as string

    if (accessToken) {
      const decodedAccessToken = jwtDecode<DecodedToken>(accessToken);
      const decodedRefreshToken = jwtDecode<DecodedToken>(refreshToken);

      const currentTime = Date.now()/1000;

      if (decodedRefreshToken?.exp < currentTime) {
        resetAndNavigate('CustomerLogin');
        Alert.alert("Session Expired", "Please Login again");
        return false;
      }

      if (decodedAccessToken?.exp < currentTime) {
        try {
          refresh_tokens();
          await refetchUser(setUser)          
        } catch (error) {
          Alert.alert("There was an error refreshing token!")
          return false
        }
      }

      if (user?.role === 'Customer') {
        resetAndNavigate("ProductDashboard")
      } else {
        resetAndNavigate("DeliveryDashboard")
      }
    }
    resetAndNavigate("CustomerLogin");
    return false;
  }

  useEffect(() => {
    const fetchUserLocation = async () => {
      try {
        GeoLocation.requestAuthorization();
        tokenCheck();
      } catch(error) {
        Alert.alert("Rất tiếc, chúng tôi cần dịch vụ định vị để mang đến cho bạn trải nghiệm mua sắm tốt hơn")
      }
    }
    const timeoutId = setTimeout(fetchUserLocation, 1000);
    return () => clearTimeout(timeoutId);
  }, [])
  
  return (
    <View style={styles.container}>
      <Image source={Logo} style={styles.logoImage} />
    </View>
  )
}

export default SplashScreen

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  logoImage: {
    height: screenHeight * 0.5,
    width: screenWidth * 0.5,
  }
})