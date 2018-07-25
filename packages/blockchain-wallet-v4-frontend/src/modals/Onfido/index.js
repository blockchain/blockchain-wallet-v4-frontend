import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import styled from 'styled-components'

import { getData } from './selectors'
import { actions } from 'data'
import Loading from './template.loading'
import { Modal } from 'blockchain-info-components'
import { Remote } from 'blockchain-wallet-v4'
import DataError from 'components/DataError'

import modalEnhancer from 'providers/ModalEnhancer'

export const MODAL_NAME = 'Onfido'

const OnfidoIframe = styled.iframe`
  width: 100%;
  height: 604px;
  border: none;
`
const OnfidoModal = styled(Modal)`
  height: 604px;
  display: flex;
  ${props => (props.onfidoActive ? `background-color: #f3f3f4;` : '')};
`

class OnfidoContainer extends React.PureComponent {
  componentDidMount () {
    this.props.actions.fetchOnfidoSDKKey()
    window.addEventListener('message', this.handleOnfidoMessage)
  }

  componentWillUnmount () {
    window.removeEventListener('message', this.handleOnfidoMessage)
  }

  handleOnfidoMessage = ({ data, origin }) => {
    const { helperDomain, actions } = this.props
    if (!data.command) return
    if (data.from !== 'onfido') return
    if (data.to !== 'IdentityVerification') return
    if (origin !== helperDomain) return
    if (data.command !== 'done') return
    actions.syncOnfido()
  }

  render () {
    const {
      helperDomain,
      position,
      total,
      onfidoSDKKey,
      onfidoSyncStatus,
      actions
    } = this.props
    return (
      <OnfidoModal
        size='medium'
        position={position}
        onfidoActive={Remote.Success.is(onfidoSDKKey)}
        total={total}
      >
        {onfidoSDKKey.cata({
          Success: sdkKey =>
            onfidoSyncStatus.cata({
              Success: () => <Loading />,
              Loading: () => <Loading />,
              NotAsked: () => (
                <OnfidoIframe
                  src={`${helperDomain}/wallet-helper/onfido?token=${sdkKey}`}
                  sandbox='allow-same-origin allow-scripts'
                  scrolling='no'
                  id='onfido-iframe'
                />
              ),
              Failure: () => <DataError onClick={actions.syncOnfido} />
            }),
          Loading: () => <Loading />,
          Failure: () => <DataError onClick={actions.fetchOnfidoSDKKey} />,
          NotAsked: () => <Loading />
        })}
      </OnfidoModal>
    )
  }
}

OnfidoContainer.propTypes = {
  helperDomain: PropTypes.string.isRequired,
  onfidoSDKKey: PropTypes.instanceOf(Remote).isRequired,
  onfidoSyncStatus: PropTypes.instanceOf(Remote).isRequired
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.onfido, dispatch)
})

const enhance = compose(
  modalEnhancer(MODAL_NAME),
  connect(
    getData,
    mapDispatchToProps
  )
)

export default enhance(OnfidoContainer)
