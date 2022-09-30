import React from 'react'
import styled from 'styled-components'

import { SceneWrapper } from 'components/Layout'

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

export const MessageContainer = styled.div<{ $borderColor: string }>`
  display: flex;
  padding: 16px;
  border: 1px solid ${({ $borderColor, theme }) => theme[$borderColor]};
  border-radius: 16px;
  gap: 16px;
  justify-content: space-between;
  align-items: center;
  margin: 24px 0;
`
export const CustomSceneWrapper = styled(SceneWrapper)<{ $isGoldTier?: boolean }>`
  ${({ $isGoldTier }) => !$isGoldTier && `overflow: hidden;`}
`
