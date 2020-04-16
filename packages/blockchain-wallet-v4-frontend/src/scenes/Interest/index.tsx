import { actions } from 'data'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { Icon } from 'blockchain-info-components'
import {
  IconBackground,
  SceneHeader,
  SceneHeaderText,
  SceneSubHeaderText,
  SceneWrapper
} from 'components/Layout'
import React from 'react'

export type LinkDispatchPropsType = {
  modalActions: typeof actions.modals
}

type Props = LinkDispatchPropsType
class Interest extends React.PureComponent<Props> {
  render () {
    return (
      <SceneWrapper>
        <SceneHeader>
          <IconBackground>
            <Icon name='savings-icon' color='blue600' size='24px' />
          </IconBackground>
          <SceneHeaderText>
            <FormattedMessage
              id='scenes.interest.earninterest'
              defaultMessage='Earn Interest'
            />
          </SceneHeaderText>
        </SceneHeader>
        <SceneSubHeaderText>
          <FormattedMessage
            id='scenes.interest.subheader'
            defaultMessage='Deposit crypto and instantly earn interest with absolutely no fees.'
          />
        </SceneSubHeaderText>
        <div
          onClick={() => this.props.modalActions.showModal('INTEREST_MODAL')}
        >
          Deposit
        </div>
      </SceneWrapper>
    )
  }
}

const mapDispatchToProps = (dispatch: Dispatch): LinkDispatchPropsType => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(
  null,
  mapDispatchToProps
)(Interest)
