import React, { useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { bindActionCreators, Dispatch } from 'redux'

import { WalletOptionsType } from '@core/redux/walletOptions/types'
import { RemoteDataType } from '@core/remote/types'
import { SkeletonRectangle } from 'blockchain-info-components'
import { Container } from 'components/Box'
import { actions, selectors } from 'data'
import { DebitCardType } from 'data/components/debitCard/types'
import { useRemote } from 'hooks'

import DebitCard from './DebitCard.template'

const Loading = () => {
  return (
    <Container>
      <SkeletonRectangle width='330px' height='270px' />
    </Container>
  )
}

const DebitCardContainer = (props: Props) => {
  useEffect(() => {
    props.debitCardActions.getCards()
    return () => {
      props.debitCardActions.cleanCardData()
    }
  }, [])

  const cardsR = useRemote(selectors.components.debitCard.getCards)
  const { data, isLoading } = cardsR

  if (!props.walletDebitCardEnabled) return <Redirect to='/home' />

  if (isLoading) return <Loading />

  return <DebitCard {...props} cards={data} />
}

const mapStateToProps = (state) => ({
  cardToken: selectors.components.debitCard.getCardToken(state),
  domains: selectors.core.walletOptions.getDomains(state).getOrElse({
    walletHelper: 'https://wallet-helper.blockchain.com'
  } as WalletOptionsType['domains']),
  lockHandler: selectors.components.debitCard.getLockHandler(state),
  walletDebitCardEnabled: selectors.components.debitCard.isDebitCardModuleEnabledForAccount(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  alertActions: bindActionCreators(actions.alerts, dispatch),
  debitCardActions: bindActionCreators(actions.components.debitCard, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch),
  routerActions: bindActionCreators(actions.router, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type OwnProps = {
  alertActions: typeof actions.alerts
  cardToken: string
  cards: Array<DebitCardType> | undefined
  debitCardActions: typeof actions.components.debitCard
  domains: { walletHelper: string }
  lockHandler: RemoteDataType<string, boolean>
  modalActions: typeof actions.modals
}

export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(DebitCardContainer)
