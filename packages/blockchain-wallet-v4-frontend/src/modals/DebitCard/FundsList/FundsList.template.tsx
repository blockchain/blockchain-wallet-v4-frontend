import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
import CoinWithBalance from 'components/CoinWithBalance'
import Flyout from 'components/Flyout'
import FlyoutContainer from 'components/Flyout/Container'
import FlyoutContent from 'components/Flyout/Content'
import FlyoutHeader from 'components/Flyout/Header'
import { selectors } from 'data'
import { useRemote } from 'hooks'

import { Loading, LoadingTextEnum } from '../../components'
import { Props } from './FundsList'

const ItemWrapper = styled.div`
  padding: 1rem 1.5rem;
  border-top: 1px solid ${(props) => props.theme.grey000};
  cursor: pointer;

  &:hover {
    background: ${(props) => props.theme.grey000};
  }
`

const ErrorMessage = () => (
  <Text
    size='16px'
    weight={500}
    color='grey400'
    capitalize
    lineHeight='45px'
    style={{ margin: 'auto' }}
  >
    <FormattedMessage
      id='scene.debit_card.accounts_fail'
      defaultMessage='Failed to load accounts'
    />
  </Text>
)

const FundsList = (props: Props) => {
  const { accountsR, close, debitCardActions } = props
  const { isLoading: isSelectionInProgress } = useRemote(
    selectors.components.debitCard.getSelectAccountHandler
  )

  const [show, setShow] = useState(true)

  const handleClose = () => {
    setShow(false)
    setTimeout(() => {
      close()
    })
  }

  const handleSelectAccount = (symbol) => {
    debitCardActions.selectAccount(symbol)
  }

  return (
    <Flyout {...props} isOpen={show} onClose={handleClose}>
      <FlyoutContainer>
        <FlyoutHeader data-e2e='fundsListHeader' mode='back' onClick={handleClose}>
          <FormattedMessage id='modals.funds_list.title' defaultMessage='Spend From' />
        </FlyoutHeader>
        <FlyoutContent mode='top'>
          {accountsR.cata({
            Failure: () => <ErrorMessage />,
            Loading: () => <Loading text={LoadingTextEnum.PROCESSING} />,
            NotAsked: () => <Loading text={LoadingTextEnum.PROCESSING} />,
            Success: (accounts) => {
              if (isSelectionInProgress) return <Loading text={LoadingTextEnum.PROCESSING} />

              return accounts.map(({ balance: { symbol, value } }) => (
                <ItemWrapper key={symbol} onClick={() => handleSelectAccount(symbol)}>
                  <CoinWithBalance symbol={symbol} value={value} />
                </ItemWrapper>
              ))
            }
          })}
        </FlyoutContent>
      </FlyoutContainer>
    </Flyout>
  )
}

export default FundsList
