import React from 'react'
import { connect, ConnectedProps } from 'react-redux'

import DebitCard from './template'

class DebitCardContainer extends React.PureComponent<Props> {
  render() {
    return <DebitCard />
  }
}

const connector = connect()

export type Props = ConnectedProps<typeof connector>

export default connector(DebitCardContainer)
