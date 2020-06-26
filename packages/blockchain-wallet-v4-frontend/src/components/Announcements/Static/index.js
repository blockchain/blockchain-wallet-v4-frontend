import { connect } from 'react-redux'
import React from 'react'
import styled from 'styled-components'

import { actions, model } from 'data'
import { getData } from './selectors'
import EmailReminder from './template.email'
import media from 'services/ResponsiveService'

const Wrapper = styled.div`
  display: flex;
  padding: 8px 20px 8px 20px;
  align-items: center;
  justify-content: space-between;
  background: ${props => props.theme.blue600};
  overflow: hidden;
  ${media.tablet`
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
