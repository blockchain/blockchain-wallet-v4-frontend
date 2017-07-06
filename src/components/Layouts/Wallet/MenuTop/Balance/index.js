import { connect } from 'react-redux'
import {bindActionCreators} from 'redux'
import { actions, selectors } from 'data'
import Balance from './template.js'

let mapStateToProps = (state) => ({
  bitcoinDisplayed: selectors.ui.getBitcoinDisplayed(state),
  balance: selectors.core.info.getBalance(state)
})

let mapDispatchToProps = (dispatch) => (
  bindActionCreators(actions.ui, dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(Balance)
