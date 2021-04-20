declare module 'react-intl' {
  import {
    DefaultMessageType,
    MessageIdType
  } from 'blockchain-wallet-v4-frontend/src/assets/locales'
  import React from 'react'

  export const injectIntl

  export const FormattedMessage: React.FC<{
    className?: string
    defaultMessage: DefaultMessageType
    id: MessageIdType
    values?: any
  }>

  export const FormattedHTMLMessage: React.FC<{
    defaultMessage: DefaultMessageType
    id: MessageIdType
    values?: any
  }>
}
