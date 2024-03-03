import {
  View,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Alert
} from 'react-native'
import CircleButton from '@/components/CircleButton'
import Icon from '@/components/Icon'
import { useState } from 'react'
import { supabase } from '@/supabase'
import { router } from 'expo-router'
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const handleOnPress = async (body: string) => {
  const { data } = await supabase.auth.getSession()
  const userId = data.session?.user.id
  const { error } = await supabase
    .from('memos')
    .insert([
      { body, user_uid: userId }
    ])
    .select()

  if (error != null) {
    Alert.alert('作成に失敗しました')
  }

  router.back()
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
          void handleOnPress(body)
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
