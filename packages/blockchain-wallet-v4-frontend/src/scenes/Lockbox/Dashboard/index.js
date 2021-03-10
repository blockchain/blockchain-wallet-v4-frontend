import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { equals } from 'ramda'
import { bindActionCreators, compose } from 'redux'
import styled from 'styled-components'

import { actions, selectors } from 'data'
import { media } from 'services/styles'

import Menu from './Menu'
import Settings from './Settings'
import Transactions from './Transactions'
import UpdateRequiredNotice from './UpdateRequiredNotice'

const Wrapper = styled.div`
  height: 100%;
  width: calc(100% - 250px);
  position: fixed;

  ${media.tablet`
    width: 100%;
  `}
`
const Header = styled(Menu)`
  width: 100%;
`
const TransactionsWrapper = styled.div`
  height: calc(
    100% - ${props => (props.showLockboxDownload ? '455px' : '350px')}
  );
  position: relative;
  top: 218px;
  overflow: scroll;
`
const SettingsWrapper = styled.div`
  height: calc(
    100% - ${props => (props.showLockboxDownload ? '340px' : '250px')}
  );
  position: relative;
  top: 122px;
  overflow: scroll;
`
class LockboxDashboardContainer extends React.PureComponent {
  componentDidUpdate(prevProps) {
    const prevIndex = prevProps.match.params.deviceIndex
    const nextIndex = this.props.match.params.deviceIndex
    if (equals(prevIndex, nextIndex)) return
    this.props.lockboxActions.initializeDashboard(nextIndex)
  }

  render() {
    const { location, match, showLockboxDownload } = this.props
    const { deviceIndex } = match.params
    const onDashboard = location.pathname.includes('/lockbox/dashboard')

    return (
      <Wrapper>
        {/* TODO: re-enable once new firmware is released */}
        {/* <Announcements type='service' alertArea='lockbox' /> */}
        <UpdateRequiredNotice />
        <Header />
        {onDashboard ? (
          <TransactionsWrapper showLockboxDownload={showLockboxDownload}>
            <Transactions deviceIndex={deviceIndex} />
          </TransactionsWrapper>
        ) : (
          <SettingsWrapper showLockboxDownload={showLockboxDownload}>
            <Settings deviceIndex={deviceIndex} />
          </SettingsWrapper>
        )}
      </Wrapper>
    )
  }
}

const mapStateToProps = state => ({
  showLockboxDownload: selectors.preferences.getShowLockboxSoftwareDownload(
    state
  )
})

const mapDispatchToProps = dispatch => ({
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

const enhance = compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(LockboxDashboardContainer)
