import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { prepend } from 'ramda'
import { getData } from './selectors'
import SelectBoxBCH from './template'

class SelectBoxBCHAddresses extends React.PureComponent {
  render () {
    const { data, ...rest } = this.props
    const allWallets = {
      label: 'All',
      options: [
        {
          label: 'All Bitcoin Cash Wallets',
          value: 'all'
        }
      ]
    }

    return data.cata({
      Success: value => {
        const elements = this.props.includeAll
          ? prepend(allWallets, value.data)
          : value.data
        return <SelectBoxBCH elements={elements} {...rest} />
      },
      Failure: message => <div>{message}</div>,
      Loading: () => <div />,
      NotAsked: () => <div />
    })
  }
}

SelectBoxBCHAddresses.propTypes = {
  includeAll: PropTypes.bool
}

SelectBoxBCHAddresses.defaultProps = {
  includeAll: true
}

const mapStateToProps = (state, ownProps) => ({
  data: getData(state, ownProps)
})

export default connect(mapStateToProps)(SelectBoxBCHAddresses)
