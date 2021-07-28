import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { actions } from 'data'
import { media } from 'services/styles'

import { getData } from './selectors'
import EmailReminder from './template.email'

const Wrapper = styled.div`
  display: flex;
  padding: 8px 20px 8px 20px;
  align-items: center;
  justify-content: space-between;
  background: ${(props) => props.theme.blue600};
  overflow: hidden;
  ${media.tablet`
    display: none;
  `};
`

class StaticAnnouncementsContainer extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = { emailReminded: false }
  }

  onEmailResend = (email) => {
    if (this.state.emailReminded) return
    this.props.resendEmail(email)
    this.setState({ emailReminded: true })
    setTimeout(() => {
      this.setState({ emailReminded: false })
    }, 3000)
  }

  render() {
    const { data } = this.props

    return data.cata({
      Failure: () => null,
      Loading: () => null,
      NotAsked: () => null,
      Success: (val) => {
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
      }
    })
  }
}

const mapStateToProps = (state) => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch) => ({
  resendEmail: (email) => dispatch(actions.modules.securityCenter.resendVerifyEmail(email)),
  verifyIdentity: () =>
    dispatch(
      actions.components.identityVerification.verifyIdentity({
        origin: 'DashboardPromo',
        tier: 2
      })
    )
})

export default connect(mapStateToProps, mapDispatchToProps)(StaticAnnouncementsContainer)
