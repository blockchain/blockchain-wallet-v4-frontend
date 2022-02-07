import React, { PureComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'

import { Button, Icon, Image, Link, SpinningLoader, Text } from 'blockchain-info-components'
import { Box } from 'components/Box'
import { actions, selectors } from 'data'

import { Props as OwnProps, StateType as ParentStateType, SuccessStateType } from '..'

const BoxStyled = styled(Box)`
  width: 275px;
  margin-bottom: 24px;
`
const BoxStyledAdditional = styled(BoxStyled)`
  display: flex;
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
const IneligibleBanner = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 5%;
  align-items: center;
  align-content: center;
  justify-content: center;
`
const CloseLink = styled.div`
  cursor: pointer;
`

class IntroCard extends PureComponent<ParentStateType & Props & SuccessStateType, StateType> {
  constructor(props) {
    super(props)
    this.state = {
      showIntoModal: true,
      showSubmittedModal: true
    }
  }

  renderAdditionalInfo = () => {
    const { interestActions, interestUploadDocumentActions } = this.props
    const { showIntoModal } = this.state

    if (!showIntoModal) return null

    return (
      <BoxStyledAdditional>
        <ContentWrapper>
          <IconWrapper>
            <Image name='warning-circle-filled' width='32px' />

            <CloseLink
              data-e2e='upgradeToGoldCloseButton'
              onClick={() => {
                this.setState({ showIntoModal: false })
              }}
            >
              <Icon size='20px' color='grey400' name='close-circle' />
            </CloseLink>
          </IconWrapper>
          <Text size='20px' color='grey800' weight={600} style={{ marginTop: '16px' }}>
            <FormattedMessage
              id='copy.more_information_needed'
              defaultMessage='More Information Needed'
            />
          </Text>
          <Text
            size='14px'
            color='grey600'
            weight={500}
            style={{ lineHeight: 1.5, marginTop: '4px' }}
          >
            <FormattedMessage
              id='scenes.interest.additional_information_required_description'
              defaultMessage='Blockchain.com needs more information to verify your identity. This will speed up your future Deposits & Withrdawals as well as protect your account.'
            />
          </Text>
          <Link
            onClick={() => {
              interestUploadDocumentActions.showModal({
                origin: 'InterestUploadDocument'
              })
            }}
            style={{ width: '100%' }}
          >
            <Button
              data-e2e='earnInterestSupplyInformationGetStarted'
              fullwidth
              nature='primary'
              onClick={() => {
                interestActions.handleWithdrawalSupplyInformation({
                  origin: 'RewardsPage'
                })
              }}
              style={{ marginTop: '29px' }}
            >
              <FormattedMessage
                id='scenes.exchange.getstarted.status.getstarted.button'
                defaultMessage='Get Started'
              />
            </Button>
          </Link>
        </ContentWrapper>
      </BoxStyledAdditional>
    )
  }

  renderSubmittedInfo = () => {
    const { interestActions } = this.props
    const { showSubmittedModal } = this.state

    if (!showSubmittedModal) return null

    return (
      <BoxStyledAdditional>
        <ContentWrapper>
          <IconWrapper>
            <SpinningLoader height='14px' width='14px' borderWidth='4px' />

            <CloseLink
              data-e2e='upgradeToGoldCloseButton'
              onClick={() => {
                this.setState({ showSubmittedModal: false })
              }}
            >
              <Icon size='20px' color='grey400' name='close-circle' />
            </CloseLink>
          </IconWrapper>
          <Text size='20px' color='grey800' weight={600} style={{ marginTop: '16px' }}>
            <FormattedMessage
              id='scenes.interest.additional_information_submitted_title'
              defaultMessage='Documents Under Review'
            />
          </Text>
          <Text
            size='14px'
            color='grey600'
            weight={500}
            style={{ lineHeight: 1.5, marginTop: '4px' }}
          >
            <FormattedMessage
              id='scenes.interest.additional_information_submitted_description'
              defaultMessage='We’ve successfully received your documents! A Blockchain.com team member is reviewing now and will get back to you.'
            />
          </Text>
          <Link
            href='https://support.blockchain.com/hc/en-us/requests/new?ticket_form_id=360001711712'
            style={{ width: '100%' }}
            target='_blank'
          >
            <Button
              data-e2e='earnInterestSupplyInformationContactSupport'
              fullwidth
              nature='empty-blue'
              onClick={() => {
                interestActions.handleWithdrawalSupplyInformation({
                  origin: 'RewardsPage'
                })
              }}
              style={{ marginTop: '29px' }}
            >
              <FormattedMessage id='buttons.contact_support' defaultMessage='Contact Support' />
            </Button>
          </Link>
        </ContentWrapper>
      </BoxStyledAdditional>
    )
  }

  render() {
    const {
      idvActions,
      interestEDDStatus,
      interestRateArray,
      isGoldTier,
      preferencesActions,
      showInterestInfoBox,
      userData
    } = this.props
    const highestRate = interestRateArray.reduce((a, b) => Math.max(a, b))

    if (!isGoldTier && userData.kycState === 'REJECTED') {
      return (
        <IneligibleBanner>
          <div>
            <Icon name='alert-filled' color='error' size='40px' />
          </div>
          <Text size='16px' color='grey800' weight={600} style={{ marginTop: '16px' }}>
            <FormattedMessage
              id='scenes.interest.ineligible'
              defaultMessage='You are not currently eligible to use this feature.'
            />
          </Text>
        </IneligibleBanner>
      )
    }

    return (
      <>
        {interestEDDStatus?.eddNeeded &&
          !interestEDDStatus?.eddSubmitted &&
          !interestEDDStatus?.eddPassed &&
          this.renderAdditionalInfo()}
        {interestEDDStatus?.eddSubmitted &&
          interestEDDStatus?.eddSubmitted &&
          !interestEDDStatus?.eddPassed &&
          this.renderSubmittedInfo()}
        {showInterestInfoBox && !interestEDDStatus?.eddNeeded && (
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
                <Text size='20px' color='grey800' weight={600} style={{ marginTop: '16px' }}>
                  <FormattedMessage
                    id='scenes.interest.earnheaderverified'
                    defaultMessage='Earn rewards on your crypto today.'
                  />
                </Text>
                <Text
                  size='14px'
                  color='grey600'
                  weight={500}
                  style={{ lineHeight: 1.5, marginTop: '4px' }}
                >
                  <FormattedMessage
                    id='scenes.interest.earninfo.verified.copy'
                    defaultMessage='Earn up to {highestRate}% annually when you transfer crypto to your Rewards Account.'
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
                    style={{ marginTop: '45px' }}
                  >
                    <FormattedMessage id='buttons.learn_more' defaultMessage='Learn More' />
                  </Button>
                </Link>
              </ContentWrapper>
            ) : (
              <ContentWrapper>
                <Icon name='percentage' color='blue600' size='32px' />
                <Text size='20px' color='grey800' weight={600} style={{ marginTop: '16px' }}>
                  <FormattedMessage
                    id='scenes.interest.earnupgrade.header'
                    defaultMessage='Upgrade to Gold Level so you can earn rewards on your crypto.'
                  />
                </Text>
                <Text
                  size='14px'
                  color='grey600'
                  weight={500}
                  style={{ lineHeight: 1.5, marginTop: '10px' }}
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
                    idvActions.verifyIdentity({
                      needMoreInfo: false,
                      origin: 'Interest',
                      tier: 2
                    })
                  }
                >
                  {userData.kycState === 'UNDER_REVIEW' || userData.kycState === 'PENDING' ? (
                    <FormattedMessage
                      id='scenes.interest.kycunderreview'
                      defaultMessage='Gold Verification In Review'
                    />
                  ) : (
                    <FormattedMessage id='scenes.interest.verifyid' defaultMessage='Upgrade Now' />
                  )}
                </Button>
              </ContentWrapper>
            )}
          </BoxStyled>
        )}
      </>
    )
  }
}

const mapStateToProps = (state) => ({
  showInterestInfoBox: selectors.preferences.getShowInterestInfoBox(state)
})

const mapDispatchToProps = (dispatch) => ({
  interestActions: bindActionCreators(actions.components.interest, dispatch),
  interestUploadDocumentActions: bindActionCreators(
    actions.components.interestUploadDocument,
    dispatch
  ),
  preferencesActions: bindActionCreators(actions.preferences, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = OwnProps & ConnectedProps<typeof connector>

export type StateType = {
  showIntoModal: boolean
  showSubmittedModal: boolean
}

export default connector(IntroCard)
