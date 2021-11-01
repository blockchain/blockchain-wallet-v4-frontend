import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Icon, Image, Text } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'

import { LinkStatePropsType, Props as OwnProps, SuccessStateType } from '.'

export type Props = OwnProps & SuccessStateType & LinkStatePropsType

const Top = styled(FlyoutWrapper)`
  padding-bottom: 0px;
  position: relative;
  height: 100%;
`

const CloseIcon = styled(Icon)`
  position: absolute;
  padding: inherit;
  left: 0px;
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
  margin: 56px 0 16px 0;
  text-align: center;
`

const Subcontent = styled(Text)`
  margin-bottom: 56px;
  text-align: center;
`

const Unsupported: React.FC<Props> = (props) => {
  const { paymentAccountEligible } = props.eligibility

  return (
    <Top>
      <CloseIcon
        cursor
        name='arrow-left'
        size='20px'
        color='grey600'
        role='button'
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
            defaultMessage='Buy Crypto Coming Soon for'
          />{' '}
          {paymentAccountEligible ? (
            props.fiatCurrency
          ) : (
            <FormattedMessage
              id='modals.simplebuy.fiataccountineligible'
              defaultMessage='your region.'
            />
          )}
        </Title>
        <Subcontent color='grey600' weight={500}>
          {paymentAccountEligible ? (
            <>
              <FormattedMessage
                id='modals.simplebuy.unsupported-subcontent'
                defaultMessage="Currently we don't support buying crypto with"
              />{' '}
              {props.fiatCurrency}
              {'. '}
            </>
          ) : (
            <>
              <FormattedMessage
                id='modals.simplebuy.unsupported-subcontent-1'
                defaultMessage="Well this is awkward. We don't support buying crypto yet for"
              />{' '}
              <FormattedMessage id='modals.simplebuy.fiatregion' defaultMessage='your region' />
              {'. '}
            </>
          )}
          <FormattedMessage
            id='modals.simplebuy.unsupported-subcontent-2'
            defaultMessage="We'll send you an update when we do."
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
