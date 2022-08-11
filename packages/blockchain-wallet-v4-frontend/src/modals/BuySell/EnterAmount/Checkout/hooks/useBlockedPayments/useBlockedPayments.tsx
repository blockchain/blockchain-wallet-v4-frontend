import React, { useEffect, useMemo, useState } from 'react'
import { FormattedMessage } from 'react-intl'

import { Button, Image } from 'blockchain-info-components'
import { Flex } from 'components/Flex'
import { GenericNabuErrorCard } from 'components/GenericNabuErrorCard'
import { NabuError } from 'services/errors'

import { BlockedPaymentsHook } from './useBlockedPayments.types'

export const useBlockedPayments: BlockedPaymentsHook = (selectedMethod) => {
  const [isCardVisible, setCardVisibility] = useState<boolean>(false)

  const isPaymentMethodBlocked = useMemo(() => {
    if (!selectedMethod) return false

    return !!selectedMethod.block
  }, [selectedMethod])

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
    if (!isPaymentMethodBlocked) return

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
          <FormattedMessage
            id='EnterAmount.paymentMethodBlockedButton.label'
            defaultMessage='Buying crypto not supported'
          />
        </Flex>
      </Button>
    )
  }, [isPaymentMethodBlocked, setCardVisibility])

  useEffect(() => setCardVisibility(false), [selectedMethod, setCardVisibility])

  return {
    isPaymentMethodBlocked,
    paymentErrorButton,
    paymentErrorCard
  }
}
