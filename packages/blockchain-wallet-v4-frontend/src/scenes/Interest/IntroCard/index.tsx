import { bindActionCreators } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import React, { PureComponent } from 'react'
import styled from 'styled-components'

import { actions, model, selectors } from 'data'
import { Box } from 'components/Box'
import { Button, Icon, Link, Text } from 'blockchain-info-components'

import {
  Props as OwnProps,
  StateType as ParentStateType,
  SuccessStateType
} from '..'

const { INTEREST_EVENTS } = model.analytics

const BoxStyled = styled(Box)`
  width: 275px;
  margin-bottom: 24px;
`
const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`
const IconWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

class IntroCard extends PureComponent<
  ParentStateType & Props & SuccessStateType
> {
  render () {
    const {
      analyticsActions,
      idvActions,
      isGoldTier,
      interestRateArray,
      preferencesActions,
      showInterestInfoBox,
      userData
    } = this.props
    const highestRate = interestRateArray.reduce((a, b) => Math.max(a, b))
    return (
      showInterestInfoBox && (
        <BoxStyled>
          {isGoldTier ? (
            <ContentWrapper>
              <IconWrapper>
                <Icon color='blue600' name='percentage' size='32px' />
                <Icon
                  cursor
                  name='close'
                  size='16px'
                  color='grey400'
                  role='button'
                  onClick={preferencesActions.hideInterestInfoBox}
                />
              </IconWrapper>
              <Text
                size='20px'
                color='grey800'
                weight={600}
                style={{ marginTop: '16px' }}
              >
                <FormattedMessage
                  id='scenes.interest.earnheaderverified'
                  defaultMessage='Earn interest on your crypto today.'
                />
              </Text>
              <Text
                size='14px'
                color='grey600'
                weight={500}
                style={{ marginTop: '4px', lineHeight: 1.5 }}
              >
                <FormattedMessage
                  id='scenes.interest.earninfo.verified.copy'
                  defaultMessage='Earn up to {highestRate}% annually when you transfer crypto to your Interest Account.'
                  values={{ highestRate }}
                />
              </Text>
              <Link
                href='https://support.blockchain.com/hc/en-us/categories/360003244552-Interest-Account'
                style={{ width: '100%' }}
                target='_blank'
              >
                <Button
                  data-e2e='earnInterestLearnMore'
                  fullwidth
                  nature='light'
                  onClick={() =>
                    analyticsActions.logEvent(
                      INTEREST_EVENTS.HOME.CLICK_SUPPORT_ARTICLE
                    )
                  }
                  style={{ marginTop: '45px' }}
                >
                  <FormattedMessage
                    id='buttons.learn_more'
                    defaultMessage='Learn More'
                  />
                </Button>
              </Link>
            </ContentWrapper>
          ) : (
            <ContentWrapper>
              <Icon name='percentage' color='blue600' size='32px' />
              <Text
                size='20px'
                color='grey800'
                weight={600}
                style={{ marginTop: '16px' }}
              >
                <FormattedMessage
                  id='scenes.interest.earnupgrade.header'
                  defaultMessage='Upgrade to Gold Level so you can earn interest on your crypto.'
                />
              </Text>
              <Text
                size='14px'
                color='grey600'
                weight={500}
                style={{ marginTop: '10px', lineHeight: 1.5 }}
              >
                <FormattedMessage
                  id='scenes.interest.earnbody.access'
                  defaultMessage='Upgrade to Gold Level and access benefits like earning up to {highestRate}% annually on your crypto.'
                  values={{ highestRate }}
                />
              </Text>
              <Button
                nature='primary'
                data-e2e='verifyIdentityBorrow'
                style={{ marginTop: '20px' }}
                disabled={userData.kycState !== 'NONE'}
                onClick={() =>
                  idvActions.verifyIdentity(2, false, 'InterestPage')
                }
              >
                {userData.kycState === 'UNDER_REVIEW' ||
                userData.kycState === 'PENDING' ? (
                  <FormattedMessage
                    id='scenes.interest.kycunderreview'
                    defaultMessage='Gold Verification In Review'
                  />
                ) : (
                  <FormattedMessage
                    id='scenes.interest.verifyid'
                    defaultMessage='Upgrade Now'
                  />
                )}
              </Button>
            </ContentWrapper>
          )}
        </BoxStyled>
      )
    )
  }
}

const mapStateToProps = state => ({
  showInterestInfoBox: selectors.preferences.getShowInterestInfoBox(state)
})

const mapDispatchToProps = dispatch => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  preferencesActions: bindActionCreators(actions.preferences, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(IntroCard)
