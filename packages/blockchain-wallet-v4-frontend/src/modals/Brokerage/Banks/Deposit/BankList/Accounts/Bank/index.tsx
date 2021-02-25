import React, { ReactElement } from 'react'
import styled from 'styled-components'

import { BankDetails } from 'core/types'
import {
  DisplayContainer,
  DisplayIcon,
  MultiRowContainer
} from 'components/SimpleBuy'
import { Title, Value } from 'components/Flyout'

const StyledTitle = styled(Title)`
  text-transform: capitalize;
  color: ${p => p.theme.grey600};
  font-weight: 500;
  font-size: 14px;
`

const StyledValue = styled(Value)`
  color: ${p => p.theme.grey900};
  font-weight: 600;
  font-size: 16px;
`

type Props = {
  bankDetails: BankDetails
  icon: ReactElement
  onClick: () => void
  text: string
}

const Bank: React.FC<Props> = ({ icon, text, bankDetails, onClick }) => (
  <DisplayContainer
    data-e2e={`sb${bankDetails.bankAccountType.toLowerCase()}Banks`}
    role='button'
    onClick={onClick}
  >
    <DisplayIcon>{icon}</DisplayIcon>
    <MultiRowContainer>
      <StyledValue asTitle>{text}</StyledValue>
      <StyledTitle asValue>
        {`${bankDetails.bankAccountType.toLowerCase()} account ${
          bankDetails.accountNumber
        }`}
      </StyledTitle>
    </MultiRowContainer>
  </DisplayContainer>
)

export default Bank
