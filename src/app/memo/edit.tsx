import {
  View,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView
} from 'react-native'
import CircleButton from '@/components/CircleButton'
import Icon from '@/components/Icon'
import { router, useLocalSearchParams } from 'expo-router'
import { useState, useEffect } from 'react'
import { supabase } from '@/supabase'
const hadleOnPress = async (id: string, body: string): Promise<void> => {
  const { error } = await supabase
    .from('memos')
    .update({ body })
    .eq('id', id)
    .select()

  if (error != null) {
    alert('Error updating memo')
  }

  router.back()
}

const Edit = (): JSX.Element => {
  const id = String(useLocalSearchParams().id)
  const [body, setBody] = useState('')
  useEffect(() => {
    const getMemo = async (id: string): Promise<void> => {
      const { data } = await supabase.auth.getSession()
      const userId = data.session?.user.id
      try {
        const { data } = await supabase
          .from('memos')
          .select('*')
          .eq('id', id)
          .eq('user_uid', userId)
        if (data != null) {
          setBody(data[0].body as string)
        }
      } catch (error) {
        alert('Error loading user data!')
      }
    }

    void getMemo(id)
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
          void hadleOnPress(id, body)
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
