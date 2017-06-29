import { ThemeProvider } from 'styled-components'
import { connect } from 'react-redux'

import blockchain from 'themes/default'
import dev from 'themes/dev'
import invert from 'themes/invert'

const mapStateToProps = (state, props) => {
  let colors
  switch (state.preferences.theme) {
    case 'Default':
      colors = blockchain
      break
    case 'Dev Theme':
      colors = dev
      break
    case 'Invert Colors':
      colors = invert
      break
    default:
      colors = blockchain
  }

  return {
    theme: colors
  }
}

export default connect(mapStateToProps)(ThemeProvider)
