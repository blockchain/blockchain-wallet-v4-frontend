
import React from 'react'
import { connect } from 'react-redux'
import { getData } from './selectors'
import Settings from './template.js'

class SettingContainer extends React.PureComponent {
  render () {
    return this.props.data.cata({
      Success: value => <Settings data={value} />,
      Failure: message => <Settings data={{ isEmailVerified: false, isMobileVerified: false }} />,
      Loading: () => <Settings data={{isEmailVerified: false, isMobileVerified: false}} />,
      NotAsked: () => <Settings data={{isEmailVerified: false, isMobileVerified: false}} />
    })
  }
}

const mapStateToProps = (state) => ({
  data: getData(state)
})

export default connect(mapStateToProps)(SettingContainer)
