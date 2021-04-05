import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'

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

export { BROKERAGE_INELIGIBLE, IneligibleErrorMessage }
