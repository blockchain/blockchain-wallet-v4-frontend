import { FlyoutWrapper } from 'components/Flyout'
import { FormattedMessage } from 'react-intl'
import { Icon, Text } from 'blockchain-info-components'
import { LinkDispatchPropsType, OwnProps, SuccessStateType } from '.'
import React from 'react'
import styled from 'styled-components'

const CustomFlyoutWrapper = styled(FlyoutWrapper)`
  height: 100%;
`
const TopText = styled(Text)`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
`
const EverypayIframe = styled.iframe`
  height: 100%;
  width: 100%;
  border: 0;
`

type Props = OwnProps & LinkDispatchPropsType & SuccessStateType

const Success: React.FC<Props> = props => {
  return (
    <CustomFlyoutWrapper>
      <TopText color='grey800' size='20px' weight={600}>
        <Icon
          cursor
          name='arrow-left'
          size='20px'
          color='grey600'
          style={{ marginRight: '24px' }}
          role='button'
          onClick={() =>
            props.simpleBuyActions.setStep({
              fiatCurrency: props.fiatCurrency,
              step: 'ENTER_AMOUNT'
            })
          }
        />
        <FormattedMessage
          id='modals.simplebuy.addcard'
          defaultMessage='Add Card'
        />
      </TopText>
      <EverypayIframe
        src={`http://localhost:8081/wallet-helper/everypay/#/customerUrl/${encodeURIComponent(
          props.providerDetails.everypay.paymentLink
        )}`}
      />
    </CustomFlyoutWrapper>
  )
}

export default Success
