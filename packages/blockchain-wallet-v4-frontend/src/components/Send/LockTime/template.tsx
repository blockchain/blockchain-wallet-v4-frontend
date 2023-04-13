import React from 'react'
import styled, { css } from 'styled-components'

import { WithdrawalLockResponseType } from '@core/types'
import WithdrawalLockHold from 'components/Brokerage/WithdrawalLockHold'
import { BlueCartridge } from 'components/Cartridge'

const customCartridge = css`
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
`
const CustomBlueCartridge = styled(BlueCartridge)`
  ${customCartridge}
`

const LockTime = ({ withdrawalLocks }: Props) =>
  withdrawalLocks.totalLocked.amount !== '0' ? (
    <CustomBlueCartridge>
      (
      <WithdrawalLockHold
        amount={withdrawalLocks.totalLocked.amount}
        currency={withdrawalLocks.totalLocked.currency}
        mode='tooltip'
      />
      )
    </CustomBlueCartridge>
  ) : null

type Props = {
  withdrawalLocks: WithdrawalLockResponseType
}

export default LockTime
