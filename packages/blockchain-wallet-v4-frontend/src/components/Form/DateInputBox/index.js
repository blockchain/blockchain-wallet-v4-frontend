import React from 'react'
import styled from 'styled-components'
import moment from 'moment'
import { FormattedMessage, injectIntl } from 'react-intl'

import { Text } from 'blockchain-info-components'
import SelectBox from '../SelectBox'
import NumberBox from '../NumberBox'

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: space-between;
  width: 100%;
  height: 40px;
`
const RowWrapper = styled.div`
  display: flex;
  flex-direction: row;
`
const SelectBoxMonth = styled(SelectBox)`
  width: 50%;
  margin-right: 15px;
`
const InputsWrapper = styled.div`
  width: 50%;
  display: flex;
  flex-direction: row;
`
const DateNumberBox = styled(NumberBox)`
  width: 50%;
  & :first-child {
    margin-right: 15px;
  }
`
const Error = styled(Text)`
  position: absolute;
  display: block;
  top: -18px;
  right: 0;
  height: 15px;
`

const monthElements = [
  {
    group: '',
    items: moment.months().map((month, index) => {
      const value = `${index + 1 < 10 ? '0' : ''}${index + 1}`
      return {
        text: `${value} - ${month}`,
        value
      }
    })
  }
]

class DateInputBox extends React.PureComponent {
  state = {
    isActive: false
  }

  onBlur = () => {
    this.setState({ isActive: false })
    requestAnimationFrame(() => {
      // If one of the other DateInputBox's field has been focused
      // isActive is true
      if (!this.state.isActive) this.props.input.onBlur(this.props.input.value)
    })
  }

  onFocus = e => {
    if (!this.state.isActive) this.props.input.onFocus(e)
    this.setState({ isActive: true })
  }

  onMonthChange = month => {
    this.props.input.onChange({
      ...this.props.input.value,
      month
    })
  }

  onYearChange = e =>
    this.props.input.onChange({
      ...this.props.input.value,
      year: e.target.value
    })

  onDateChange = e =>
    this.props.input.onChange({
      ...this.props.input.value,
      date: e.target.value
    })

  render () {
    const { input, meta, errorBottom, intl } = this.props
    const { error, ...otherMeta } = meta

    return (
      <Container>
        <RowWrapper>
          <SelectBoxMonth
            label={
              <FormattedMessage
                id='components.DateInputBox.placeholder.month'
                defaultMessage='Month'
              />
            }
            elements={monthElements}
            input={{
              name: 'month',
              value: input.value.month,
              onBlur: this.onBlur,
              onChange: this.onMonthChange,
              onFocus: this.onFocus
            }}
            meta={otherMeta}
          />
          <InputsWrapper>
            <DateNumberBox
              placeholder={intl.formatMessage({
                id: 'components.DateInputBox.placeholder.day',
                defaultMessage: 'Date (DD)'
              })}
              input={{
                name: 'date',
                value: input.value.date,
                onBlur: this.onBlur,
                onChange: this.onDateChange,
                onFocus: this.onFocus
              }}
              meta={otherMeta}
            />
            <DateNumberBox
              placeholder={intl.formatMessage({
                id: 'components.DateInputBox.placeholder.year',
                defaultMessage: 'Year (YYYY)'
              })}
              input={{
                name: 'year',
                value: input.value.year,
                onBlur: this.onBlur,
                onChange: this.onYearChange,
                onFocus: this.onFocus
              }}
              meta={otherMeta}
            />
          </InputsWrapper>
        </RowWrapper>

        {meta.touched &&
          error && (
            <Error
              size='12px'
              weight={300}
              color='error'
              errorBottom={errorBottom}
            >
              {meta.error}
            </Error>
          )}
        {meta.touched &&
          !error &&
          meta.warning && (
            <Error
              size='12px'
              weight={300}
              color='sent'
              errorBottom={errorBottom}
            >
              {meta.warning}
            </Error>
          )}
      </Container>
    )
  }
}

export default injectIntl(DateInputBox)
