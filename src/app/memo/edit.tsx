import {
  View,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Alert
} from 'react-native'
import CircleButton from '@/components/CircleButton'
import Icon from '@/components/Icon'
import { router, useLocalSearchParams } from 'expo-router'
import { useState, useEffect } from 'react'
import { Timestamp, doc, getDoc, setDoc } from 'firebase/firestore'
import { db, auth } from '@/config'
const hadleOnPress = (id: string, body: string): void => {
  if (auth.currentUser === null) {
    return
  }

  const ref = doc(db, `users/${auth.currentUser.uid}/memos`, id)
  setDoc(ref, {
    body,
    updatedAt: Timestamp.fromDate(new Date())
  })
    .then(() => {
      router.back()
    })
    .catch(() => {
      Alert.alert('更新に失敗しました')
    })
}

const Edit = (): JSX.Element => {
  const id = String(useLocalSearchParams().id)
  const [body, setBody] = useState('')
  useEffect(() => {
    if (auth.currentUser === null) {
      return
    }
    const ref = doc(db, `users/${auth.currentUser.uid}/memos`, id)
    getDoc(ref)
      .then((memoDoc) => {
        const remoteBody = memoDoc.data()?.body as string
        setBody(remoteBody)
      })
      .catch(() => {
        Alert.alert('読み込みに失敗しました')
      })
  }, [])
  return (
    <KeyboardAvoidingView style={styles.container} behavior='height'>
      <View style={styles.inputContainer}>
        <TextInput
          multiline
          value={body}
          style={styles.input}
          onChangeText={(text) => {
            setBody(text)
          }}
          autoFocus
        />
      </View>
      <CircleButton
        onPress={() => {
          hadleOnPress(id, body)
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

export default Edit
