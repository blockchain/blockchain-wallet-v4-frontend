import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { prepend } from 'ramda'
import { getData } from './selectors'
import SelectBoxBitcoin from './template'

class SelectBoxBtcAddresses extends React.PureComponent {
  render () {
    const { data, ...rest } = this.props
    const allWallets = {
      label: 'All',
      options: [
        {
          label: 'All Bitcoin Wallets',
          value: 'all'
        }
      ]
    }

    return data.cata({
      Success: value => {
        const elements = this.props.includeAll
          ? prepend(allWallets, value.data)
          : value.data
        return <SelectBoxBitcoin elements={elements} {...rest} />
      },
      Failure: message => <div>{message}</div>,
      Loading: () => <div />,
      NotAsked: () => <div />
    })
  }
}

SelectBoxBtcAddresses.propTypes = {
  includeAll: PropTypes.bool
}

SelectBoxBtcAddresses.defaultProps = {
  includeAll: true
}

const mapStateToProps = (state, ownProps) => ({
  data: getData(state, ownProps)
})

export default connect(mapStateToProps)(SelectBoxBtcAddresses)
