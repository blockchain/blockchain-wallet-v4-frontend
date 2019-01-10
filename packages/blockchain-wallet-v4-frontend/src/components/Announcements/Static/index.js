import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { actions, model } from 'data'
import { getData } from './selectors'
import EmailReminder from './template.email'
import SunRiverKycReminder from './template.sunriver'
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

const { TIERS } = model.profile

class StaticAnnouncementsContainer extends React.PureComponent {
  state = {}

  onEmailResend = email => {
    if (this.state.emailReminded) return
    this.props.resendEmail(email)
    this.setState({ emailReminded: true })
    setTimeout(() => {
      this.setState({ emailReminded: false })
    }, 3000)
  }

  render () {
    const { data } = this.props

    return data.cata({
      Success: val => {
        switch (val.announcementToShow) {
          case 'email':
            return (
              <Wrapper>
                <EmailReminder
                  onEmailResend={this.onEmailResend}
                  email={val.email}
                  emailReminded={this.state.emailReminded}
                />
              </Wrapper>
            )
          case 'sunRiverKyc':
            return (
              <Wrapper>
                <SunRiverKycReminder goToKyc={this.props.verifyIdentity} />
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

const mapDispatchToProps = dispatch => ({
  resendEmail: email =>
    dispatch(actions.modules.securityCenter.resendVerifyEmail(email)),
  verifyIdentity: () =>
    dispatch(actions.components.identityVerification.verifyIdentity(TIERS[2]))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StaticAnnouncementsContainer)
