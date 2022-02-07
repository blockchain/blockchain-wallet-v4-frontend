import React, { ReactElement } from 'react'
import styled from 'styled-components'

import { BSPaymentMethodType } from '@core/types'
import { DisplayContainer, DisplayIcon, MultiRowContainer } from 'components/BuySell'
import { Title, Value } from 'components/Flyout'

const StyledTitle = styled(Title)`
  text-transform: capitalize;
  color: ${(p) => p.theme.grey600};
  font-weight: 500;
  font-size: 14px;
`

const StyledValue = styled(Value)`
  color: ${(p) => p.theme.grey900};
  font-weight: 600;
  font-size: 16px;
`

type Props = {
  icon: ReactElement
  onClick: () => void
  text: string | ReactElement
  value: BSPaymentMethodType
}

const Bank = ({ icon, onClick, text, value }: Props) => (
  <DisplayContainer data-e2e={`sb${value.type.toLowerCase()}Banks`} role='button' onClick={onClick}>
    <DisplayIcon>{icon}</DisplayIcon>
    <MultiRowContainer>
      <StyledValue asTitle>{text}</StyledValue>
      <StyledTitle asValue>
        {`${value.details?.bankAccountType?.toLowerCase() || ''} account ${
          value.details?.accountNumber || ''
        }`}
      </StyledTitle>
    </MultiRowContainer>
  </DisplayContainer>
)

export default Bank
