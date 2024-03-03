import { View, Text, ScrollView, StyleSheet } from 'react-native'
import CircleButton from '@/components/CircleButton'
import Icon from '@/components/Icon'
import { router, useLocalSearchParams } from 'expo-router'
import { useState, useEffect } from 'react'
import { type Memo } from 'types/memo'
import { supabase } from '@/supabase'

const handleOnPress = (id: string): void => {
  router.push({ pathname: '/memo/edit', params: { id } })
}

const Detail = (): JSX.Element => {
  const id = String(useLocalSearchParams().id)
  const [memo, setMemo] = useState<Memo | null>(null)

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const fetchRealTimeMemo = () => {
    try {
      supabase
        .channel('memos')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'memos' }, (payload) => { setMemo(payload.new as Memo) })
        .subscribe()

      return async () => {
        await supabase.channel('memos').unsubscribe()
      }
    } catch (error) {
      console.log(error)
    }
  }

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
        setMemo(data[0] as Memo)
      }
    } catch (error) {
      alert('Error loading user data!')
    }
  }

  useEffect(() => {
    fetchRealTimeMemo()
    void getMemo(id)
  }, [])
  return (
    <View style={styles.container}>
      <View style={styles.memoHeader}>
        <Text style={styles.memoHeaderTitle} numberOfLines={1}>
          {memo?.body}
        </Text>
        <Text style={styles.memoHeaderDate}>
          {memo?.updated_at.toString()}
        </Text>
      </View>
      <ScrollView style={styles.memoBody}>
        <Text style={styles.memoBodyText}>{memo?.body}</Text>
      </ScrollView>
      {/* 編集ボタン */}
      <CircleButton
        style={{ top: 60, bottom: 'auto' }}
        onPress={() => {
          handleOnPress(id)
        }}
      >
        <Icon name='pencil' size={40} color='#ffffff' />
      </CircleButton>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  memoHeader: {
    backgroundColor: '#467fd3',
    height: 96,
    justifyContent: 'center',
    paddingVertical: 24,
    paddingHorizontal: 19
  },
  memoHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff'
  },
  memoHeaderDate: {
    fontSize: 12,
    lineHeight: 16,
    color: '#fff'
  },
  memoBody: {
    paddingHorizontal: 27
  },
  memoBodyText: {
    paddingVertical: 32,
    fontSize: 16,
    lineHeight: 24,
    color: '#000'
  }
})

export default Detail
