import { connect } from 'react-redux'
import { selectors } from 'data'
import { Themes } from 'blockchain-info-components'

const mapStateToProps = (state) => ({
  theme: selectors.preferences.getTheme(state)
})

export default connect(mapStateToProps)(Themes)
