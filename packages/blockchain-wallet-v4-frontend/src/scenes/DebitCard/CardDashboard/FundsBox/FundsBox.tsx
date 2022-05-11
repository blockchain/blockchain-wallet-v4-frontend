import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { useRemote } from 'hooks'
import { compose, Dispatch } from 'redux'

import { getCoinsSortedByBalance } from 'components/Balances/selectors'

import FundsBox from './FundsBox.template'

const FundsBoxContainer = () => {
  const { data } = useRemote(getCoinsSortedByBalance)
  return <FundsBox coins={data} />
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch: Dispatch) => ({})

const connector = connect(mapStateToProps, mapDispatchToProps)

type OwnProps = {}

export type Props = OwnProps & ConnectedProps<typeof connector>

const enhance = compose(connector)

export default enhance(FundsBoxContainer)
