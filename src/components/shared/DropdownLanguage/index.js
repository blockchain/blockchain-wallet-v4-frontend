import React from 'react'
import { connect } from 'react-redux'
import { compose, bindActionCreators } from 'redux'
import ui from 'redux-ui'
import { map } from 'ramda'

import { renameKeys } from 'services/RamdaCookingBook'
import * as languageService from 'services/LanguageService'
import { actions, selectors } from 'data'
import { SimpleDropdown } from 'components/generic/Dropdown'

class DropdownLanguageContainer extends React.Component {
  constructor (props) {
    super(props)
    this.toggle = this.toggle.bind(this)
    this.click = this.click.bind(this)
  }

  toggle () {
    this.props.updateUI({ toggled: !this.props.ui.toggled })
  }

  click (value) {
    this.props.preferencesActions.setCulture(value)
  }

  render () {
    const display = languageService.getLanguageName(this.props.culture).getOrElse('en-GB')
    const items = [...map(renameKeys({name: 'text', cultureCode: 'value'}))(this.props.languages)]

    return (
      <SimpleDropdown
        id='language'
        display={display}
        items={items}
        toggled={this.props.toggled}
        toggle={this.toggle}
        callback={this.click} />
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  culture: selectors.preferences.getCulture(state),
  languages: languageService.languagesSortedByName
})

const mapDispatchToProps = (dispatch) => ({
  preferencesActions: bindActionCreators(actions.preferences, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  ui({ state: { toggled: false } })
)

export default enhance(DropdownLanguageContainer)
