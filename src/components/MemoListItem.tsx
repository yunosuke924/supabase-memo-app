import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import Icon from './Icon'
import { Link } from 'expo-router'
import { type Memo } from 'types/memo'
import { supabase } from '@/supabase'

interface Props {
  memo: Memo
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const handleOnPress = async (id: string) => {
  const { error } = await supabase
    .from('memos')
    .delete()
    .eq('id', id)

  if (error != null) {
    Alert.alert('削除に失敗しました')
  }
}
const MemoListItem = ({ memo }: Props): JSX.Element | null => {
  const { id, body, created_at: createdAt, updated_at: UpdatedAt } = memo

  if (
    id === null ||
    body === null ||
    createdAt === null ||
    UpdatedAt === null
  ) {
    return null
  }

  const dateString = UpdatedAt.toString()

  return (
    <Link
      href={{
        pathname: '/memo/detail',
        params: { id }
      }}
      asChild
    >
      <TouchableOpacity style={Styles.memoListItem}>
        <View>
          <Text style={Styles.memoListItemTitle} numberOfLines={1}>
            {body}
          </Text>
          <Text style={Styles.memoListItemDate}>{dateString}</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            void handleOnPress(id)
          }}
        >
          <Icon name='delete' size={24} color='#b0b0b0' />
        </TouchableOpacity>
      </TouchableOpacity>
    </Link>
  )
}

const Styles = StyleSheet.create({
  memoListItem: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 19,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.15)'
  },
  memoListItemTitle: {
    fontSize: 16,
    lineHeight: 32
  },
  memoListItemDate: {
    fontSize: 12,
    lineHeight: 16,
    color: '#848484'
  }
})

export default MemoListItem
