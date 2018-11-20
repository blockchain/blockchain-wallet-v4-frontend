import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { getData } from './selectors'
import EmailReminder from './EmailReminder'
import SunRiverKycReminder from './SunRiverKycReminder'
import media from 'services/ResponsiveService'

const Wrapper = styled.div`
  display: flex;
  padding: 12px 25px;
  align-items: center;
  justify-content: space-between;
  background: ${props => props.theme['marketing-primary']};
  overflow: hidden;
  ${media.mobile`
    display: none;
  `};
`

class AnnouncementsContainer extends React.PureComponent {
  render () {
    const { data } = this.props

    return data.cata({
      Success: val => {
        switch (val.announcementToShow) {
          case 'email':
            return (
              <Wrapper>
                <EmailReminder email={val.email} />
              </Wrapper>
            )
          case 'sunRiverKyc':
            return (
              <Wrapper>
                <SunRiverKycReminder />
              </Wrapper>
            )
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
