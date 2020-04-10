import { actions } from 'data'
import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
// import { forEach, keysIn, map, prop, range, sortBy, split, take } from 'ramda'
// import { FormattedMessage } from 'react-intl'
import { InjectedFormProps, reduxForm } from 'redux-form'
import {
  LinkDispatchPropsType,
  LinkStatePropsType,
  OwnPropsType
} from '../index'
import ConfirmWordsForm from './template'
import React, { PureComponent } from 'react'

type Props = OwnPropsType & LinkDispatchPropsType & LinkStatePropsType

class ConfirmWords extends PureComponent<InjectedFormProps<{}, Props> & Props> {
  state = { indexes: [] }

  // componentDidMount() {
  //   //@ts-ignore
  //   const randomize = sortBy(prop(0))
  //   //@ts-ignore
  //   const pair = map(x => [Math.random(), x])
  //   const indexes = compose(
  //     take(4),
  //     //@ts-ignore
  //     map(prop(1)),
  //     //@ts-ignore
  //     randomize,
  //     pair
  //   )(range(0, 12))
  //   /* eslint-disable */
  //   this.setState({ indexes })
  //   /* eslint-enable */
  // }
  // onSubmit = (values, dispatch, props) => {
  //   const errors = {}
  //   compose(
  //     forEach(word => {
  //       if (values[word] !== props.recoveryPhrase[split('w', word)[1]]) {
  //         errors[word] = (
  //           <FormattedMessage
  //             id="scenes.securitycenter.walletrecoveryphrase.thirdstep.incorrectword"
  //             defaultMessage="Incorrect Word"
  //           />
  //         )
  //       }
  //     }),
  //     keysIn
  //   )(values)

  //   if (keysIn(errors).length) {
  //     throw new SubmissionError(errors)
  //   } else {
  //     // this.props.walletActions.verifyMnemonic()
  //     // this.props.handleClose()
  //   }
  // }

  render () {
    const { handleBackArrow } = this.props
    return <ConfirmWordsForm handleBackArrow={handleBackArrow} />
  }
}

const mapDispatchToProps = dispatch => ({
  walletActions: bindActionCreators(actions.wallet, dispatch)
})

const enhance = compose(
  reduxForm<{}, Props>({ form: 'confirmRecoveryWords' }),
  connect(
    null,
    mapDispatchToProps
  )
)

export default enhance(ConfirmWords) as React.ComponentType<Props>
