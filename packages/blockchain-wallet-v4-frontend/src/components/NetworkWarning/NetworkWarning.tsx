import React from 'react'
import { IntlFormatters, useIntl } from 'react-intl'
import { AlertCard } from '@blockchain-com/constellation'

import { AlertCardWrapper } from './NetworkWarning.model'
import { Variant, Warning } from './types'

const getSendProps = (warning: Warning, formatMessage: IntlFormatters['formatMessage']) => ({
  content: formatMessage(
    {
      defaultMessage:
        'Please send {symbol} on the {network} Network for this wallet only. We cannot recover lost funds.',
      id: 'networkWarning.send.content'
    },
    warning
  ),
  title: formatMessage(
    {
      defaultMessage: 'Only send {symbol} on the {network} network',
      id: 'networkWarning.send.title'
    },
    warning
  )
})

const getReceiveProps = (warning: Warning, formatMessage: IntlFormatters['formatMessage']) => ({
  content: formatMessage(
    {
      defaultMessage:
        'Please receive {symbol} on the {network} Network for this address only. We cannot recover lost funds.',
      id: 'networkWarning.receive.content'
    },
    warning
  ),
  title: formatMessage(
    {
      defaultMessage: '{symbol} is on the {network} network',
      id: 'networkWarning.receive.title'
    },
    warning
  )
})

export type Props = {
  variant: Variant
  warning: Warning | null
}

export const NetworkWarning = ({ variant, warning }: Props) => {
  const { formatMessage } = useIntl()

  if (!warning) {
    return null
  }

  const sendReceiveProps =
    variant === Variant.SEND
      ? getSendProps(warning, formatMessage)
      : getReceiveProps(warning, formatMessage)

  return (
    <AlertCardWrapper>
      <AlertCard
        variant='warning'
        primaryCta={{
          onClick: () => {
            window.open(
              'https://support.blockchain.com/hc/en-us/articles/6416326056092',
              '_blank',
              'noopener, noreferrer'
            )
          },
          text: formatMessage({
            defaultMessage: 'Learn more',
            id: 'buttons.learn_more'
          })
        }}
        {...sendReceiveProps}
      />
    </AlertCardWrapper>
  )
}
