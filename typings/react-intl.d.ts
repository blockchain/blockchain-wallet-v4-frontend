declare module 'react-intl' {
  import {
    DefaultMessageType,
    MessageIdType
  } from 'blockchain-wallet-v4-frontend/src/assets/locales'
  import { StatelessComponent } from 'react'

  export const injectIntl

  export const FormattedMessage: StatelessComponent<{
    className?: string
    defaultMessage: DefaultMessageType
    id: MessageIdType
    values?: any
  }>

  export const FormattedHTMLMessage: StatelessComponent<{
    defaultMessage: DefaultMessageType
    id: MessageIdType
    values?: any
  }>
}
