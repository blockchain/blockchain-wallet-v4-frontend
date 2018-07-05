import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;

  > * { margin: 0 0 0 2px; }
`

export const InvalidAmountMessageMin = () => (
  <FormattedMessage id='modals.requestbtc.amountnotminmessage' defaultMessage='Must be greater than 0' />
)

export const InvalidAmountMessageMax = () => (
  <FormattedMessage id='modals.requestbtc.amountnotmaxmessage' defaultMessage='Cannot exceed 21,000,000' />
)