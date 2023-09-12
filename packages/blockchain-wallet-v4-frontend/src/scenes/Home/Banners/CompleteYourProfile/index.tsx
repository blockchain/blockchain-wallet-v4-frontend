import React, { useCallback, useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import styled from 'styled-components'

import { ProductTypes } from '@core/types'
import { Icon, Text } from 'blockchain-info-components'
import CircularProgressBar from 'components/CircularProgressBar'
import { actions, selectors } from 'data'
import { ModalName } from 'data/modals/types'
import { RootState } from 'data/rootReducer'
import { Analytics } from 'data/types'

import ANNOUNCEMENTS from '../constants'
import { BannerButton, CloseLink, IconWrapper, Wrapper } from '../styles'
import { getData } from './selectors'

const MAX_STEPS = 3

const Row = styled.div`
  display: flex;
  align-items: center;
`
const CentralRow = styled(Row)`
  flex: 1;
`
const Column = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  flex: 1;
`

const CompleteYourProfile = ({
  analyticsActions,
  buySellActions,
  cacheActions,
  data,
  fiatCurrency,
  modalActions
}: Props) => {
  useEffect(() => {
    buySellActions.fetchCards(false)
    buySellActions.fetchPaymentMethods(fiatCurrency)
    buySellActions.fetchAccumulatedTrades({ product: ProductTypes.SIMPLEBUY })
  }, [fiatCurrency, buySellActions])

  const { currentStep } = data
  const percentage = currentStep ? (currentStep / MAX_STEPS) * 100 : 0

  const handleClick = useCallback(() => {
    modalActions.showModal(ModalName.COMPLETE_USER_PROFILE, {
      origin: 'SideNav'
    })
    analyticsActions.trackEvent({
      key: Analytics.ONBOARDING_COMPLETE_PROFILE_BANNER_CLICKED,
      properties: {
        current_step_completed: String(currentStep)
      }
    })
  }, [modalActions])

  return (
    <Wrapper>
      <Row>
        <IconWrapper>
          <CircularProgressBar percentage={percentage} strokeWidth={12}>
            <Text size='16px' color='blue600' weight={600}>
              {`${currentStep}/${MAX_STEPS}`}
            </Text>
          </CircularProgressBar>
        </IconWrapper>
      </Row>
      <CentralRow>
        <Column>
          <Text size='20px' weight={600} color='grey800'>
            <FormattedMessage
              id='scenes.home.banner.complete_your_profile.complete_your_profile_and_buy'
              defaultMessage='Complete Your Profile. Buy Crypto Today.'
            />
          </Text>
          <Text size='16px' weight={500} color='grey800'>
            <FormattedMessage
              id='scenes.home.banner.complete_your_profile.complete_your_profile_description'
              defaultMessage='Finish setting up your Blockchain.com Account and start buying crypto today.'
            />
          </Text>
        </Column>
      </CentralRow>

      <BannerButton
        onClick={handleClick}
        jumbo
        data-e2e='completeMyProfileGetStarted'
        nature='primary'
      >
        <FormattedMessage id='modals.send.banner.get_started' defaultMessage='Get Started' />
      </BannerButton>

      <CloseLink
        data-e2e='newCoinCloseButton'
        onClick={() => cacheActions.announcementDismissed(ANNOUNCEMENTS.COMPLETE_PROFILE)}
      >
        <Icon size='20px' color='grey400' name='close-circle' />
      </CloseLink>
    </Wrapper>
  )
}

const mapStateToProps = (state: RootState) => ({
  data: getData(state),
  fiatCurrency: selectors.core.settings.getCurrency(state).getOrElse('USD')
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  buySellActions: bindActionCreators(actions.components.buySell, dispatch),
  cacheActions: bindActionCreators(actions.cache, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = ConnectedProps<typeof connector>

export default connector(CompleteYourProfile)
