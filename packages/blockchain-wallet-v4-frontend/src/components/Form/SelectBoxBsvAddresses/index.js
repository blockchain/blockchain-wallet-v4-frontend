import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { prepend } from 'ramda'
import { getData } from './selectors'
import SelectBoxBsv from './template'

class SelectBoxBsvAddresses extends React.PureComponent {
  render () {
    const { data, ...rest } = this.props
    const allWallets = {
      label: 'All',
      options: [
        {
          label: 'All Bitcoin SV Wallets',
          value: 'all'
        }
      ]
    }

    return data.cata({
      Success: value => {
        const elements = this.props.includeAll
          ? prepend(allWallets, value.data)
          : value.data
        return <SelectBoxBsv elements={elements} {...rest} />
      },
      Failure: message => <div>{message}</div>,
      Loading: () => <div />,
      NotAsked: () => <div />
    })
  }
}

SelectBoxBsvAddresses.propTypes = {
  includeAll: PropTypes.bool
}

SelectBoxBsvAddresses.defaultProps = {
  includeAll: true
}

const mapStateToProps = (state, ownProps) => ({
  data: getData(state, ownProps)
})

export default connect(mapStateToProps)(SelectBoxBsvAddresses)
