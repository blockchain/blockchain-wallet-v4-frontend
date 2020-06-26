import { connect } from 'react-redux'
import { getData } from './selectors'
import PropTypes from 'prop-types'
import React from 'react'
import SelectBoxBCH from './template'

class SelectBoxBchAddresses extends React.PureComponent {
  render () {
    const { data, ...rest } = this.props

    return data.cata({
      Success: value => {
        return (
          <SelectBoxBCH options={value.data} elements={value.data} {...rest} />
        )
      },
      Failure: message => <div>{message}</div>,
      Loading: () => <div />,
      NotAsked: () => <div />
    })
  }
}

SelectBoxBchAddresses.propTypes = {
  includeAll: PropTypes.bool
}

SelectBoxBchAddresses.defaultProps = {
  includeAll: true
}

const mapStateToProps = (state, ownProps) => ({
  data: getData(state, ownProps)
})

export default connect(mapStateToProps)(SelectBoxBchAddresses)
