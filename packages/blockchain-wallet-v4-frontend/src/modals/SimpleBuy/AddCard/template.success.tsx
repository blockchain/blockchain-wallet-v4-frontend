import { FlyoutWrapper } from 'components/Flyout'
import { FormattedMessage } from 'react-intl'
import { Icon, Text } from 'blockchain-info-components'
import { LinkDispatchPropsType, OwnProps, SuccessStateType } from '.'
import React from 'react'
import styled from 'styled-components'

const TopText = styled(Text)`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
`

type Props = OwnProps & LinkDispatchPropsType & SuccessStateType

const Success: React.FC<Props> = props => {
  return (
    <FlyoutWrapper>
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
      {JSON.stringify(props.card)}
      {JSON.stringify(props.providerDetails)}
    </FlyoutWrapper>
  )
}

export default Success
