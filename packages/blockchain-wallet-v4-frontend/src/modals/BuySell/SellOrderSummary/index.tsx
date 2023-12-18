import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { actions } from 'data'

import SellOrderSummarySuccess from './SellOrderSummarySuccess'

/** This is a new order summary created for sell p3. Order type looks like what is currently a swap order type rather than an BS order type
 * Created this separate template so that we don't have to force types to match. Should be resued when Buy uses swap2.0 apis, and OrderSummary folder
 * can be deleted
 * */
const SellOrderSummary = ({ handleClose }) => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(actions.components.buySell.fetchOrders())
  }, [])

  return <SellOrderSummarySuccess handleClose={handleClose} />
}

export type Props = {
  handleClose: () => void
}

export default SellOrderSummary
