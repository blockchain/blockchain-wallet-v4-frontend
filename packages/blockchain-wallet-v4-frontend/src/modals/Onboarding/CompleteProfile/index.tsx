import React, { PureComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, compose, Dispatch } from 'redux'
import styled from 'styled-components'

import { ProductTypes } from '@core/types'
import { Icon, Text } from 'blockchain-info-components'
import CircularProgressBar from 'components/CircularProgressBar'
import Flyout, { duration, FlyoutChild, FlyoutWrapper } from 'components/Flyout'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { Analytics, ModalName } from 'data/types'
import ModalEnhancer from 'providers/ModalEnhancer'

import { ModalPropsType } from '../../types'
import LinkItem from './LinkItem'
import { ActionButton } from './model'
import { getData } from './selectors'
import { COMPLETE_PROFILE_STEPS } from './types'

const MAX_STEPS = 3

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`

const HeaderWrapper = styled(FlyoutWrapper)`
  height: unset;
  padding-bottom: 0px;
`

const ContentWrapper = styled(FlyoutWrapper)`
  padding-top: 24px;
`

const TopText = styled(Text)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 7px;
`

const ProgressRow = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
`

const ProgressWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  width: 40px;
  min-width: 40px;
  border-radius: 20px;
  margin-left: 32px;
`

const CloseIconContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${(props) => props.theme.grey000};
  backdrop-filter: blur(54.3656px);
  > span {
    justify-content: center;
  }
`

const CentralContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`
const LinksWrapper = styled(CentralContainer)`
  padding-top: 26px;
`

const FooterWrapper = styled(FlyoutWrapper)`
  flex: 1;
  justify-content: flex-end;
  display: flex;
  flex-direction: column;
  margin-top: -16px;
`

