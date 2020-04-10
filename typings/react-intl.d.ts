declare module 'react-intl' {
  import { StatelessComponent } from 'react'

  export const injectIntl

  export const FormattedMessage: StatelessComponent<{
    className?: string
    defaultMessage: string
    id: string
    values?: any
  }>

  export const FormattedHTMLMessage: StatelessComponent<{
    defaultMessage: string
    id: string
    values?: any
  }>
}
