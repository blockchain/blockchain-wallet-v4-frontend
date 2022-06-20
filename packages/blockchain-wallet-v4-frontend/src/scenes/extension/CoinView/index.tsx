import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { getTotalBalance } from 'components/Balances/total/selectors'
import { selectors } from 'data'

import CoinsList from './CoinsList'
import Header from './Header'

const Wrapper = styled.div`
  height: 100%;
`

export const CoinView = (props: any) => {
  return (
    <Wrapper className='hello'>
      <Header balance={props.data.data.totalBalance} walletAddress={props.walletAddress || ''} />
      <CoinsList />
    </Wrapper>
  )
}

const mapStateToProps = (state) => ({
  data: getTotalBalance(state),
  userCurrency: selectors.core.settings.getCurrency(state).getOrElse('USD'),
  walletAddress: selectors.core.kvStore.eth.getDefaultAddress(state).getOrElse('')
})

export default connect(mapStateToProps, null)(CoinView)
