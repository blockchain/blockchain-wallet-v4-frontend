import React from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
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
  top: ${(props) => (props.errorBottom ? 48 : -20)}px;
  right: 0;
  height: 15px;
`

const monthElements = [
  {
    group: '',
    items: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ].map((month, index) => {
      const value = `${index + 1 < 10 ? '0' : ''}${index + 1}`
      return {
        text: `${value} - ${month}`,
        value
      }
    })
  }
]

const removeExtraDigits = (maxDigits) => replace(new RegExp(`(.{${maxDigits}}).*`), ($0, $1) => $1)
const formatDate = removeExtraDigits(2)
const formatYear = removeExtraDigits(4)

const MonthBox = ({ input, onBlur, onFocus, onMonthChange, otherMeta }) => (
  <MonthWrapper>
    <SelectBox
      label={
        <FormattedMessage id='components.DateInputBox.placeholder.month' defaultMessage='Month' />
      }
      menuPlacement='auto'
      elements={monthElements}
      input={{
        name: 'month',
        onBlur: onBlur.bind(this, 'month'),
        onChange: onMonthChange,
        onFocus,
        value: input.value.month
      }}
      meta={otherMeta}
    />
  </MonthWrapper>
)

const DateBox = ({ input, intl, onBlur, onDateChange, onFocus, otherMeta }) => (
  <InputWrapper className='first'>
    <NumberBox
      placeholder={intl.formatMessage({
        defaultMessage: 'Day',
        id: 'components.DateInputBox.placeholder.day'
      })}
      input={{
        name: 'date',
        onBlur: onBlur.bind(this, 'date'),
        onChange: onDateChange,
        onFocus,
        value: input.value.date
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
        defaultMessage: 'Year',
        id: 'components.DateInputBox.placeholder.year'
      })}
      input={{
        name: 'year',
        onBlur: onBlur.bind(this, 'year'),
        onChange: onYearChange,
        onFocus,
        value: input.value.year
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

  onFocus = (e) => {
    if (!this.state.isActive) this.props.input.onFocus(e)
    this.setState({ isActive: true })
  }

  onMonthChange = (month) => {
    this.props.input.onChange({
      ...this.props.input.value,
      month
    })
  }

  onYearChange = (e) =>
    this.props.input.onChange({
      ...this.props.input.value,
      year: formatYear(e.target.value)
    })

  onDateChange = (e) =>
    this.props.input.onChange({
      ...this.props.input.value,
      date: formatDate(e.target.value)
    })

  render() {
    const { className, countryIsUS, errorBottom, input, intl, meta } = this.props
    const { error, ...otherMeta } = meta
    const { onBlur, onDateChange, onFocus, onMonthChange, onYearChange } = this

    return (
      <Container className={className}>
        {countryIsUS ? (
          <RowWrapper>
            <MonthBox {...{ input, onBlur, onFocus, onMonthChange, otherMeta }} />
            <DateBox {...{ input, intl, onBlur, onDateChange, onFocus, otherMeta }} />
            <YearBox {...{ input, intl, onBlur, onFocus, onYearChange, otherMeta }} />
          </RowWrapper>
        ) : (
          <RowWrapper>
            <DateBox {...{ input, intl, onBlur, onDateChange, onFocus, otherMeta }} />
            <MonthBox
              {...{
                input,
                onBlur,
                onFocus,
                onMonthChange,
                // this is important to have proper focus once when user tab into this component
                otherMeta: { ...otherMeta, active: false }
              }}
            />
            <YearBox {...{ input, intl, onBlur, onFocus, onYearChange, otherMeta }} />
          </RowWrapper>
        )}

        {meta.touched && error && (
          <Error size='12px' weight={500} color='error' errorBottom={errorBottom}>
            {meta.error}
          </Error>
        )}
        {meta.touched && !error && meta.warning && (
          <Error size='12px' weight={500} color='error' errorBottom={errorBottom}>
            {meta.warning}
          </Error>
        )}
      </Container>
    )
  }
}

export default injectIntl(DateInputBox)
