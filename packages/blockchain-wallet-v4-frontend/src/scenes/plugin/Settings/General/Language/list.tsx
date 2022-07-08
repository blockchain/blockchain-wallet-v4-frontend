import React from 'react'
import { connect } from 'react-redux'
import { Icon } from '@blockchain-com/constellation'
import { IconCheckCircle } from '@blockchain-com/icons'

import { selectors } from 'data'
import { languagesSortedByName } from 'services/locales'

import { CurrecyItemWrapper, CurrenciesList, CurrencySelectButton } from '../Currency/list'

const List = (props) => {
  const selectCurrency = (value) => {
    if (value === props.language) return
    props.input.onChange(value)
  }

  return (
    <>
      <CurrenciesList>
        {props.languages.map((language) => (
          <li key={language.language}>
            <CurrencySelectButton onClick={() => selectCurrency(language.language)}>
              <CurrecyItemWrapper>
                <span>{language.name}</span>
              </CurrecyItemWrapper>
              {language.language === props.language && (
                <Icon color='white800' label='IconCheckCircle' size='md'>
                  <IconCheckCircle />
                </Icon>
              )}
            </CurrencySelectButton>
          </li>
        ))}
      </CurrenciesList>
    </>
  )
}

const mapStateToProps = (state) => ({
  language: selectors.preferences.getLanguage(state),
  languages: languagesSortedByName
})

export default connect(mapStateToProps)(List)
