import { actions, model } from 'data'
import { bindActionCreators } from 'redux'
import { Button, Text } from 'blockchain-info-components'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import media from 'services/ResponsiveService'
import React from 'react'
import styled from 'styled-components'

const { EXCHANGE_EVENTS } = model.analytics

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${props => props.theme.grey900};
  background-size: cover;
  border-radius: 8px;
  overflow: hidden;
  padding: 20px;

  @media (min-width: 1200px) {
    height: 80px;
    padding: 0 20px;
  }
  ${media.mobile`
    flex-direction: column;
  `}
`

const Row = styled.div`
  display: flex;
  align-items: center;
  margin-right: 12px;
`

const Column = styled.div`
  display: flex;
  flex-direction: column;

  & > div:first-child {
    margin-bottom: 4px;
  }
`

const Copy = styled(Text)`
  display: flex;
  align-items: center;
  ${media.mobile`
    font-size: 12px;
  `}
  ${media.tablet`
    font-size: 14px;
  `}
`
const BannerButton = styled(Button)`
  height: 48px;
  ${media.mobile`
    font-size: 14px;
    margin-top: 8px;
    padding: 10px;
  `}
`

const ExchangeBanner = ({ analyticsActions }) => {
  return (
    <Wrapper>
      <Row>
        <Column>
          <Copy color='white' size='20px' weight={500}>
            <FormattedMessage
              id='scenes.home.banners.exchangebanner.content1'
              defaultMessage='We built our own exchange that links to your Wallet.'
            />
          </Copy>
          <Copy color='whiteFade700' size='14px' weight={500}>
            <FormattedMessage
              id='scenes.home.banners.exchangebanner.content3'
              defaultMessage='Instantly access more cryptos and deposit/withdraw cash.'
            />
          </Copy>
        </Column>
      </Row>
      <LinkContainer
        to='/exchange'
        rel='noopener noreferrer'
        onClick={() =>
          analyticsActions.logEvent(EXCHANGE_EVENTS.BANNER_GET_STARTED)
        }
      >
        <BannerButton jumbo nature='primary'>
          <FormattedMessage
            id='scenes.home.banners.exchangebanner.getstarted'
            defaultMessage='Get Started'
          />
        </BannerButton>
      </LinkContainer>
    </Wrapper>
  )
}

const mapDispatchToProps = dispatch => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch)
})

export default connect(
  null,
  mapDispatchToProps
)(ExchangeBanner)
