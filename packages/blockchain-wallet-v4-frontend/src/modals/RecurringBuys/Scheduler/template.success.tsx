import React from 'react'
import { GreyBlueCartridge } from 'blockchain-wallet-v4-frontend/src/modals/Interest/DepositForm/model'
import styled from 'styled-components'

import { Tooltip, TooltipHost } from 'blockchain-info-components'
import { GreyCartridge } from 'components/Cartridge'
import { availableMethodsToolTip } from 'components/Flyout/model'

const DisplalyContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 8px;
`
const CustomGreyCartridge = styled(GreyCartridge)`
  border: 1px solid ${(p) => p.theme.grey100};
`

type SchedulerProps = {
  availableMethods: any
  children: React.ReactNode
  hasAvailablePeriods: boolean
  onClick: () => void
}
const Scheduler = ({
  availableMethods,
  children,
  hasAvailablePeriods,
  onClick
}: SchedulerProps) => {
  return (
    <DisplalyContainer>
      {hasAvailablePeriods ? (
        <GreyBlueCartridge
          onClick={onClick}
          style={{ marginLeft: '0' }}
          role='button'
          data-e2e='sbRecurringBuyScheduler'
        >
          {children}
        </GreyBlueCartridge>
      ) : (
        <TooltipHost id='recurring-buy-disabled'>
          <CustomGreyCartridge
            style={{ cursor: 'pointer' }}
            role='button'
            data-e2e='sbRecurringBuySchedulerDisabled'
          >
            {children}
          </CustomGreyCartridge>
          <Tooltip id='recurring-buy-disabled'>{availableMethodsToolTip(availableMethods)}</Tooltip>
        </TooltipHost>
      )}
    </DisplalyContainer>
  )
}

export default Scheduler
