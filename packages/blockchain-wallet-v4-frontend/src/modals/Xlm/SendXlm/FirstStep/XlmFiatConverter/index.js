import React from 'react'

import { FiatConverter } from 'components/Form'

export const XlmFiatConverter = ({ error, meta, ...rest }) => {
  if (error) meta.invalid = true
  return <FiatConverter meta={meta} {...rest} />
}
