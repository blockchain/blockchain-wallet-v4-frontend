import React from 'react'
import PropTypes from 'prop-types'
import CSSModules from 'react-css-modules'

import DropdownLanguageItem from './DropdownLanguageItem'

import style from './style.scss'

const DropdownLanguage = (props) => {
  return (
    <div className='dropdown show'>
      <a className='btn btn-secondary dropdown-toggle' id='dropdownLanguage' data-toggle='dropdown' aria-haspopup='true'
        aria-expanded={props.dropdownLanguageDisplayed} onClick={props.clickDropdownLanguage}>
        {props.culture}
      </a>
      <div className='dropdown-menu' aria-labelledby='dropdownLanguage'>
        { props.languages.map((language, index) => {
          return (
            <DropdownLanguageItem
              key={index}
              name={language.name}
              cultureCode={language.cultureCode}
              clickItem={props.clickItem}
            />
          )
        })}
      </div>
    </div>
  )
}

DropdownLanguage.propTypes = {
  culture: PropTypes.string.isRequired,
  languages: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    cultureCode: PropTypes.string.isRequired
  })),
  dropdownLanguageDisplayed: PropTypes.bool.isRequired,
  clickDropdownLanguage: PropTypes.func.isRequired,
  clickItem: PropTypes.func.isRequired
}

export default CSSModules(DropdownLanguage, style)
