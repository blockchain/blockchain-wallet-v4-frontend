import { Button, Text } from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'
import React from 'react'
import styled from 'styled-components'

const AddNewButton = styled(Button)`
  padding: 8px 16px;
  margin: 0 auto;
  margin-top: 40px;
  margin-bottom: 40px;
  width: 83%;
  color: ${props => props.theme.blue600};
  border-color: ${props => props.theme.grey100};
`

const StyledText = styled(Text)`
  width: 300px;
`

const BROKERAGE_INELIGIBLE = 'BROKERAGE_INELIGIBLE'
const IneligibleErrorMessage = () => (
  <StyledText size='16px' weight={400}>
    <FormattedMessage
      id='modals.brokerage.ineligible_error'
      defaultMessage='You are not eligible to make deposits and withdrawals with this currency.'
    />
  </StyledText>
)

export { AddNewButton, BROKERAGE_INELIGIBLE, IneligibleErrorMessage }
