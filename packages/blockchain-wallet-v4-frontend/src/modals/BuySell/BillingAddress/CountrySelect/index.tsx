import React from 'react'
import { Field } from 'redux-form'
import styled from 'styled-components'

import { CountryScope } from '@core/types'
import { Text } from 'blockchain-info-components'
import SelectBox from 'components/Form/SelectBox'
import { CountryType } from 'data/types'
import { useCountryList } from 'hooks'

import { Props } from '../template.success'

const SelectBoxCountry = styled(SelectBox)`
  margin-bottom: 24px;
  .bc__dropdown-indicator {
    color: ${(props) => props.theme.grey600};
  }
  .bc__single-value {
    position: relative;
    top: 0;
    transform: initial;
    margin: 0;
  }
`
const DisplayContainer = styled.div<{
  isItem: boolean
}>`
  display: flex;
  width: 100%;
  align-items: center;
  box-sizing: border-box;
  justify-content: space-between;
  padding: ${(props) => (props.isItem ? '0px 6px' : '16px 12px')};
`
const Display = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  margin-left: 12px;
  color: ${(props) => props.theme.grey800};
  .bc__single-value {
    position: relative;
    top: 0;
    transform: initial;
    margin: 0;
  }
  input {
    height: 0;
  }
`

const CountrySelect = (props: Props) => {
  const { data: supportedCountries } = useCountryList({ scope: CountryScope.SIGNUP })

  const { formValues } = props

  if (!supportedCountries?.countries) {
    return <></>
  }

  const getCountryElements = (countries: Array<CountryType>) => [
    {
      group: '',
      items: countries.map((country: CountryType) => ({
        text: country.name,
        value: country.code
      }))
    }
  ]

  const renderDisplay = (
    props: {
      text: string
      value: string
    },
    children
  ) => {
    if (!props.value) return
    if (!formValues) return

    const isItem = !children

    return (
      <DisplayContainer isItem={isItem}>
        <Display>
          {children || props.text}
          <Text size='14px' color='grey600' weight={500}>
            {props.value}
          </Text>
        </Display>
      </DisplayContainer>
    )
  }

  return (
    <Field
      component={SelectBoxCountry}
      elements={getCountryElements(supportedCountries.countries)}
      name='country'
      searchEnabled={false}
      templateDisplay={renderDisplay}
      templateItem={renderDisplay}
    />
  )
}

export default CountrySelect
