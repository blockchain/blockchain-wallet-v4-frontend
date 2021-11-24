import React from 'react'
import { connect, ConnectedProps } from 'react-redux'

import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

const AddCardCheckout = ({ checkoutAccountCodes, checkoutApiKey }: Props) => {
  return (
    <>
      {`${checkoutAccountCodes}`} {`${checkoutApiKey}`}
    </>
  )
}

const mapStateToProps = (state: RootState) => ({
  checkoutAccountCodes: selectors.components.buySell.getCheckoutAccountCodes(state),
  checkoutApiKey: selectors.components.buySell.getCheckoutApiKey(state)
})

const connector = connect(mapStateToProps)

type OwnProps = {
  handleClose: () => void
}

export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(AddCardCheckout)
