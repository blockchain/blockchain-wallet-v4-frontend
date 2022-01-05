import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import styled from 'styled-components'

import { Button, Link, Text, TextGroup } from 'blockchain-info-components'
import CircularProgressBar from 'components/CircularProgressBar'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { media } from 'services/styles'

import { getData } from './selectors'

const MAX_STEPS = 3

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
`
const BannerButton = styled(Button)`
  height: 48px;
  ${media.mobile`
    font-size: 14px;
    margin-top: 16px;
    padding: 10px;
  `}
`

const CompleteYourProfile = ({ buySellActions, data, fiatCurrency, verifyIdentity }: Props) => {
  useEffect(() => {
    buySellActions.fetchCards(false)
    buySellActions.fetchPaymentMethods(fiatCurrency)
    buySellActions.fetchBalance({ skipLoading: true })
  }, [fiatCurrency, buySellActions])

  const { currentStep } = data
  const percentage = currentStep ? currentStep / MAX_STEPS : 0

  return (
    <Wrapper>
      <Row>
        <PendingIconWrapper>
          <CircularProgressBar percentage={percentage} strokeWidth={12}>
            <Text size='16px' color='blue600' weight={600}>
              {`${currentStep}/${MAX_STEPS}`}
            </Text>
          </CircularProgressBar>
        </PendingIconWrapper>
      </Row>
      <Row>
        <TextGroup inline>
          <Text size='20px' weight={600} color='grey800'>
            <FormattedMessage
              id='scenes.home.banner.complete_your_profile.complete_your_profile'
              defaultMessage='Complete Your Profile.'
            />
          </Text>
          <Link
            size='20px'
            weight={600}
            onClick={() => buySellActions.showModal({ origin: 'CompleteProfileBanner' })}
          >
            <FormattedMessage
              id='scenes.home.banner.complete_your_profile.buy_crypto_today'
              defaultMessage='Buy Crypto Today.'
            />
          </Link>
        </TextGroup>
      </Row>

      <BannerButton
        onClick={verifyIdentity}
        jumbo
        data-e2e='completeMyProfileGetStarted'
        nature='primary'
      >
        <FormattedMessage id='modals.send.banner.get_started' defaultMessage='Get Started' />
      </BannerButton>
    </Wrapper>
  )
}

const mapStateToProps = (state: RootState) => ({
  data: getData(state),
  fiatCurrency: selectors.core.settings.getCurrency(state).getOrElse('USD')
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  buySellActions: bindActionCreators(actions.components.buySell, dispatch),
  verifyIdentity: () =>
    dispatch(
      actions.components.identityVerification.verifyIdentity({
        needMoreInfo: false,
        origin: 'DashboardPromo',
        tier: 2
      })
    )
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = ConnectedProps<typeof connector>

export default connector(CompleteYourProfile)
