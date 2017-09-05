import React from 'react'
import { connect } from 'react-redux'
import { compose, bindActionCreators } from 'redux'
import ui from 'redux-ui'
import { map } from 'ramda'

import { renameKeys } from 'services/RamdaCookingBook'
import * as languageService from 'services/LanguageService'
import { actions, selectors } from 'data'
import { SimpleDropdown } from 'blockchain-info-components'

class DropdownLanguageContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick (item) {
    this.props.preferencesActions.setCulture(item.value)
    this.props.preferencesActions.setLanguage(item.language)
  }

  render () {
    const { culture, ...rest } = this.props
    const items = [...map(renameKeys({name: 'gray-5', cultureCode: 'value'}))(this.props.languages)]

    return (
      <SimpleDropdown
        {...rest}
        selectedValue={culture}
        items={items}
        callback={this.handleClick} />
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
