import React, { PureComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import styled from 'styled-components'

import { Button, Icon, Text } from 'blockchain-info-components'
import { actions } from 'data'
import { media } from 'services/styles'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border: 1px solid ${(props) => props.theme.grey000};
  border-radius: 8px;
  padding: 20px;

  ${media.atLeastLaptop`
    height: 80px;
    padding: 0 20px;
  `}
  ${media.mobile`
    padding: 12px;
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
const PendingIconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  width: 40px;
  min-width: 40px;
  border-radius: 20px;
  margin-right: 20px;
  background-color: ${(props) => props.theme.orange000};
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
    margin-top: 16px;
    padding: 10px;
  `}
`

class FinishKyc extends PureComponent<Props> {
  render() {
    return (
      <Wrapper>
        <Row>
          <PendingIconWrapper>
            <Icon name='pending' color='orange600' size='20px' />
          </PendingIconWrapper>
          <Column>
            <Text size='20px' weight={600} color='grey800'>
              <FormattedMessage
                id='scenes.home.banner.finishsigningup'
                defaultMessage='Finish Signing Up'
              />
            </Text>
            <Copy size='16px' color='grey600' weight={500}>
              <FormattedMessage
                id='scenes.home.banner.signupapprove'
                defaultMessage='Once you finish and get approved, start buying crypto.'
              />
            </Copy>
          </Column>
        </Row>
        <BannerButton
          onClick={() =>
            this.props.identityVerificationActions.verifyIdentity({
              needMoreInfo: false,
              origin: 'DashboardPromo',
              tier: 2
            })
          }
          jumbo
          data-e2e='openKycTier2'
          nature='primary'
        >
          <FormattedMessage id='buttons.continue' defaultMessage='Continue' />
        </BannerButton>
      </Wrapper>
    )
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  identityVerificationActions: bindActionCreators(actions.components.identityVerification, dispatch)
})

const connector = connect(undefined, mapDispatchToProps)

type Props = ConnectedProps<typeof connector>

export default connector(FinishKyc)
