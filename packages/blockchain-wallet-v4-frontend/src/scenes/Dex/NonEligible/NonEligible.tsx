import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'
import { Button } from '@blockchain-com/constellation'

import { actions, model } from 'data'

import { InfoWidget, PageWrapper, SceneCard } from '../components'

const { DEX_SUPPORT_SECTION_URL } = model.components.dex

export const NonEligible = () => {
  const dispatch = useDispatch()
  const onClickLearnMore = () => {
    dispatch(actions.router.push(DEX_SUPPORT_SECTION_URL))
  }

  return (
    <PageWrapper>
      <SceneCard height={300}>
        <InfoWidget
          imageWidth='90px'
          image='dex-onboarding-slide-not-eligible'
          title={
            <FormattedMessage
              id='dex.onboarding.notEligible.title'
              defaultMessage='Currently unavailable'
            />
          }
          description={
            <FormattedMessage
              id='dex.onboarding.notEligible.description'
              defaultMessage='The DEX is not yet available in your account.'
            />
          }
        />
        <Button
          width='full'
          size='default'
          variant='minimal'
          text={
            <FormattedMessage
              id='dex.onboarding.notEligible.learnMoreAction'
              defaultMessage='Learn more'
            />
          }
          onClick={onClickLearnMore}
        />
      </SceneCard>
    </PageWrapper>
  )
}
