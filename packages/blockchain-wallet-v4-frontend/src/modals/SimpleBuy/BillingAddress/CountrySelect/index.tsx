import React from 'react'
import { Field } from 'redux-form'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
import { SelectBox } from 'components/Form'
import { countries } from 'components/Form/SelectBoxCountry'

import { Props } from '../template.success'

const SelectBoxCountry = styled(SelectBox)`
  margin-bottom: 24px;
  .bc__dropdown-indicator {
    color: ${props => props.theme.grey600};
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
  padding: ${props => (props.isItem ? '0px 6px' : '16px 12px')};
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
  color: ${props => props.theme.grey800};
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
const IconContainer = styled.div`
  min-width: 32px;
  height: 32px;
  font-size: 40px;
  overflow: hidden;
  border-radius: 16px;
  background-color: ${props => props.theme.blue000};
  display: flex;
  align-items: center;
  justify-content: center;
`

class CountrySelect extends React.PureComponent<Props> {
  renderElements = () => {
    return [
      {
        group: '',
        items: countries
      }
    ]
  }

  renderDisplay = (
    props: {
      text: string
      value: string
    },
    children
  ) => {
    if (!props.value) return
    if (!this.props.formValues) return

    const isItem = !children

    return (
      <DisplayContainer isItem={isItem}>
        <IconContainer>
          {countries.find(country => country.value === props.value).emoji}
        </IconContainer>
        <Display>
          {children || props.text}
          <Text size='14px' color='grey600' weight={500}>
            {props.value}
          </Text>
        </Display>
      </DisplayContainer>
    )
  }

  render() {
    return (
      <Field
        component={SelectBoxCountry}
        elements={this.renderElements()}
        name='country'
        searchEnabled={false}
        templateDisplay={this.renderDisplay}
        templateItem={this.renderDisplay}
      />
    )
  }
}

export default CountrySelect
