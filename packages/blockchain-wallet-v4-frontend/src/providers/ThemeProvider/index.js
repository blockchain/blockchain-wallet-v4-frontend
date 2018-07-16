import { connect } from 'react-redux'
import { selectors } from 'data'
import { Themes } from 'blockchain-info-components'
import { createDeepEqualSelector } from 'services/ReselectHelper'

const mapStateToProps = createDeepEqualSelector(
  [selectors.preferences.getTheme],
  (theme) => ({ theme })
)

export default connect(mapStateToProps)(Themes)
