import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Icon, Image, Text } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'

import { CurrencySuccessStateType, DataSuccessStateType, LinkDispatchPropsType, OwnProps } from '.'

const Top = styled(FlyoutWrapper)`
  padding-bottom: 0px;
  position: relative;
  height: 100%;
`

const CloseIcon = styled(Icon)`
  position: absolute;
  padding: inherit;
  left: 380px;
  top: 0px;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`

const Title = styled(Text)`
  margin: 40px 0 16px 0;
  text-align: center;
`

const Subcontent = styled(Text)`
  margin-bottom: 56px;
  text-align: center;
`

const Unsupported: React.FC<Props> = (props) => {
  const { handleClose, walletCurrency } = props

  return (
    <Top>
      <CloseIcon
        cursor
        name='close'
        size='20px'
        color='grey600'
        role='button'
        onClick={handleClose}
      />
      <Container>
        <Image
          width='48px'
          height='48px'
          name='world-alert'
          srcset={{ 'world-alert2': '2x', 'world-alert3': '3x' }}
        />
        <Title color='grey800' size='20px' weight={600}>
          <FormattedMessage
            id='modals.interest.unsupported-title'
            defaultMessage='Rates Unavailable'
          />
        </Title>
        <Subcontent color='grey600' weight={500}>
          <FormattedMessage
            id='modals.interest.unsupported-subcontent-1'
            defaultMessage="Interest rates are currently unavailable for {walletCurrency}. Please change your wallet's local currency in Preferences."
            values={{ walletCurrency }}
          />
        </Subcontent>
      </Container>
    </Top>
  )
}

type Props = OwnProps & DataSuccessStateType & CurrencySuccessStateType & LinkDispatchPropsType

export default Unsupported
