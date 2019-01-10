import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions } from 'data'
import { getData } from './selectors'
import EmptyContent from 'services/WhatsNewService/WhatsNewContent/EmptyContent'
import { prop } from 'ramda'

export const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 30px;
  box-sizing: border-box;
  overflow-y: auto;
`
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: auto;
`

class WhatsNewContainer extends React.PureComponent {
  componentWillUnmount () {
    this.props.kvStoreWhatsNewActions.updateMetadataWhatsNew(Date.now())
  }
  render () {
    const { announcements } = this.props
    return (
      <Wrapper>
        <Container>
          {!prop('length', announcements) ? (
            <EmptyContent />
          ) : (
            announcements.map(prop('content'))
          )}
        </Container>
      </Wrapper>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  kvStoreWhatsNewActions: bindActionCreators(
    actions.core.kvStore.whatsNew,
    dispatch
  )
})

export default connect(
  getData,
  mapDispatchToProps
)(WhatsNewContainer)
