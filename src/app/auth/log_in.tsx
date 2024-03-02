import Button from '@/components/Button'
import { Link, router } from 'expo-router'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert
} from 'react-native'
import { auth } from '@/config'

const handleOnPress = (email: string, password: string): void => {
  signInWithEmailAndPassword(auth, email, password)
    .then((credential) => {
      console.log(credential.user.uid)
      router.replace('/memo/list')
    })
    .catch((e) => {
      const { message } = e as { message: string }
      Alert.alert(message)
    })
}

const Login = (): JSX.Element => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>ログイン</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={(text) => {
            setEmail(text)
          }}
          autoCapitalize='none'
          keyboardType='email-address'
          placeholder='メールアドレス'
          textContentType='emailAddress'
        />
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={(text) => {
            setPassword(text)
          }}
          autoCapitalize='none'
          secureTextEntry
          placeholder='パスワード'
          textContentType='password'
        />
        <Button
          label='ログイン'
          onPress={() => {
            handleOnPress(email, password)
          }}
        />
        <View style={styles.footer}>
          <Text style={styles.footerText}>アカウントをお持ちでない方は</Text>
          <Link href='/auth/sign_up' asChild replace>
            <TouchableOpacity>
              <Text style={styles.footerTextLink}>こちら</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  inner: {
    paddingHorizontal: 27,
    paddingVertical: 32
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: 'bold',
    marginBottom: 24
  },
  input: {
    fontSize: 16,
    height: 48,
    borderColor: '#ddd',
    borderWidth: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    marginBottom: 16
  },
  footer: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 24
  },
  footerText: {
    fontSize: 14,
    lineHeight: 24
  },
  footerTextLink: {
    fontSize: 14,
    lineHeight: 24,
    color: '#467fd3'
  }
})

export default Login
