import { Stack } from 'expo-router'

const Layout = (): JSX.Element => (
  <Stack
    screenOptions={{
      headerStyle: {
        backgroundColor: '#467fd3'
      },
      headerTintColor: '#fff',
      headerTitle: 'メモ管理アプリ',
      headerBackTitle: '戻る',
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 22
      }
    }}
  />
)

export default Layout
