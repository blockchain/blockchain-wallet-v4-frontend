import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { getData } from './selectors'
import SelectBoxEth from './template'

class SelectBoxEthAddresses extends React.PureComponent {
  render () {
    const { data, includeAll, ...rest } = this.props

    return data.cata({
      Success: value => {
        return <SelectBoxEth elements={value.data} {...rest} />
      },
      Failure: message => <div>{message}</div>,
      Loading: () => <div />,
      NotAsked: () => <div />
    })
  }
}

SelectBoxEthAddresses.propTypes = {
  includeAll: PropTypes.bool
}

SelectBoxEthAddresses.defaultProps = {
  includeAll: true
}

const mapStateToProps = (state, ownProps) => ({
  data: getData(state, ownProps)
})

export default connect(mapStateToProps)(SelectBoxEthAddresses)
