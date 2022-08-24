import { BSShowModalOriginType } from 'data/types'

export type OpenSellModalCallback = (props: { coin: string; origin: BSShowModalOriginType }) => void

export type OpenSellModalHook = () => OpenSellModalCallback
