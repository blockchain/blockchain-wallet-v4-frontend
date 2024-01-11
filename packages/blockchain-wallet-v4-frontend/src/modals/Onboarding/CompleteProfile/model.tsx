import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Text } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'

import { ActionButtonType } from './types'

const BUTTON_PROPS = {
  0: {
    defaultMessage: 'Verify Your ID',
    e2e: 'completeProfileButtonVerifyId',
    id: 'modal.complete_profile.verify_your_id',
    nature: 'purple'
  },
  1: {
    defaultMessage: 'Link a Payment Method',
    e2e: 'completeProfileButtonLinkABank',
    id: 'modal.complete_profile.link_a_payment_method',
    nature: 'primary'
  },
  2: {
    defaultMessage: 'Buy Crypto',
    e2e: 'completeProfileButtonBuyCrypto',
    id: 'buttons.buy_crypto',
    nature: 'received'
  }
}

export const ActionButton = ({ currentStep, onClick }: ActionButtonType) => {
  const { defaultMessage, e2e, id, nature } = BUTTON_PROPS[currentStep]

  return (
    <Button jumbo nature={nature} data-e2e={e2e} onClick={onClick} fullwidth>
      <FormattedMessage id={id} defaultMessage={defaultMessage} />
    </Button>
  )
}

export const MAX_STEPS = 3

export const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`

export const HeaderWrapper = styled(FlyoutWrapper)`
  height: unset;
  padding-bottom: 0px;
`

export const ContentWrapper = styled(FlyoutWrapper)`
  padding-top: 24px;
`

export const TopText = styled(Text)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 7px;
`

export const ProgressRow = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
`

export const ProgressWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  width: 40px;
  min-width: 40px;
  border-radius: 20px;
  margin-left: 32px;
`

export const CloseIconContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${(props) => props.theme.grey000};
  backdrop-filter: blur(54.3656px);
  > span {
    justify-content: center;
  }
`

export const CentralContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`
export const LinksWrapper = styled(CentralContainer)`
  padding-top: 26px;
`

export const FooterWrapper = styled(FlyoutWrapper)`
  flex: 1;
  justify-content: flex-end;
  display: flex;
  flex-direction: column;
  margin-top: -16px;
`
