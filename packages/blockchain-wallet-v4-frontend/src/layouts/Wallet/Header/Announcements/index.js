import React from 'react'
import { connect } from 'react-redux'

import { getData } from './selectors'
import EmailReminder from './EmailReminder'
import SunRiverKycReminder from './SunRiverKycReminder'

class AnnouncementsContainer extends React.PureComponent {
  render () {
    const { data } = this.props

    return data.cata({
      Success: val => {
        switch (val.announcementToShow) {
          case 'email':
            return <EmailReminder email={val.email} />
          case 'sunRiverKyc':
            return <SunRiverKycReminder />
          default:
            return null
        }
      },
      Failure: () => null,
      NotAsked: () => null,
      Loading: () => null
    })
  }
}

const mapStateToProps = state => ({
  data: getData(state)
})

export default connect(mapStateToProps)(AnnouncementsContainer)
