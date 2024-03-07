import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Cookies from 'universal-cookie'

import { SimpleDropdown } from 'blockchain-info-components/src/Dropdowns'
import { preferences } from 'data/actions'
import { getLanguage } from 'data/preferences/selectors'
import { languagesSortedByName as languages } from 'services/locales'

const DropdownLanguage = ({ color, size }: { color: string; size: string }) => {
  const dispatch = useDispatch()
  const currentLanguage = useSelector(getLanguage)

  const handleClick = (selectedLanguage) => {
    const cookies = new Cookies()
    dispatch(preferences.setLanguage({ language: selectedLanguage.language, showAlert: true }))
    cookies.set('clang', selectedLanguage.language, {
      domain: '.blockchain.com',
      path: '/'
    })
  }

  const languageList = languages.map((lang) => {
    return {
      language: lang.language,
      text: lang.name,
      value: lang.language
    }
  })

  return (
    <SimpleDropdown
      color={color || 'whiteFade900'}
      uppercase={false}
      items={languageList}
      selectedValue={currentLanguage}
      size={size}
      callback={(selectedLanguage) => handleClick(selectedLanguage)}
    />
  )
}

export default DropdownLanguage
