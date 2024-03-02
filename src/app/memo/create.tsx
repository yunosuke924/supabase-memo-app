import {
  View,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Alert
} from 'react-native'
import CircleButton from '@/components/CircleButton'
import Icon from '@/components/Icon'
import { router } from 'expo-router'
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { db, auth } from '@/config'
import { useState } from 'react'
const handleOnPress = (body: string): void => {
  if (auth.currentUser == null) {
    return
  }
  const memoRef = collection(db, `users/${auth.currentUser.uid}/memos`)
  addDoc(memoRef, {
    body,
    createdAt: Timestamp.fromDate(new Date()),
    updatedAt: Timestamp.fromDate(new Date())
  })
    .then(() => {
      router.back()
    })
    .catch(() => {
      Alert.alert('メモの作成に失敗しました')
    })
}

const Create = (): JSX.Element => {
  const [body, setBody] = useState('')
  return (
    <KeyboardAvoidingView style={styles.container} behavior='height'>
      <View style={styles.inputContainer}>
        <TextInput
          value={body}
          style={styles.input}
          multiline
          onChangeText={(text) => {
            setBody(text)
          }}
          autoFocus
        />
      </View>
      <CircleButton
        onPress={() => {
          handleOnPress(body)
        }}
      >
        <Icon name='check' size={40} color='#fff' />
      </CircleButton>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  inputContainer: {
    paddingVertical: 32,
    paddingHorizontal: 27,
    flex: 1
  },
  input: {
    flex: 1,
    textAlignVertical: 'top',
    fontSize: 16,
    lineHeight: 24
  }
})

export default Create
