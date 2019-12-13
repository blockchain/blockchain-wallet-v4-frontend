import { FormattedMessage } from 'react-intl'
import { gte } from 'ramda'
import { Text } from 'blockchain-info-components'
import React from 'react'
import styled from 'styled-components'

import { BaseIcon, Box, BoxWrapper, RoundButton } from '../.'

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

const ContinueCoinify = ({ currentTier, showCoinify }) =>
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
            id='scenes.buysell.coinify-title'
            defaultMessage='Buy Bitcoin.{break} Pay Your Way'
            values={{ break: <br /> }}
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
            defaultMessage={`Buy and sell using your bank card or making a bank transfer.{break}`}
            values={{
              break: (
                <>
                  <br />
                  <br />
                </>
              )
            }}
          />
        </Text>

        <RoundButton
          fullwidth
          height='3rem'
          nature='primary'
          onClick={showCoinify}
          style={{ marginTop: '32px' }}
        >
          <Text color='white' weight={500}>
            <FormattedMessage
              id='scenes.buysell.coinify.button'
              defaultMessage='Continue with Coinify'
            />
          </Text>
        </RoundButton>
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

export default ContinueCoinify
