import React from 'react'
import { useDispatch } from 'react-redux'

import { Button, Icon, Text } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'
import FlyoutFooter from 'components/Flyout/Footer'
import { modals } from 'data/actions'

import RetryInPill from './RetryInPill'
import { QuizSubmitResult } from './types'

const getIcon = (status) => {
  return status === 'SUCCESS'
    ? {
        iconColor: 'success',
        iconName: 'checkmark-circle-filled',
        title: 'Congratulations! You aced it!'
      }
    : { iconColor: 'error', iconName: 'close-circle', title: "You didn't pass" }
}

const STATUS_ELEMENTS = {
  RETRY: {
    iconColor: 'error',
    iconName: 'close-circle',
    subtitle: "You couldn't show us that you understood the risks of investing in cryptocurrency",
    title: "You didn't pass"
  },
  RETRY_LATER: {
    iconColor: 'error',
    iconName: 'close-circle',
    subtitle:
      "You answered one or more of the questions incorrectly. You'll have to wait 24 hours before trying again.",
    title: "You didn't pass"
  },
  SUCCESS: {
    iconColor: 'success',
    iconName: 'checkmark-circle-filled',
    subtitle: 'You have a good understanding of crypto and the risks involved.',
    title: 'Congratulations! You aced it!'
  }
}

const SelfAssessmentFinalPage = ({ nextRetryDate, status }: QuizSubmitResult) => {
  const dispatch = useDispatch()

  const onContinue = () => {}

  const onGoback = () => {}

  const { iconColor, iconName, subtitle, title } = STATUS_ELEMENTS[status]

  const isSuccess = status === 'SUCCESS'
  const isRetryNow = status === 'RETRY'
  const isRetryLater = status === 'RETRY_LATER' && nextRetryDate

  return (
    <>
      <Icon color={iconColor} name={iconName} size='88px' />
      <Text size='20px' weight={600} lineHeight='30px' color='grey900'>
        {title}
      </Text>
      <Text size='16px' weight={500} lineHeight='24px' color='grey600'>
        {subtitle}
      </Text>
      {isRetryNow && (
        <>
          <Text size='16px' weight={500} lineHeight='24px' color='grey600'>
            To learn more about this please see LINK
          </Text>
          <Text size='16px' weight={500} lineHeight='24px' color='grey600'>
            If you fail to pass after two attempts, you&apos;ll have to wait 24 hours before trying
            again.
          </Text>
        </>
      )}
      {isRetryLater && (
        <>
          <Text size='16px' weight={500} lineHeight='24px' color='grey600'>
            In the meantime, tap the &quot;Take 2 minutes to learn more&quot; button to study up.
          </Text>
          <RetryInPill date={new Date(nextRetryDate)} />
        </>
      )}
      <FlyoutFooter collapsed>
        <Button
          data-e2e='submitKYCExtraQuestionsForm'
          height='48px'
          size='16px'
          nature='primary'
          type='submit'
          fullwidth
        >
          {isRetryLater ? 'Back to Dashboard' : 'Continue'}
        </Button>
      </FlyoutFooter>
    </>
  )
}

export default SelfAssessmentFinalPage
