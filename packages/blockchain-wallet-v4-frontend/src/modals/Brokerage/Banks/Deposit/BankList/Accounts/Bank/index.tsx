import { FormattedMessage } from 'react-intl'
import React, { ReactElement } from 'react'
import styled from 'styled-components'

import { ActiveToggle } from 'services/ActiveToggleService'
import { BankDetails } from 'core/types'
import {
  DisplayContainer,
  DisplayIcon,
  MultiRowContainer
} from 'components/SimpleBuy'
import { SuccessCartridge } from 'components/Cartridge'
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

const CartridgeContainer = styled.div`
  display: flex;
  margin-top: 8px;
  align-items: center;
`

type Props = {
  bankDetails: BankDetails
  icon: ReactElement
  isActive: boolean
  onClick: () => void
  text: string
}

const Bank: React.FC<Props> = ({
  icon,
  text,
  bankDetails,
  onClick,
  isActive
}) => (
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
      <CartridgeContainer>
        <SuccessCartridge>
          <FormattedMessage id='modals.brokerage.free' defaultMessage='Free' />
        </SuccessCartridge>
      </CartridgeContainer>
    </MultiRowContainer>
    <ActiveToggle isActive={isActive} />
  </DisplayContainer>
)

export default Bank
