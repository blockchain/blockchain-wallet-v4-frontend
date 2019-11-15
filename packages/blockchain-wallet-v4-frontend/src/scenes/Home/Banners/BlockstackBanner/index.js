import { actions } from 'data'
import { bindActionCreators } from 'redux'
import { Button, Icon, Text } from 'blockchain-info-components'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import media from 'services/ResponsiveService'
import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  border: 1px solid ${props => props.theme['grey100']};
  border-radius: 8px;
  padding: 24px 25px;
  justify-content: space-between;
  align-items: center;
  ${media.tablet`
    flex-direction: column;
  `};
`
const ContentWrapper = styled.div`
  display: flex;
  ${media.tablet`
    flex-direction: column;
    align-items: center;
  `};
`
const Content = styled.div`
  margin-left: 16px;
  ${media.tablet`
    text-align: center;
    margin-top: 4px;
    margin-left: 0;
  `};
`
const ClaimButton = styled(Button)`
  ${media.tablet`
    margin-top: 8px;
    width: 100%;
  `};
`

const BlockstackBanner = ({ actions }) => {
  return (
    <Wrapper>
      <ContentWrapper>
        <Icon name='stx' color='stx' size='40px' />
        <Content>
          <Text size='20px' weight={600} color='grey800'>
            <FormattedMessage
              id='scenes.home.banners.stx.get10'
              defaultMessage='Get $10 of Stacks (STX).'
            />
          </Text>
          <Text size='14px' weight={500}>
            <FormattedMessage
              id='scenes.home.banners.stx.verifyid'
              defaultMessage='Verify your identity and we’ll airdrop $10 worth of Stacks to your Wallet.'
            />
          </Text>
        </Content>
      </ContentWrapper>
      <ClaimButton
        nature='primary'
        onClick={() => actions.upgradeForAirdropSubmitClicked('BLOCKSTACK')}
      >
        <FormattedMessage
          id='scenes.home.banners.stx.upgrade'
          defaultMessage='Upgrade to Gold'
        />
      </ClaimButton>
    </Wrapper>
  )
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.onboarding, dispatch)
})

export default connect(
  null,
  mapDispatchToProps
)(BlockstackBanner)
