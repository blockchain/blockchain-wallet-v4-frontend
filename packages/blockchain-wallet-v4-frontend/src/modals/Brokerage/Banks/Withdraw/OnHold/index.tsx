import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Loading, LoadingTextEnum } from 'blockchain-wallet-v4-frontend/src/modals/components'

import { OnHold } from 'components/Flyout/Brokerage'
import { FlyoutOopsError } from 'components/Flyout/Errors'
import { withdraw } from 'data/components/actions'
import { useRemote } from 'hooks'

import { getData } from './selectors'

const DepositMethods = ({ handleClose }: Props) => {
  const dispatch = useDispatch()
  const { data, error, isLoading, isNotAsked } = useRemote(getData)

  useEffect(() => {
    if (data) {
      dispatch(
        withdraw.fetchWithdrawalLock({
          currency: data.tradingCurrencies.defaultWalletCurrency
        })
      )
    }
  }, [])

  if (error)
    return <FlyoutOopsError action='close' data-e2e='depositTryAgain' handler={handleClose} />

  if (isLoading || isNotAsked || !data) return <Loading text={LoadingTextEnum.LOADING} />

  return (
    <OnHold
      fiatCurrency={data.withdrawalLocks.totalLocked.currency}
      handleHeaderClick={handleClose}
      locks={data.withdrawalLocks.locks}
      totalLockedAmount={data.withdrawalLocks.totalLocked.amount}
    />
  )
}

type Props = {
  handleClose: () => void
}

export default DepositMethods
