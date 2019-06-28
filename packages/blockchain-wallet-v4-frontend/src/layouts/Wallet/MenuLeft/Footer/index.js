import React from 'react'
import styled from 'styled-components'
import { includes } from 'ramda'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { actions, model } from 'data'
import { Button, Icon, Link, Text } from 'blockchain-info-components'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'

const { ADS_EVENTS } = model.analytics

const Wrapper = styled.div`
  text-align: center;
`
const AdsButton = styled(Button)`
  margin: 8px auto 0px auto;
  transition: background 0.3s;
  line-height: normal;
  span > span:not(:first-child) {
    color: ${props => props.theme['blue']};
  }
  &:hover {
    span:first-child {
      color: ${props => props.theme['grey800']};
    }
  }
`
const ButtonText = styled(Text)`
  display: flex;
  white-space: nowrap;
  align-items: center;
`
const ArrowIcon = styled(Icon)`
  margin-left: 4px;
  font-size: 16px;
`

const Footer = ({ actions, countryCode, adsBlacklist, adsUrl }) => {
  const isBlacklisted = includes(countryCode, adsBlacklist)
  return isBlacklisted ? null : (
    <Wrapper>
      <Text color='gray-3' size='12px' weight={500}>
        <FormattedMessage
          id='layouts.wallet.menuleft.footer.ad'
          defaultMessage='Ad by bitcoin.com'
        />
      </Text>
      <AdsButton
        height='48px'
        onClick={() => actions.logEvent(ADS_EVENTS.CLICK_AD)}
      >
        <Link href={adsUrl} rel='noopener noreferrer' target='_blank'>
          <ButtonText color='gray-4' size='14px' weight={500}>
            <FormattedHTMLMessage
              id='layouts.wallet.menuleft.footer.bitcoingames2'
              defaultMessage='<span>Bitcoin Games.</span> <span>Play Now</span>'
            />
            <ArrowIcon name='short-right-arrow' color='blue' />
          </ButtonText>
        </Link>
      </AdsButton>
    </Wrapper>
  )
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.analytics, dispatch)
})

export default connect(
  null,
  mapDispatchToProps
)(Footer)
