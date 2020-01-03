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
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-image: url('/img/airdrop-welcome-banner.png');
  /* stylelint-disable */
  background-image: -webkit-image-set(
    url('/img/airdrop-welcome-banner.png') 1x,
    url('/img/airdrop-welcome-banner@2x.png') 2x
  );
  /* stylelint-enable */
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 8px;
  overflow: hidden;
  padding: 20px;
  border: 1px solid ${props => props.theme.grey000};

  @media (min-width: 1200px) {
    height: 80px;
    padding: 0 20px;
  }
  ${media.mobile`
    flex-direction: column;
  `}
`

const ContentWrapper = styled.div`
  display: flex;
  ${media.tablet`
    flex-direction: column;
    align-items: center;
  `};
`
const Content = styled.div`
  margin-left: 18px;

  ${media.tablet`
    text-align: center;
    margin-top: 4px;
    margin-left: 0;
  `};
`
const CompleteProfileButton = styled(Button)`
  border-radius: 8px;
  background-color: ${props => props.theme.green600};
  color: white;
  min-width: 200px;
  border: none;
  &:hover {
    background-color: ${props => props.theme.green700};
  }
  ${media.tablet`
    margin-top: 8px;
    width: 100%;
  `};
`

const BlockstackBanner = ({ actions }) => {
  return (
    <Wrapper>
      <ContentWrapper>
        <Icon name='parachute' color='green600' size='40px' />
        <Content>
          <Text size='20px' weight={600} color='grey800'>
            <FormattedMessage
              id='scenes.home.banners.stx.latestairdrop'
              defaultMessage='Our Latest Airdrop is Here!'
            />
          </Text>
          <Text size='14px' weight={500} color='grey600'>
            <FormattedMessage
              id='scenes.home.banners.stx.updateprofile'
              defaultMessage='Upgrade your profile to Gold Level to secure your spot in our next airdrop with Blockstack and get free Stacks (STX).'
            />
          </Text>
        </Content>
      </ContentWrapper>
      <CompleteProfileButton
        onClick={() => actions.upgradeForAirdropSubmitClicked('BLOCKSTACK')}
      >
        <FormattedMessage
          id='scenes.home.banners.stx.completeprofile'
          defaultMessage='Complete My Profile Now'
        />
      </CompleteProfileButton>
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
