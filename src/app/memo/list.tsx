import { View, StyleSheet, FlatList } from 'react-native'
import MemoListItem from '@/components/MemoListItem'
import CircleButton from '@/components/CircleButton'
import Icon from '@/components/Icon'
import { router, useNavigation } from 'expo-router'
import { useEffect, useState } from 'react'
import LogoutButton from '@/components/LogoutButton'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db, auth } from '@/config'
import { type Memo } from 'types/memo'

const onPress = (): void => {
  router.push('/memo/create')
}

const List = (): JSX.Element => {
  const [memos, setMemos] = useState<Memo[]>([])
  const navigation = useNavigation()
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <LogoutButton />
    })
  }, [])
  useEffect(() => {
    if (auth.currentUser == null) {
      return
    }
    const ref = collection(db, `users/${auth.currentUser.uid}/memos`) // データベースへの参照
    const q = query(ref, orderBy('updatedAt', 'desc')) // クエリの作成(並び替えやフィルタリングを行う場合はここで行う)
    // onSnapshotでリアルタイムでデータを取得
    // 返り値はsnapshotの監視を解除する関数
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const remoteMemos: Memo[] = []
      // snapshotの中には配列形式でデータが格納されている。
      snapshot.forEach((doc) => {
        const { body, createdAt, updatedAt } = doc.data()
        remoteMemos.push({
          id: doc.id,
          body,
          createdAt,
          updatedAt
        })
      })
      setMemos(remoteMemos)
    })

    // コンポーネントがアンマウントされた時に監視を解除する
    return unsubscribe
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
