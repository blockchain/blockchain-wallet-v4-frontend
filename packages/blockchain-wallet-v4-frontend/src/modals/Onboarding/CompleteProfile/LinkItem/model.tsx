import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled, { css } from 'styled-components'

import { Image } from 'blockchain-info-components'

import { COMPLETE_PROFILE_STEPS } from '../types'

export const ImageName = {
  [COMPLETE_PROFILE_STEPS.VERIFY]: <Image name='identification' />,
  [COMPLETE_PROFILE_STEPS.LINK_PAYMENT]: <Image name='bank-empty-blue' />,
  [COMPLETE_PROFILE_STEPS.BUY_CRYPTO]: <Image name='cart-green' />
}

export const IconColors = {
  [COMPLETE_PROFILE_STEPS.VERIFY]: 'purple500',
  [COMPLETE_PROFILE_STEPS.LINK_PAYMENT]: 'blue600',
  [COMPLETE_PROFILE_STEPS.BUY_CRYPTO]: 'green600'
}

const LinkItemContainer = styled.div<{ isComplete: boolean }>`
  display: flex;
  flex-direction: row;
  border: 1px solid ${(props) => props.theme.grey100};
  border: ${(props) => (props.isComplete ? 'none' : `1px solid ${(props) => props.theme.grey100}`)};
  box-sizing: border-box;
  border-radius: 12px;
  padding: 16px 24px;
  margin-bottom: 16px;
  cursor: ${(props) => (props.isComplete ? 'default' : 'pointer')};
`

export const ItemPurple = styled(LinkItemContainer)`
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
export const ItemBlue = styled(LinkItemContainer)`
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
export const ItemGreen = styled(LinkItemContainer)`
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
  [COMPLETE_PROFILE_STEPS.VERIFY]: ItemPurple,
  [COMPLETE_PROFILE_STEPS.LINK_PAYMENT]: ItemBlue,
  [COMPLETE_PROFILE_STEPS.BUY_CRYPTO]: ItemGreen
}

const IconWrapper = styled.div`
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
export const VerifyIconWrapper = styled(IconWrapper)`
  background-color: ${(props) => props.theme.purple000};
`
export const PurpleIconWrapper = styled(IconWrapper)`
  background-color: ${(props) => props.theme.purple000};
`
export const BlueIconWrapper = styled(IconWrapper)`
  background-color: ${(props) => props.theme.blue000};
`
export const GreenIconWrapper = styled(IconWrapper)`
  background-color: ${(props) => props.theme.green000};
`

export const MainIconWrapper = {
  [COMPLETE_PROFILE_STEPS.VERIFY]: PurpleIconWrapper,
  [COMPLETE_PROFILE_STEPS.LINK_PAYMENT]: BlueIconWrapper,
  [COMPLETE_PROFILE_STEPS.BUY_CRYPTO]: GreenIconWrapper
}

export const MainSection = styled.div`
  display: flex;
  flex-direction: row;
  margin-left: 22px;
  margin-right: 12px;
  min-height: 36px;
  flex: 1;
  justify-content: space-between;
`
export const CentralContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`
export const LinksWrapper = styled(CentralContainer)`
  padding-top: 26px;
`
export const ActionButton = styled.div`
  display: flex;
  flex-direction: row;
`

export const LinkTitle = {
  [COMPLETE_PROFILE_STEPS.VERIFY]: (
    <FormattedMessage
      id='modal.complete_profile.verify_your_account'
      defaultMessage='Verify your account'
    />
  ),
  [COMPLETE_PROFILE_STEPS.LINK_PAYMENT]: (
    <FormattedMessage
      id='modal.complete_profile.link_a_payment_method'
      defaultMessage='Link a Payment Method'
    />
  ),
  [COMPLETE_PROFILE_STEPS.BUY_CRYPTO]: (
    <FormattedMessage id='buttons.buy_crypto' defaultMessage='Buy Crypto' />
  )
}

export const LinkExplanation = {
  [COMPLETE_PROFILE_STEPS.VERIFY]: (
    <FormattedMessage
      id='modal.complete_profile.minutes'
      defaultMessage='{time} Minutes'
      values={{
        time: 3
      }}
    />
  ),
  [COMPLETE_PROFILE_STEPS.LINK_PAYMENT]: (
    <FormattedMessage
      id='modal.complete_profile.minutes'
      defaultMessage='{time} Minutes'
      values={{
        time: 2
      }}
    />
  ),
  [COMPLETE_PROFILE_STEPS.BUY_CRYPTO]: (
    <FormattedMessage
      id='modal.complete_profile.seconds'
      defaultMessage='{time} Seconds'
      values={{
        time: 10
      }}
    />
  )
}
