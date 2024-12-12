import { StyleSheet, Text, View, Animated as RNAnimated } from 'react-native'
import React, { useEffect, useRef } from 'react'
import NoticeAnimation from '@features/dashboard/NoticeAnimation'
import { NoticeHeight } from '@utils/Scaling'

const NOTICE_HEIGHT = -(NoticeHeight + 12)

const ProductDashboard = () => {

  const noticePosition = useRef(new RNAnimated.Value(NOTICE_HEIGHT)).current

  const slideUp = () => {
    RNAnimated.timing(noticePosition, {
      toValue: NOTICE_HEIGHT,
      duration: 1200, 
      useNativeDriver: false
    })
  }

  const slideDown = () => {
    RNAnimated.timing(noticePosition, {
      toValue: 0,
      duration: 1200, 
      useNativeDriver: false
    })
  }

  useEffect(() => {
    slideDown()
    const timeoutId = setTimeout(() => {
      slideUp()
    }, 3500)

    return () => clearTimeout(timeoutId)
  }, [])

  return (
    <NoticeAnimation noticePosition={noticePosition}>
      <View>
        <Text>ProductDashboard</Text>
      </View>
    </NoticeAnimation>
  )
}

export default ProductDashboard

const styles = StyleSheet.create({})