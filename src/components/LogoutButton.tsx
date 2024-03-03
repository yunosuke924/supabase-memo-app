import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native'
import { supabase } from '@/supabase'
import { router } from 'expo-router'

const handleOnPress = (): void => {
  supabase.auth.signOut().then((): void => {
    router.replace('/auth/log_in')
  }).catch((): void => {
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
