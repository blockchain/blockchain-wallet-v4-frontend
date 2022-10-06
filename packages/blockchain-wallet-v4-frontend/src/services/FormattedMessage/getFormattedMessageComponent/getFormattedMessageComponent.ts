import { ReactNode } from 'react'

import Currencies from './FormattedMessages/Currencies'
import ExtraFields from './FormattedMessages/ExtraFields'

const getFormattedMessageComponent = (key: string): ReactNode | string => {
  const FormattedMessageComponents = {
    ...Currencies,
    ...ExtraFields,
    default: ''
  }

  return FormattedMessageComponents[key]
    ? FormattedMessageComponents[key]
    : FormattedMessageComponents.default
}

export default getFormattedMessageComponent
