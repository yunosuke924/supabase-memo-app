import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native'
import { signOut } from 'firebase/auth'
import { router } from 'expo-router'
import { auth } from '@/config'

const handleOnPress = (): void => {
  signOut(auth)
    .then(() => {
      router.replace('/auth/log_in')
    })
    .catch(() => {
      Alert.alert('ログアウトに失敗しました')
    })
}

const LogoutButton = (): JSX.Element => {
  return (
    <TouchableOpacity onPress={handleOnPress}>
      <Text style={styles.container}>ログアウト</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    fontSize: 12,
    lineHeight: 24,
    color: 'rgba(255, 255, 255, 0.6)'
  }
})

export default LogoutButton
