import { Button, Text } from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'
import { gte } from 'ramda'
import React from 'react'
import styled from 'styled-components'

const Box = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 1.5rem;
  border-radius: 0.5rem;
  border: 1px solid ${props => props.theme['grey000']};
  width: 17.5rem;
  height: 15.5rem;
  margin-top: 2rem;

  &:not(:last-child) {
    margin-right: 1.5rem;
  }
`
const BoxWrapper = styled.div`
  display: flex;
  flex-direction: column;
`
const BaseIcon = styled.div`
  background-repeat: no-repeat;
  height: 2rem;
  min-height: 2rem;
  width: 2rem;
`
const BlankCard = styled(BaseIcon)`
  background-image: url('/img/blank-card.svg');
`

const VisaLogo = styled(BaseIcon)`
  background-image: url('/img/visa-logo.svg');
  margin-right: 1rem;
`

const MastercardLogo = styled(BaseIcon)`
  background-image: url('/img/mastercard-logo.svg');
`

const LogoWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`

const ContinueCoinifyCard = ({
  currentTier,
  handleShowCoinify,
  hasTokenOrTrades
}) =>
  hasTokenOrTrades &&
  gte(currentTier, 2) && (
    <BoxWrapper>
      <Box>
        <LogoWrapper>
          <BlankCard />
          <LogoWrapper>
            <VisaLogo />
            <MastercardLogo />
          </LogoWrapper>
        </LogoWrapper>

        <Text
          size='20px'
          color='grey800'
          weight={600}
          style={{ marginTop: '16px', width: '265px' }}
        >
          <FormattedMessage
            id='scenes.buysell.coinify-title-1'
            defaultMessage='Buy Bitcoin.'
          />
        </Text>
        <Text size='20px' color='grey800' weight={600}>
          <FormattedMessage
            id='scenes.buysell.coinify-title-2'
            defaultMessage='Pay Your Way'
          />
        </Text>
        <Text
          color='grey600'
          lineHeight='1.5'
          size='14px'
          style={{ marginTop: '8px' }}
          weight={500}
        >
          <FormattedMessage
            id='scenes.buysell.coinify-desc'
            defaultMessage='Buy and sell using your bank card or making a bank transfer.'
          />
        </Text>

        <Button
          fullwidth
          height='3rem'
          nature='primary'
          onClick={handleShowCoinify}
          style={{ marginTop: '48px' }}
        >
          <Text color='white' weight={500}>
            <FormattedMessage
              id='scenes.buysell.coinify.button'
              defaultMessage='Continue with Coinify'
            />
          </Text>
        </Button>
      </Box>
      <Text
        size='14px'
        color='grey600'
        weight={500}
        style={{ marginTop: '16px', paddingLeft: '32px' }}
      >
        <FormattedMessage
          id='scenes.buysell.coinify.powered-by-coinify'
          defaultMessage='Powered by Coinify'
        />
      </Text>
    </BoxWrapper>
  )

export default ContinueCoinifyCard
