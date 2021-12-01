import React from 'react'
import { connect, ConnectedProps } from 'react-redux'

import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

const AddCardCheckoutDotCom = (props: Props) => {
  return <></>
}

const mapStateToProps = (state: RootState) => ({
  checkoutDotComAccountCodes: selectors.components.buySell.getCheckoutAccountCodes(state),
  checkoutDotComApiKey: selectors.components.buySell.getCheckoutApiKey(state)
})

const connector = connect(mapStateToProps)

type OwnProps = {
  handleClose: () => void
}

export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(AddCardCheckoutDotCom)
