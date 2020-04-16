import { actions } from 'data'
import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import { getData } from './selectors'
import { prop } from 'ramda'
import Flyout, { duration } from 'components/Flyout'
import modalEnhancer from 'providers/ModalEnhancer'
import React from 'react'
import styled from 'styled-components'

import EmptyContent from './Content/EmptyContent'

type OwnPropsType = {
  close: () => void
  position: number
  total: number
  userClickedOutside: boolean
}

type LinkStatePropsType = {
  announcements: Array<{
    content: React.Component
  }>
}

type LinkDispatchPropsType = {
  kvStoreWhatsNewActions: typeof actions.core.kvStore.whatsNew
}

type Props = OwnPropsType & LinkStatePropsType & LinkDispatchPropsType

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: auto;
`

class WhatsNewContainer extends React.PureComponent<Props> {
  state = { show: false }

  componentDidMount () {
    /* eslint-disable */
    this.setState({ show: true })
    /* eslint-enable */
  }

  componentWillUnmount () {
    this.props.kvStoreWhatsNewActions.updateMetadataWhatsNew(Date.now())
  }

  render () {
    const { show } = this.state
    const { announcements, ...rest } = this.props
    return (
      <Flyout
        {...rest}
        onClose={this.props.close}
        in={show}
        data-e2e='whatsNewModal'
        direction='left'
      >
        <Container>
          {!prop('length', announcements) ? (
            <EmptyContent />
          ) : (
            announcements.map(prop('content'))
          )}
        </Container>
      </Flyout>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  kvStoreWhatsNewActions: bindActionCreators(
    actions.core.kvStore.whatsNew,
    dispatch
  )
})

const enhance = compose<any>(
  modalEnhancer('WHATS_NEW_MODAL', { transition: duration }),
  connect(
    getData,
    mapDispatchToProps
  )
)

export default enhance(WhatsNewContainer)
