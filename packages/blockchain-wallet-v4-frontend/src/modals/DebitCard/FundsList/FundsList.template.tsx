import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
import CoinWithBalance from 'components/CoinWithBalance'
import Flyout from 'components/Flyout'
import FlyoutContainer from 'components/Flyout/Container'
import FlyoutContent from 'components/Flyout/Content'
import FlyoutHeader from 'components/Flyout/Header'

import { Loading, LoadingTextEnum } from '../../components'
import { Props } from './FundsList'

const ItemWrapper = styled.div`
  padding: 16px 24px;
  border-top: 1px solid ${(props) => props.theme.grey000};

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
  const { accountsR, close } = props
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
        <FlyoutHeader data-e2e='fundsListHeader' mode='back' onClick={handleClose}>
          <FormattedMessage id='modals.funds_list.title' defaultMessage='Spend From' />
        </FlyoutHeader>
        <FlyoutContent mode='top'>
          {accountsR.cata({
            Failure: () => <ErrorMessage />,
            Loading: () => <Loading text={LoadingTextEnum.PROCESSING} />,
            NotAsked: () => <Loading text={LoadingTextEnum.PROCESSING} />,
            Success: (accounts) =>
              accounts.map(({ balance }) => (
                <ItemWrapper key={balance.symbol}>
                  <CoinWithBalance symbol={balance.symbol} value={balance.value} />
                </ItemWrapper>
              ))
          })}
        </FlyoutContent>
      </FlyoutContainer>
    </Flyout>
  )
}

export default FundsList
