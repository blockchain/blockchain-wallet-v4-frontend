import { SemanticColors } from '@blockchain-com/constellation'

type ColorKeys = keyof typeof SemanticColors

export type TagColorType = {
  backgroundColor: ColorKeys
  borderColor?: ColorKeys
}

export type TagPropsType = TagColorType & {
  children: JSX.Element
}
