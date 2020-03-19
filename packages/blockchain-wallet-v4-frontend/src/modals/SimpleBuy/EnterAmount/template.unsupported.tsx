import { Button, Icon, Image, Text } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'
import { FormattedMessage } from 'react-intl'
import {
  LinkDispatchPropsType,
  LinkStatePropsType,
  OwnProps,
  SuccessStateType
} from '.'
import React from 'react'
import styled from 'styled-components'

export type Props = OwnProps &
  SuccessStateType &
  LinkDispatchPropsType &
  LinkStatePropsType

const Top = styled(FlyoutWrapper)`
  padding-bottom: 0px;
`

const CloseIcon = styled(Icon)`
  position: absolute;
  right: 44px;
  top: 44px;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
`

const Title = styled(Text)`
  margin: 56px 0 16px 0;
  text-align: center;
  width: 275px;
`

const Subcontent = styled(Text)`
  margin-bottom: 56px;
  text-align: center;
`

const Unsupported: React.FC<Props> = props => {
  return (
    <Top>
      <CloseIcon
        cursor
        name='close'
        size='20px'
        color='grey600'
        onClick={props.handleClose}
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
            id='modals.simplebuy.unsupported-title'
            defaultMessage='Buy Crypto Coming Soon for '
          />
          {props.fiatCurrency}
        </Title>
        <Subcontent color='grey600' weight={500}>
          <FormattedMessage
            id='modals.simplebuy.unsupported-subcontent-1'
            defaultMessage="Well this is awards. We don't support buying crypto yet for "
          />
          {props.fiatCurrency}
          <FormattedMessage
            id='modals.simplebuy.unsupported-subcontent-1'
            defaultMessage=". We'll send you an update when we do."
          />
        </Subcontent>
        <Button
          data-e2e='submitSBAmount'
          height='48px'
          size='16px'
          nature='primary'
          onClick={props.handleClose}
          fullwidth
        >
          <FormattedMessage id='buttons.ok' defaultMessage='OK' />
        </Button>
      </Container>
    </Top>
  )
}

export default Unsupported
