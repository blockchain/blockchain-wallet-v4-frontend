import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { getData } from './selectors'
import SelectBoxEther from './template'

class SelectBoxEtherAddresses extends React.PureComponent {
  render () {
    const { data, includeAll, ...rest } = this.props

    return data.cata({
      Success: value => {
        return <SelectBoxEther elements={value.data} {...rest} />
      },
      Failure: message => <div>{message}</div>,
      Loading: () => <div />,
      NotAsked: () => <div />
    })
  }
}

SelectBoxEtherAddresses.propTypes = {
  includeAll: PropTypes.bool
}

SelectBoxEtherAddresses.defaultProps = {
  includeAll: true
}

const mapStateToProps = (state, ownProps) => ({
  data: getData(state, ownProps)
})

export default connect(mapStateToProps)(SelectBoxEtherAddresses)
