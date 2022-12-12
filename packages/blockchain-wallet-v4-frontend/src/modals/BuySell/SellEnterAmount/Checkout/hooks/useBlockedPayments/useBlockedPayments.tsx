import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import { Button, Image } from 'blockchain-info-components'
import { Flex } from 'components/Flex'
import { GenericNabuErrorCard } from 'components/GenericNabuErrorCard'
import { selectors } from 'data'
import { NabuError } from 'services/errors'

import { BlockedPaymentsHook } from './useBlockedPayments.types'

export const useBlockedPayments: BlockedPaymentsHook = (selectedMethod) => {
  const [isCardVisible, setCardVisibility] = useState<boolean>(false)
  const isFeatureEnabled = useSelector(
    selectors.core.walletOptions.getIsCreditCardOptimizationEnabled
  ).data

  const isPaymentMethodBlocked = useMemo(() => {
    if (!selectedMethod || !isFeatureEnabled) return false

    return !!selectedMethod.block
  }, [selectedMethod, isFeatureEnabled])

  const nabuError = useMemo(() => {
    if (!selectedMethod || !selectedMethod.ux) return

    return new NabuError(selectedMethod.ux)
  }, [selectedMethod])

  const paymentErrorCard = useMemo(() => {
    if (!nabuError || !isCardVisible) return

    return (
      <GenericNabuErrorCard
        error={nabuError}
        variant='error'
        onClickClose={() => setCardVisibility(false)}
        onActionClick={() => setCardVisibility(false)}
      />
    )
  }, [nabuError, isCardVisible])

  const paymentErrorButton = useMemo(() => {
    if (!isPaymentMethodBlocked || !nabuError) return

    return (
      <Button
        data-e2e='EnterAmount.paymentMethodBlockedButton'
        nature='dark'
        rounded
        fullwidth
        onClick={() => setCardVisibility(true)}
      >
        <Flex alignItems='center' gap={8}>
          <Image name='alert-orange' />
          {nabuError.title}
        </Flex>
      </Button>
    )
  }, [isPaymentMethodBlocked, setCardVisibility, nabuError])

  useEffect(() => setCardVisibility(false), [selectedMethod, setCardVisibility])

  return {
    isPaymentMethodBlocked,
    paymentErrorButton,
    paymentErrorCard
  }
}
