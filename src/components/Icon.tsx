import { createIconSetFromIcoMoon } from '@expo/vector-icons'

// iconがimportできるかどうかをチェック
import { useFonts } from 'expo-font'
import fontData from '../../assets/fonts/icomoon.ttf'
import fontSelection from '../../assets/fonts/selection.json'

interface Props {
  name: string
  size: number
  color: string
}

// 第三引数はttfファイルデータ
const CustomIcon = createIconSetFromIcoMoon(
  fontSelection, 'IcoMoon', fontData
)

const Icon = ({ name, size, color }: Props): JSX.Element | null => {
  const [fontLoaded] = useFonts({
    icomoon: fontData
  })
  if (!fontLoaded) {
    return null
  }
  return (
    <CustomIcon name={name} size={size} color={color} />
  )
}
export default Icon
