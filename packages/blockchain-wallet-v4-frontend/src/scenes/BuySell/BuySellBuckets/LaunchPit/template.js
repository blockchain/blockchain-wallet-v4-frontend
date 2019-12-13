import * as React from 'react'
import { FormattedMessage } from 'react-intl'
import { Link, Text } from 'blockchain-info-components'
import styled from 'styled-components'

import { BaseIcon, Box, BoxWrapper, RoundButton } from '../.'

const PitIcon = styled(BaseIcon)`
  background-image: url('/img/the-pit-logo-basic.svg');
`

const ButtonLink = styled(Link)`
  width: 100%;
  margin-top: 3rem;
`

const ButtonWrapper = styled.div`
  width: 100%;
  margin-top: 3rem;
`

const StyledBox = styled(Box)`
  margin-top: ${props => (props.noMargin ? '0' : '2rem')};
`

const LaunchPit = props => {
  const { isPitAccountLinked, handleLinkedWallet, handleSignup, pitUrl } = props
  const Wrapper = isPitAccountLinked ? ButtonLink : ButtonWrapper
  return (
    <BoxWrapper>
      <StyledBox noMargin={props.noMargin}>
        <PitIcon />
        <Text
          size='20px'
          color='grey800'
          weight={600}
          style={{ marginTop: '16px' }}
        >
          <FormattedMessage
            id='scenes.buysell.launch-pit.title1'
            defaultMessage='Instantly Buy'
          />
        </Text>
        <Text size='20px' color='grey800' weight={600}>
          <FormattedMessage
            id='scenes.buysell.launch-pit.title2'
            defaultMessage='& Sell in The PIT'
          />
        </Text>
        <Text
          color='grey600'
          lineHeight='1.5'
          size='14px'
          style={{ marginTop: '8px', width: '265px' }}
          weight={500}
        >
          <FormattedMessage
            id='scenes.buysell.launch-pit-desc'
            defaultMessage='Launch the PIT to buy and sell, BTC, ETH, BCH, USD PAX and many more.'
          />
        </Text>

        <Wrapper
          href={`${pitUrl}&utm_source=web_wallet&utm_medium=referral&utm_campaign=buy_sell_linked`}
          rel='noopener noreferrer'
          target='_blank'
          onClick={isPitAccountLinked ? handleLinkedWallet : null}
        >
          <RoundButton
            fullwidth
            height='3rem'
            onClick={isPitAccountLinked ? null : handleSignup}
            nature='primary'
          >
            <Text color='white' weight={500}>
              <FormattedMessage
                id='scenes.buysell.launch-pit.button'
                defaultMessage='Launch The PIT'
              />
            </Text>
          </RoundButton>
        </Wrapper>
      </StyledBox>
      <Text
        size='14px'
        color='grey600'
        weight={500}
        style={{ marginTop: '16px', paddingLeft: '24px' }}
      >
        <FormattedMessage
          id='scenes.buysell.launch-pit.powered-by-blockchain'
          defaultMessage='Powered by Blockchain'
        />
      </Text>
    </BoxWrapper>
  )
}

export default LaunchPit
