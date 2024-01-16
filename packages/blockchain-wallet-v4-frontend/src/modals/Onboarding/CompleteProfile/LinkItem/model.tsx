import React from 'react'
import styled, { css } from 'styled-components'

import { Image } from 'blockchain-info-components'

export const ImageName = {
  BUY_CRYPTO: <Image name='cart-green' />,
  KYC_VERIFICATION: <Image name='identification' />
}

export const IconColors = {
  BUY_CRYPTO: 'green600',
  KYC_VERIFICATION: 'purple500'
}

export const ItemButton = styled.button<{ isComplete?: boolean; status: string }>`
  border: 1px solid ${(props) => props.theme.grey100};
  box-sizing: border-box;
  border-radius: 12px;
  padding: 16px 24px;
  margin-bottom: 16px;
  cursor: ${(props) => (props.status === 'IDLE' ? 'pointer' : 'cursor')};
  background-color: ${(props) => (props.status === 'DISABLED' ? props.theme.grey100 : 'inherit')};
`

export const ButtonContent = styled.div`
  display: flex;
  align-items: center;
`

const ItemPurple = styled(ItemButton)`
  ${(props) =>
    props.isComplete
      ? ''
      : css`
          &:hover {
            border-color: ${(props) => props.theme.purple500};
            background-color: ${(props) => props.theme.purple000};
          }
        `};
`
const ItemBlue = styled(ItemButton)`
  ${(props) =>
    props.isComplete
      ? ''
      : css`
          &:hover {
            border-color: ${(props) => props.theme.blue600};
            background-color: ${(props) => props.theme.blue000};
          }
        `};
`
const ItemGreen = styled(ItemButton)`
  ${(props) =>
    props.isComplete
      ? ''
      : css`
          &:hover {
            border-color: ${(props) => props.theme.green600};
            background-color: ${(props) => props.theme.green000};
          }
        `};
`

export const MainContainer = {
  BUY_CRYPTO: ItemGreen,
  KYC_VERIFICATION: ItemPurple
}

export const IconWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  img {
    max-width: 24px;
    align-self: center;
  }
`
const PurpleIconWrapper = styled(IconWrapper)`
  background-color: ${(props) => props.theme.purple000};
`
const BlueIconWrapper = styled(IconWrapper)`
  background-color: ${(props) => props.theme.blue000};
`
const GreenIconWrapper = styled(IconWrapper)`
  background-color: ${(props) => props.theme.green000};
`

export const MainSection = styled.div`
  display: flex;
  margin-left: 1rem;
  margin-right: 1rem;
  min-height: 36px;
  flex: 1;
  justify-content: space-between;
  align-items: center;
`
export const CentralContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`

export const ActionButton = styled.div`
  display: flex;
  flex-direction: row;
`
