import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'

import Flyout from 'components/Flyout'
import FlyoutContainer from 'components/Flyout/Container'
import FlyoutHeader from 'components/Flyout/Header'
import { FlyoutContent } from 'components/Flyout/Layout'
import { selectors } from 'data'
import { useRemote } from 'hooks'

import { Props } from './TransactionList'

const TransactionList = (props: Props) => {
  const { close } = props
  const { data, isLoading, isNotAsked } = useRemote(
    selectors.components.debitCard.getCardTransactions
  )

  const [show, setShow] = useState(true)

  const handleClose = () => {
    setShow(false)
    setTimeout(() => {
      close()
    })
  }

  return (
    <Flyout {...props} isOpen={show} onClose={handleClose}>
      <FlyoutContainer>
        <FlyoutHeader data-e2e='transactionDetailFlyout' mode='close' onClick={handleClose}>
          <FormattedMessage id='modals.transaction_list.title' defaultMessage='All Activity' />
        </FlyoutHeader>
        <FlyoutContent mode='top'>
          <>
            {data?.map((d) => (
              <div key={d.id}>{d.id}</div>
            ))}
          </>
        </FlyoutContent>
      </FlyoutContainer>
    </Flyout>
  )
}

export default TransactionList
