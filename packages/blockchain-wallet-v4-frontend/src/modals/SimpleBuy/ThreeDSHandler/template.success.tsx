import { FlyoutWrapper } from 'components/Flyout'
import { FormattedMessage } from 'react-intl'
import { Icon, SpinningLoader, Text } from 'blockchain-info-components'
import { Props as OwnProps, State, SuccessStateType } from '.'
import React from 'react'
import styled from 'styled-components'

const CustomFlyoutWrapper = styled(FlyoutWrapper)`
  height: 100%;
`
const LoadingWrapper = styled.div`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
`
const Iframe = styled.iframe`
  border: 0;
  width: 100%;
  height: 100%;
  margin-top: 16px;
`

const Success: React.FC<Props> = props => {
  return (
    <CustomFlyoutWrapper>
      {props.threeDSCallbackReceived ? (
        <LoadingWrapper>
          <SpinningLoader />
          <Text weight={600} color='grey600' style={{ marginTop: '24px' }}>
            <FormattedMessage
              id='modals.simplebuy.cc_info_received'
              defaultMessage='Waiting for information from your bank...'
            />
          </Text>
        </LoadingWrapper>
      ) : (
        <>
          <Icon
            cursor
            name='arrow-left'
            size='20px'
            color='grey600'
            role='button'
            onClick={() =>
              props.simpleBuyActions.setStep({
                step: 'ADD_CARD',
                cardId: props.card.id
              })
            }
          />
          <Iframe
            src={
              props.domains.walletHelper +
              '/wallet-helper/everypay/#/paymentLink/' +
              encodeURIComponent(props.providerDetails.everypay.paymentLink)
            }
          />
        </>
      )}
    </CustomFlyoutWrapper>
  )
}

type Props = OwnProps & State & SuccessStateType

export default Success
