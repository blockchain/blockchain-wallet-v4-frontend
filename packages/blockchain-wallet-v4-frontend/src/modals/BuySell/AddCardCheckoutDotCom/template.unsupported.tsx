import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { BSOrderActionType, FiatType } from '@core/types'
import { Button, Icon, Image, Text } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'
import { capitalizeFirstLetter } from 'services/forms'

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

const SubContent = styled(Text)`
  margin-bottom: 56px;
  text-align: center;
`

type Props = {
  fiatCurrency: FiatType
  handleClose: () => void
  orderType: BSOrderActionType
  paymentAccountEligible: boolean
}

const Unsupported = ({ fiatCurrency, handleClose, orderType, paymentAccountEligible }: Props) => {
  return (
    <Top>
      <CloseIcon
        cursor
        name='arrow-left'
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
            id='modals.simplebuy.unsupported-title-order'
            defaultMessage='{order} Crypto Coming Soon for'
            values={{
              order: capitalizeFirstLetter(orderType)
            }}
          />{' '}
          {paymentAccountEligible ? (
            fiatCurrency
          ) : (
            <FormattedMessage
              id='modals.simplebuy.fiataccountineligible'
              defaultMessage='your region.'
            />
          )}
        </Title>
        <SubContent color='grey600' weight={500}>
          {paymentAccountEligible ? (
            <>
              <FormattedMessage
                id='modals.simplebuy.unsupported-subcontent'
                defaultMessage="Currently we don't support buying crypto with {currency}."
                values={{
                  currency: fiatCurrency
                }}
              />
            </>
          ) : (
            <>
              <FormattedMessage
                id='modals.simplebuy.unsupported-subcontent-1'
                defaultMessage="Well this is awkward. We don't support buying crypto yet for your region."
              />
            </>
          )}
          <FormattedMessage
            id='modals.simplebuy.unsupported-subcontent-2'
            defaultMessage="We'll send you an update when we do."
          />
        </SubContent>
        <Button
          data-e2e='addCardUnsupported'
          height='48px'
          size='16px'
          nature='primary'
          onClick={handleClose}
          fullwidth
        >
          <FormattedMessage id='buttons.ok' defaultMessage='OK' />
        </Button>
      </Container>
    </Top>
  )
}

export default Unsupported
