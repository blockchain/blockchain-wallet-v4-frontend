import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'

import { selectors } from 'data'
import { Button, Link, Image, Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 100%;
  border-radius: 4px;
  box-sizing: border-box;
  padding: 15px 50px;
  background: ${props =>
    `linear-gradient(312.54deg, ${props.theme.purple} -25.42%, ${
      props.theme.black
    } 70.12%)`};
`
const PitLogo = styled(Image)`
  margin-bottom: 15px;
`
const LearnMoreButton = styled(Button)`
  height: 46px;
  width: 210px;
  max-width: 210px;
  margin-top: 15px;
`

export const ThePitBanner = ({ isPitAccountLinked }) => {
  return !isPitAccountLinked ? (
    <Wrapper>
      <PitLogo name='the-pit-word' height='50px' />
      <Text color='white' size='16px' weight={400}>
        <FormattedMessage
          defaultMessage="It's time to Level Up to a better crypto exchange.  The first 100,000 traders to sign up will trade free for 30 days."
          id='scenes.home.thepit.subtitle'
        />
      </Text>
      <Link
        href='https://pit.blockchain.com/'
        target='_blank'
        rel='noopener noreferrer'
      >
        <LearnMoreButton nature='purple'>
          <FormattedMessage
            id='scenes.home.thepit.learnmore'
            defaultMessage='Learn More'
          />
        </LearnMoreButton>
      </Link>
    </Wrapper>
  ) : null
}
const mapStateToProps = state => ({
  isPitAccountLinked: selectors.modules.profile
    .isPitAccountLinked(state)
    .getOrElse(true)
})

export default connect(mapStateToProps)(ThePitBanner)
