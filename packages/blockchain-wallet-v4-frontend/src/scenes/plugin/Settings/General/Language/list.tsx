import React from 'react'
import { useSelector } from 'react-redux'
import { Icon } from '@blockchain-com/constellation'
import { IconCheckCircle } from '@blockchain-com/icons'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
import { selectors } from 'data'
import { languagesSortedByName } from 'services/locales'

import { CurrecyItemWrapper, CurrenciesList, CurrencySelectButton } from '../Currency/list'

const LanguagesList = styled(CurrenciesList)`
  gap: 54px;
`

const LanguageLabel = styled(Text)`
  color: ${(props) => props.theme.white};
`

const List = (props) => {
  const currentLanguage = useSelector(selectors.preferences.getLanguage)
  const languages = languagesSortedByName
  const selectCurrency = (value) => {
    if (value === currentLanguage) return
    props.input.onChange(value)
  }

  return (
    <>
      <LanguagesList>
        {languages.map((language) => (
          <li key={language.language}>
            <CurrencySelectButton onClick={() => selectCurrency(language.language)}>
              <CurrecyItemWrapper>
                <LanguageLabel>{language.name}</LanguageLabel>
              </CurrecyItemWrapper>
              {language.language === currentLanguage && (
                <Icon color='white800' label='IconCheckCircle' size='md'>
                  <IconCheckCircle />
                </Icon>
              )}
            </CurrencySelectButton>
          </li>
        ))}
      </LanguagesList>
    </>
  )
}

export default List
