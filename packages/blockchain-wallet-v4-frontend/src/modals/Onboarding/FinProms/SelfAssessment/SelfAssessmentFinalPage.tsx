import React, { useMemo } from 'react'

import { Button, Icon, Link, Text } from 'blockchain-info-components'
import { FlyoutContainer, FlyoutContent, FlyoutFooter } from 'components/Flyout/Layout'

import { FinalPageContent, ResultsWrapper } from './model'
import RetryInPill from './RetryInPill'
import { QuizSubmitResult } from './types'

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

const LEARN_MORE_LINK = 'https://www.blockchain.com/en/learning-portal/bitcoin-faq'

type Props = {
  handleClose: () => void
} & QuizSubmitResult

const SelfAssessmentFinalPage = ({ countdownDate = '', handleClose, status }: Props) => {
  const { iconColor, iconName, subtitle, title } = STATUS_ELEMENTS[status]

  const isRetryNow = status === 'RETRY'
  const isRetryLater = status === 'RETRY_LATER' && countdownDate

  const nextDate = useMemo(() => new Date(countdownDate), [countdownDate])

  return (
    <FlyoutContainer>
      <ResultsWrapper>
        <FlyoutContent mode='middle'>
          <FinalPageContent>
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
                  To learn more about this please see{' '}
                  <Link href={LEARN_MORE_LINK} target='_blank'>
                    here
                  </Link>
                  .
                </Text>
                <Text size='16px' weight={500} lineHeight='24px' color='grey600'>
                  If you fail to pass after two attempts, you&apos;ll have to wait 24 hours before
                  trying again.
                </Text>
              </>
            )}
            {isRetryLater && (
              <>
                <Text size='16px' weight={500} lineHeight='24px' color='grey600'>
                  In the meantime, click the{' '}
                  <Link href={LEARN_MORE_LINK} target='_blank'>
                    Take 2 minutes to learn more
                  </Link>{' '}
                  link to study up.
                </Text>
                <RetryInPill date={nextDate} />
              </>
            )}
          </FinalPageContent>
        </FlyoutContent>

        <FlyoutFooter collapsed>
          <Button
            data-e2e='submitKYCExtraQuestionsForm'
            height='48px'
            size='16px'
            nature='primary'
            onClick={handleClose}
            fullwidth
          >
            {isRetryLater ? 'Back to Dashboard' : 'Continue'}
          </Button>
        </FlyoutFooter>
      </ResultsWrapper>
    </FlyoutContainer>
  )
}

export default SelfAssessmentFinalPage
