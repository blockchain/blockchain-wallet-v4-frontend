import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { Text } from 'blockchain-info-components'
import React, { Component } from 'react'

interface Props {

}
interface State {

}

export class Summary extends Component<Props, State> {
  state = {}

  render () {
    return (
      <div>
        <Text color='grey900' weight={600}>
          <FormattedMessage id='modals.borrow.summary' defaultMessage='Summary' />
        </Text>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(Summary)
