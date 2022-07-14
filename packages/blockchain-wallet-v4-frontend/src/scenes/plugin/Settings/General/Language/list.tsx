import React from 'react'
import { connect, useSelector } from 'react-redux'
import { Icon } from '@blockchain-com/constellation'
import { IconCheckCircle } from '@blockchain-com/icons'

import { selectors } from 'data'
import { languagesSortedByName } from 'services/locales'

import { CurrecyItemWrapper, CurrenciesList, CurrencySelectButton } from '../Currency/list'

const List = (props) => {
  const currentLanguage = useSelector(selectors.preferences.getLanguage)
  const languages = languagesSortedByName
  const selectCurrency = (value) => {
    if (value === currentLanguage) return
    props.input.onChange(value)
  }

  return (
    <>
      <CurrenciesList>
        {languages.map((language) => (
          <li key={language.language}>
            <CurrencySelectButton onClick={() => selectCurrency(language.language)}>
              <CurrecyItemWrapper>
                <span>{language.name}</span>
              </CurrecyItemWrapper>
              {language.language === currentLanguage && (
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

export default List
