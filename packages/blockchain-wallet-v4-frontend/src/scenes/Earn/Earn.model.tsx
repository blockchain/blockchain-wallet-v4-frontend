import { PaletteColors } from '@blockchain-com/constellation'
import styled from 'styled-components'

import { Link } from 'blockchain-info-components'
import { SceneSubHeaderText, SceneWrapper } from 'components/Layout'

export const TabRow = styled.div`
  width: 100%;
  display: flex;
  margin-bottom: 26px;
`
export const EarnContainer = styled.div`
  display: relative;
`
export const Overlay = styled.div`
  position: fixed;
  height: 100vh;
  width: 100vw;
  opacity: 0.6;
  background-color: white;
  z-index: 1;
  cursor: not-allowed;
`
export const CustomSceneWrapper = styled(SceneWrapper)<{ $isGoldTier?: boolean }>`
  ${({ $isGoldTier }) => !$isGoldTier && `overflow: hidden;`}
`
export const SceneSubHeaderTextCustom = styled(SceneSubHeaderText)`
  display: contents;
`
