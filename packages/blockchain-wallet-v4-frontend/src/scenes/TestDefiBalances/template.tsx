import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'
import { Button } from '@blockchain-com/constellation'
import styled from 'styled-components'

import { actions, selectors } from 'data'

const NonCustodialTestBalances = (props) => {
  //   console.log(props, 'ncTestBalanceProps')
  const dispatch = useDispatch()

  return (
    <>
      <Button
        onClick={() => dispatch(actions.components.swap.showModal({ origin: 'Trade' }))}
        variant='primary'
        text={<FormattedMessage id='copy.swap' defaultMessage='Swap' />}
      />
    </>
  )
}

export default NonCustodialTestBalances
