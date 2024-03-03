import { View, StyleSheet, FlatList } from 'react-native'
import MemoListItem from '@/components/MemoListItem'
import CircleButton from '@/components/CircleButton'
import Icon from '@/components/Icon'
import { router, useNavigation } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import LogoutButton from '@/components/LogoutButton'
import { type Memo } from 'types/memo'
import { supabase } from '@/supabase'

const onPress = (): void => {
  router.push('/memo/create')
}

const List = (): JSX.Element => {
  const navigation = useNavigation()
  const [memos, setMemos] = useState<Memo[]>([])

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const fetchRealTimeMemo = () => {
    try {
      supabase
        .channel('memo_list')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'memos' }, (payload) => {
          if (payload.eventType === 'DELETE') {
            setMemos((prev) => prev.filter((m) => m.id !== payload.old.id))
          }
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const memo = payload.new as Memo
            setMemos((prev) => {
              const newMemos = prev.filter((m) => m.id !== memo.id)
              newMemos.push(memo)
              return newMemos
            })
          }
        })
        .subscribe()

      return async () => {
        await supabase.channel('memos').unsubscribe()
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getMemos = useCallback(async () => {
    const { data } = await supabase.auth.getSession()
    const userId = data.session?.user.id
    try {
      const { data } = await supabase
        .from('memos')
        .select('*')
        .eq('user_uid', userId)
      if (data != null) {
        setMemos(data)
      }
    } catch (error) {
      alert('Error loading user data!')
    }
  }, [supabase])

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <LogoutButton />
    })
  }, [])

  useEffect(() => {
    fetchRealTimeMemo()
    void getMemos()
  }, [])

  return (
    <View style={Styles.constainer}>
      <FlatList
        data={memos}
        renderItem={({ item }) => <MemoListItem memo={item} />}
      />
      <CircleButton onPress={onPress}>
        <Icon name='plus' size={40} color='#fff' />
      </CircleButton>
    </View>
  )
}

const Styles = StyleSheet.create({
  constainer: {
    flex: 1, // 画面いっぱいに広げる
    backgroundColor: '#fffff'
  }
})

export default List