class CompleteProfile extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { show: false }
  }

  componentDidMount() {
    /* eslint-disable */
    this.setState({ show: true })
    /* eslint-enable */
    this.props.buySellActions.fetchCards(false)
    this.props.buySellActions.fetchPaymentMethods(this.props.fiatCurrency)
    this.props.buySellActions.fetchAccumulatedTrades({ product: ProductTypes.SIMPLEBUY })

    const { currentStep } = this.props.data
    this.props.analyticsActions.trackEvent({
      key: Analytics.ONBOARDING_COMPLETE_PROFILE_MODAL_VIEWED,
      properties: { current_step_completed: String(currentStep) }
    })
  }

  handleClose = () => {
    this.setState({ show: false })
    const { currentStep } = this.props.data
    this.props.analyticsActions.trackEvent({
      key: Analytics.ONBOARDING_COMPLETE_PROFILE_MODAL_CLOSED,
      properties: { current_step_completed: String(currentStep) }
    })
    setTimeout(() => {
      this.props.close()
    }, duration)
  }

  startVerification = () => {
    this.props.identityVerificationActions.verifyIdentity({
      needMoreInfo: false,
      origin: 'CompleteProfile',
      tier: 2
    })
    this.props.modalActions.closeModal(ModalName.COMPLETE_USER_PROFILE)
    this.trackButtonEvent(COMPLETE_PROFILE_STEPS.VERIFY, false)
  }

  startAddingCards = () => {
    this.props.buySellActions.showModal({ origin: 'CompleteProfile' })
    this.props.buySellActions.setFiatCurrency(this.props.fiatCurrency || 'USD')
    this.props.buySellActions.setStep({
      step: 'DETERMINE_CARD_PROVIDER'
    })
    this.props.modalActions.closeModal(ModalName.COMPLETE_USER_PROFILE)
  }

  handleLinkBankOrCardClick = () => {
    const { data } = this.props
    const { isVerifiedId } = data

    this.trackButtonEvent(COMPLETE_PROFILE_STEPS.LINK_PAYMENT, false)

    if (isVerifiedId) {
      this.startAddingCards()
    } else {
      this.startVerification()
    }
  }

  handleBuyCryptoClick = (isButtonClick: boolean) => {
    const { data } = this.props
    const { isBankOrCardLinked, isVerifiedId } = data

    if (!isButtonClick) {
      this.trackButtonEvent(COMPLETE_PROFILE_STEPS.BUY_CRYPTO, false)
    }

    if (isBankOrCardLinked) {
      this.props.buySellActions.showModal({ origin: 'CompleteProfile' })
      this.props.buySellActions.setFiatCurrency(this.props.fiatCurrency || 'USD')
      this.trackButtonEvent(COMPLETE_PROFILE_STEPS.BUY_CRYPTO, isButtonClick)
    } else if (isVerifiedId) {
      this.startAddingCards()
      return
    } else {
      this.props.identityVerificationActions.verifyIdentity({
        needMoreInfo: false,
        origin: 'CompleteProfile',
        tier: 2
      })
      this.trackButtonEvent(COMPLETE_PROFILE_STEPS.VERIFY, false)
    }
    this.props.modalActions.closeModal(ModalName.COMPLETE_USER_PROFILE)
  }

  trackButtonEvent = (eventType: COMPLETE_PROFILE_STEPS, isButtonClick: boolean) => {
    const { currentStep } = this.props.data
    this.props.analyticsActions.trackEvent({
      key: Analytics.ONBOARDING_COMPLETE_PROFILE_MODAL_BUTTON_CLICKED,
      properties: {
        button_clicked: isButtonClick,
        current_step_completed: String(currentStep),
        item: eventType
      }
    })
  }

  render() {
    const { data } = this.props
    const { currentStep, isBankOrCardLinked, isBuyCrypto, isKycPending, isVerifiedId } = data
    const percentage = currentStep ? (currentStep / MAX_STEPS) * 100 : 0

    return (
      <Flyout
        {...this.props}
        isOpen={this.state.show}
        onClose={this.handleClose}
        data-e2e='completeProfileModal'
      >
        <FlyoutChild>
          <Wrapper>
            <HeaderWrapper>
              <TopText color='grey800' size='20px' weight={600}>
                <ProgressRow>
                  <ProgressWrapper>
                    <CircularProgressBar percentage={percentage} strokeWidth={12}>
                      <Text size='16px' color='blue600' weight={600}>
                        {`${currentStep}/${MAX_STEPS}`}
                      </Text>
                    </CircularProgressBar>
                  </ProgressWrapper>
                </ProgressRow>
                <CloseIconContainer>
                  <Icon
                    cursor
                    data-e2e='completeProfileCloseModalIcon'
                    name='close'
                    size='20px'
                    color='grey600'
                    role='button'
                    onClick={this.handleClose}
                  />
                </CloseIconContainer>
              </TopText>
              <Text size='12px' color='grey600' weight={500} style={{ textAlign: 'center' }}>
                <FormattedMessage
                  id='modal.complete_profile.note'
                  defaultMessage='Your steps towards owning the future.'
                />
              </Text>
            </HeaderWrapper>
            <ContentWrapper>
              <Text
                size='24px'
                weight={600}
                color='grey900'
                style={{ flex: 1, textAlign: 'center' }}
              >
                <FormattedMessage
                  id='scenes.home.banner.complete_your_profile.complete_your_profile'
                  defaultMessage='Complete Your Profile.'
                />
              </Text>
              <Text
                size='24px'
                weight={600}
                color='grey900'
                style={{ flex: 1, textAlign: 'center' }}
              >
                <FormattedMessage
                  id='scenes.home.banner.complete_your_profile.buy_crypto_today'
                  defaultMessage='Buy Crypto Today.'
                />
              </Text>
              <Text
                size='16px'
                weight={500}
                color='grey900'
                style={{ flex: 1, marginTop: '8px', textAlign: 'center' }}
              >
                <FormattedMessage
                  id='modal.complete_profile.finish_settings'
                  defaultMessage='Finish setting up your Blockchain.com account and start buying crypto today.'
                />
              </Text>

              <LinksWrapper>
                <LinkItem
                  onClick={this.startVerification}
                  isComplete={isVerifiedId}
                  isKycPending={isKycPending}
                  type={COMPLETE_PROFILE_STEPS.VERIFY}
                />

                <LinkItem
                  onClick={this.handleLinkBankOrCardClick}
                  isComplete={isBankOrCardLinked}
                  type={COMPLETE_PROFILE_STEPS.LINK_PAYMENT}
                />

                <LinkItem
                  onClick={() => this.handleBuyCryptoClick(true)}
                  isComplete={isBuyCrypto}
                  type={COMPLETE_PROFILE_STEPS.BUY_CRYPTO}
                />
              </LinksWrapper>
            </ContentWrapper>

            <FooterWrapper>
              <ActionButton
                currentStep={currentStep}
                onClick={() => this.handleBuyCryptoClick(false)}
              />
            </FooterWrapper>
          </Wrapper>
        </FlyoutChild>
      </Flyout>
    )
  }
}

const mapStateToProps = (state: RootState) => ({
  data: getData(state),
  fiatCurrency: selectors.core.settings.getCurrency(state).getOrElse('USD')
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  buySellActions: bindActionCreators(actions.components.buySell, dispatch),
  identityVerificationActions: bindActionCreators(
    actions.components.identityVerification,
    dispatch
  ),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

const enhance = compose(
  ModalEnhancer(ModalName.COMPLETE_USER_PROFILE, { transition: duration }),
  connector
)

export type Props = ModalPropsType & ConnectedProps<typeof connector>
type State = { show: boolean }

export default enhance(CompleteProfile)
