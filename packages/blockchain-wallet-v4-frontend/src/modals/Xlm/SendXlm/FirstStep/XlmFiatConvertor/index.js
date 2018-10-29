import React from 'react'

import { FiatConvertor } from 'components/Form'

export const XlmFiatConvertor = ({ meta, error, ...rest }) => {
  if (error) meta.invalid = true
  return <FiatConvertor meta={meta} {...rest} />
}
