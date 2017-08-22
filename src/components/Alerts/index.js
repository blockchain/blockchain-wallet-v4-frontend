import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { selectAlerts } from 'data/Alerts/selectors'
import * as actions from 'data/Alerts/actions'
import Alerts from './Alerts'

const mapStateToProps = (state) => ({
  alerts: selectAlerts(state)
})

const mapDispatchToProps = (dispatch) => (
  bindActionCreators(actions, dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(Alerts)
