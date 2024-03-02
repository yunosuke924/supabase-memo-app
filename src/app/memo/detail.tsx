import { View, Text, ScrollView, StyleSheet } from 'react-native'
import CircleButton from '@/components/CircleButton'
import Icon from '@/components/Icon'
import { router, useLocalSearchParams } from 'expo-router'
import { useState, useEffect } from 'react'
import { onSnapshot, doc } from 'firebase/firestore'
import { db, auth } from '@/config'
import { type Memo } from 'types/memo'

const handleOnPress = (id: string): void => {
  router.push({ pathname: '/memo/edit', params: { id } })
}
const Detail = (): JSX.Element => {
  const id = String(useLocalSearchParams().id)
  const [memo, setMemo] = useState<Memo | null>(null)
  useEffect(() => {
    if (auth.currentUser === null) {
      return
    }
    const ref = doc(db, `users/${auth.currentUser.uid}/memos`, id)
    const unsubscribe = onSnapshot(ref, (memoDoc) => {
      const { id, body, createdAt, updatedAt } = memoDoc.data() as Memo
      setMemo({
        id,
        body,
        createdAt,
        updatedAt
      })
    })
    return unsubscribe
  }, [id])
  return (
    <View style={styles.container}>
      <View style={styles.memoHeader}>
        <Text style={styles.memoHeaderTitle} numberOfLines={1}>
          {memo?.body}
        </Text>
        <Text style={styles.memoHeaderDate}>
          {memo?.updatedAt.toDate().toLocaleString('ja-JP')}
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
