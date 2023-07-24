import React from 'react'
import { FormattedMessage } from 'react-intl'
import { DefaultTheme, withTheme } from 'styled-components'

import CircularProgressBar from 'components/CircularProgressBar'
import { useCountDown } from 'hooks'

import { Highlight, ProgressWrapper, Root, Text } from './QuoteCountDown.model'

type Props = {
  date: Date
  theme: DefaultTheme
  totalMs: number
}

export const QuoteCountDown = withTheme(({ date, theme, totalMs }: Props) => {
  const { isCompleted, isCompletingSoon, percentage, timer } = useCountDown(date, totalMs)

  return (
    <Root>
      <ProgressWrapper>
        <CircularProgressBar
          strokeWidth={15}
          percentage={percentage}
          styles={{
            strokeLinecap: 'butt',
            trailColor: theme.blue100
          }}
        />
      </ProgressWrapper>

      <Text>
        <FormattedMessage id='modals.quote.countdown' defaultMessage='New quote in:' />{' '}
        <Highlight isHighlighted={isCompletingSoon}>
          {isCompleted ? <FormattedMessage id='modals.quote.soon' defaultMessage='soon' /> : timer}
        </Highlight>
      </Text>
    </Root>
  )
})
