import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { getData } from './selectors'
import SelectBoxBsv from './template'

class SelectBoxBsvAddresses extends React.PureComponent {
  render () {
    const { data, ...rest } = this.props

    return data.cata({
      Success: value => {
        return <SelectBoxBsv elements={value.data} {...rest} />
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
