import React from 'react'
import { map, assoc } from 'ramda'
import moment from 'moment'

import List from './template.js'

class ListContainer extends React.Component {
  render () {
    const trades = map(x => assoc('date', moment(x.date).format('DD MMMM YYYY, HH:mm'), x), this.props.trades)
    console.log(trades)
    return <List trades={trades} />
  }
}

export default ListContainer
