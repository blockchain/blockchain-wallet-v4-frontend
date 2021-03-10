import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { getData } from './selectors'
import SelectBoxXlm from './template'

class SelectBoxXlmAddresses extends React.PureComponent {
  render() {
    const { data, includeAll, ...rest } = this.props

    return data.cata({
      Success: value => {
        return (
          <SelectBoxXlm options={value.data} elements={value.data} {...rest} />
        )
      },
      Failure: message => <div>{message}</div>,
      Loading: () => <div />,
      NotAsked: () => <div />
    })
  }
}

SelectBoxXlmAddresses.propTypes = {
  includeAll: PropTypes.bool
}

SelectBoxXlmAddresses.defaultProps = {
  includeAll: true
}

const mapStateToProps = (state, ownProps) => ({
  data: getData(state, ownProps)
})

export default connect(mapStateToProps)(SelectBoxXlmAddresses)
