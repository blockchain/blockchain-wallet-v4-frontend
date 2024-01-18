import React, { useCallback, useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { getCurrency } from '@core/redux/settings/selectors'
import { ProductTypes } from '@core/types'
import { Icon, Text } from 'blockchain-info-components'
import CircularProgressBar from 'components/CircularProgressBar'
import { cache, modals } from 'data/actions'
import { buySell, identityVerification } from 'data/components/actions'
import { getVerificationSteps } from 'data/components/identityVerification/selectors'
import { ModalName } from 'data/modals/types'

import ANNOUNCEMENTS from '../constants'
import { BannerButton, CloseLink, IconWrapper, Wrapper } from '../styles'

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

const CompleteYourProfile = () => {
  const dispatch = useDispatch()

  const verificationSteps = useSelector(getVerificationSteps).getOrElse({ items: [] })
  const fiatCurrency = useSelector(getCurrency).getOrElse('USD')

  useEffect(() => {
    dispatch(identityVerification.fetchVerificationSteps())
    dispatch(buySell.fetchCards(false))
    dispatch(buySell.fetchPaymentMethods(fiatCurrency))
    dispatch(buySell.fetchAccumulatedTrades({ product: ProductTypes.SIMPLEBUY }))
  }, [])

  const handleClick = useCallback(() => {
    dispatch(
      modals.showModal(ModalName.COMPLETE_USER_PROFILE, {
        origin: 'SideNav'
      })
    )
  }, [])

  const onCloseClick = () => {
    dispatch(cache.announcementDismissed(ANNOUNCEMENTS.COMPLETE_PROFILE))
  }

  if (verificationSteps === '') return null

  const itemsLength = verificationSteps?.items?.length ?? 0
  const completedSteps =
    verificationSteps?.items?.filter((step) => step.status === 'COMPLETED').length ?? 0

  const percentage = itemsLength ? (completedSteps / itemsLength) * 100 : 0

  return (
    <Wrapper>
      <Row>
        <IconWrapper>
          <CircularProgressBar percentage={percentage} strokeWidth={12}>
            <Text size='16px' color='blue600' weight={600}>
              {`${completedSteps}/${itemsLength}`}
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

      <CloseLink data-e2e='completeYourProfileClose' onClick={onCloseClick}>
        <Icon size='20px' color='grey400' name='close-circle' />
      </CloseLink>
    </Wrapper>
  )
}

export default CompleteYourProfile
