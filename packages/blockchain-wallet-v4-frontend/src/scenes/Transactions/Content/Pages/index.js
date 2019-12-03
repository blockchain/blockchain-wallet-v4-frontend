import PropTypes from 'prop-types'
import React from 'react'

import DataError from 'components/DataError'
import Loading from './template.loading'
import Success from './template.success'

class Pages extends React.PureComponent {
  render () {
    const { buySellPartner, coin, currency, data } = this.props

    return data.cata({
      Success: value => (
        <Success
          coin={coin}
          currency={currency}
          transactions={value}
          buySellPartner={buySellPartner}
        />
      ),
      Failure: message => (
        <DataError onClick={this.props.onArchive} message={message} />
      ),
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

Pages.propTypes = {
  coin: PropTypes.string.isRequired
}

export default Pages
