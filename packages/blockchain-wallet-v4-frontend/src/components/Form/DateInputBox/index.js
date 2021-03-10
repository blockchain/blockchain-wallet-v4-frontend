import React from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import moment from 'moment'
import { replace } from 'ramda'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
import { media } from 'services/styles'

import NumberBox from '../NumberBox'
import SelectBox from '../SelectBox'

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: space-between;
  width: 100%;
`
const RowWrapper = styled.div`
  display: flex;
  flex-direction: row;
  ${media.mobile`
    flex-direction: column;
    margin-bottom: 0;
    >:not(:first-child) {
      margin-top: 16px;
    }
  `};
`
const LabelWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`
const MonthWrapper = styled(LabelWrapper)`
  width: 50%;
  margin-right: 15px;
  ${media.mobile`
    margin: 0;
    width: 100%;
  `};
`
const InputWrapper = styled(LabelWrapper)`
  width: calc(25% - 8px);
  &.first {
    margin-right: 16px;
  }
  ${media.mobile`
    &.first {
      margin-right: 0;
    }
    width: 100%;
  `};
`
const Error = styled(Text)`
  position: absolute;
  display: block;
  top: ${props => (props.errorBottom ? 48 : -20)}px;
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

const removeExtraDigits = maxDigits =>
  replace(new RegExp(`(.{${maxDigits}}).*`), ($0, $1) => $1)
const formatDate = removeExtraDigits(2)
const formatYear = removeExtraDigits(4)

const MonthBox = ({ input, onBlur, onFocus, onMonthChange, otherMeta }) => (
  <MonthWrapper>
    <SelectBox
      label={
        <FormattedMessage
          id='components.DateInputBox.placeholder.month'
          defaultMessage='Month'
        />
      }
      menuPlacement='auto'
      elements={monthElements}
      input={{
        name: 'month',
        value: input.value.month,
        onBlur: onBlur.bind(this, 'month'),
        onChange: onMonthChange,
        onFocus: onFocus
      }}
      meta={otherMeta}
    />
  </MonthWrapper>
)

const DateBox = ({ input, intl, onBlur, onDateChange, onFocus, otherMeta }) => (
  <InputWrapper className='first'>
    <NumberBox
      placeholder={intl.formatMessage({
        id: 'components.DateInputBox.placeholder.day',
        defaultMessage: 'Day'
      })}
      input={{
        name: 'date',
        value: input.value.date,
        onBlur: onBlur.bind(this, 'date'),
        onChange: onDateChange,
        onFocus: onFocus
      }}
      size='16px'
      meta={otherMeta}
    />
  </InputWrapper>
)

const YearBox = ({ input, intl, onBlur, onFocus, onYearChange, otherMeta }) => (
  <InputWrapper>
    <NumberBox
      placeholder={intl.formatMessage({
        id: 'components.DateInputBox.placeholder.year',
        defaultMessage: 'Year'
      })}
      input={{
        name: 'year',
        value: input.value.year,
        onBlur: onBlur.bind(this, 'year'),
        onChange: onYearChange,
        onFocus: onFocus
      }}
      size='16px'
      meta={otherMeta}
    />
  </InputWrapper>
)

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
      year: formatYear(e.target.value)
    })

  onDateChange = e =>
    this.props.input.onChange({
      ...this.props.input.value,
      date: formatDate(e.target.value)
    })

  render() {
    const {
      className,
      countryIsUS,
      errorBottom,
      input,
      intl,
      meta
    } = this.props
    const { error, ...otherMeta } = meta
    const { onBlur, onDateChange, onFocus, onMonthChange, onYearChange } = this

    return (
      <Container className={className}>
        {countryIsUS ? (
          <RowWrapper>
            <MonthBox
              {...{ input, otherMeta, onBlur, onMonthChange, onFocus }}
            />
            <DateBox
              {...{ intl, input, onBlur, onDateChange, onFocus, otherMeta }}
            />
            <YearBox
              {...{ intl, input, onBlur, onYearChange, onFocus, otherMeta }}
            />
          </RowWrapper>
        ) : (
          <RowWrapper>
            <DateBox
              {...{ intl, input, onBlur, onDateChange, onFocus, otherMeta }}
            />
            <MonthBox
              {...{ input, otherMeta, onBlur, onMonthChange, onFocus }}
            />
            <YearBox
              {...{ intl, input, onBlur, onYearChange, onFocus, otherMeta }}
            />
          </RowWrapper>
        )}

        {meta.touched && error && (
          <Error
            size='12px'
            weight={500}
            color='error'
            errorBottom={errorBottom}
          >
            {meta.error}
          </Error>
        )}
        {meta.touched && !error && meta.warning && (
          <Error
            size='12px'
            weight={500}
            color='error'
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
