import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Button, Image, Text } from 'blockchain-info-components'
import styled from 'styled-components'

import { LinkDispatchPropsType, LinkStatePropsType, OwnProps } from '.'

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0 56px;
  box-sizing: border-box;
`
const Title = styled(Text)`
  margin: 40px 0px 24px 0px;
`

const Failure: React.FC<LinkDispatchPropsType & {
  fiatCurrency: LinkStatePropsType['fiatCurrency']
  pair: OwnProps['pair']
}> = props => {
  return (
    <Wrapper>
      <div>
        <Image
          width='48px'
          height='48px'
          name='world-alert'
          srcset={{ 'world-alert2': '2x', 'world-alert3': '3x' }}
        />
        <Title weight={600} size='20px' lineHeight='150%'>
          <FormattedMessage
            id='modals.simplebuy.eligible.failure'
            defaultMessage='Oops. Something went wrong on our side. Please try again.'
          />
        </Title>
        <Button
          fullwidth
          height='48px'
          data-e2e='sbTryCurrencySelectionAgain'
          nature='primary'
          size='16px'
          onClick={() =>
            props.simpleBuyActions.setStep({
              step: 'ENTER_AMOUNT',
              cryptoCurrency: 'BTC',
              fiatCurrency: props.fiatCurrency || 'USD',
              pair: props.pair
            })
          }
        >
          <FormattedMessage id='buttons.tryagain' defaultMessage='Try Again' />
        </Button>
      </div>
    </Wrapper>
  )
}

export default Failure
