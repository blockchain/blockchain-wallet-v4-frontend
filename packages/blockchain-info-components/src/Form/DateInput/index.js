import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import ReactDatetime from 'react-datetime'

const BaseDateInput = styled(ReactDatetime)`
  position: relative;

  .form-control {
    display: block;
    width: ${props => props.fullwidth ? '100%' : '150px'};
    height: 40px;
    min-height: 40px;
    padding: 6px 12px;
    box-sizing: border-box;
    font-family: 'Montserrat', Helvetica, sans-serif;
    font-size: 14px;
    font-weight: 300;
    color: ${props => props.theme['gray-5']};
    background-color: ${props => props.theme['white']};
    background-image: none;
    outline-width: 0;
    user-select: text;
    border: 1px solid  ${props => props.theme[props.borderColor]};
  }

  .rdtPicker {
    display: none;
    position: absolute;
    width: 250px;
    padding: 4px;
    margin-top: 1px;
    z-index: 99999 !important;
    background: #fff;
    box-shadow: 0 1px 3px rgba(0,0,0,.1);
    border: 1px solid ${props => props.theme['gray-2']};
    border-radius: 5px;
  }

  &.rdtOpen .rdtPicker {
    display: block;
  }

  &.rdtStatic .rdtPicker {
    box-shadow: none;
    position: static;
  }

  .rdtPicker .rdtTimeToggle {
    text-align: center;
  }

  .rdtPicker table {
    width: 100%;
    margin: 0;
  }
  .rdtPicker td,
  .rdtPicker th {
    text-align: center;
    height: 28px;
  }
  .rdtPicker td {
    font-family: 'Montserrat', Helvetica, sans-serif;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
  }
  .rdtPicker td.rdtDay:hover,
  .rdtPicker td.rdtHour:hover,
  .rdtPicker td.rdtMinute:hover,
  .rdtPicker td.rdtSecond:hover,
  .rdtPicker .rdtTimeToggle:hover {
    cursor: pointer;
    background: ${props => props.theme['gray-1']};
    border: 1px solid ${props => props.theme['gray-1']};
    border-radius: 5px;
    box-sizing: border-box;
  }
  .rdtPicker td.rdtOld,
  .rdtPicker td.rdtNew {
    color: ${props => props.theme['gray-2']};
  }
  .rdtPicker td.rdtToday {
    position: relative;
  }
  .rdtPicker td.rdtToday:before {
    content: '';
    display: inline-block;
    border-left: 7px solid transparent;
    border-bottom: 7px solid #428bca;
    border-top-color: rgba(0, 0, 0, 0.2);
    position: absolute;
    bottom: 4px;
    right: 4px;
  }
  .rdtPicker td.rdtActive,
  .rdtPicker td.rdtActive:hover {
    background-color: ${props => props.theme['brand-secondary']};
    color: ${props => props.theme['white']};
    text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.25);
    border: 1px solid ${props => props.theme['brand-secondary']};
    border-radius: 5px;
    box-sizing: border-box;
  }
  .rdtPicker td.rdtActive.rdtToday:before {
    border-bottom-color: ${props => props.theme['white']};
  }
  .rdtPicker td.rdtDisabled,
  .rdtPicker td.rdtDisabled:hover {
    background: none;
    color: ${props => props.theme['gray-2']};
    cursor: not-allowed;
  }

  .rdtPicker td span.rdtOld {
    color: ${props => props.theme['gray-2']};
  }
  .rdtPicker td span.rdtDisabled,
  .rdtPicker td span.rdtDisabled:hover {
    background: none;
    color: ${props => props.theme['gray-2']};
    cursor: not-allowed;
  }
  .rdtPicker th {
    border-bottom: 1px solid #f9f9f9;
  }
  .rdtPicker .dow {
    width: 14.2857%;
    border-bottom: none;
    cursor: default;
    font-family: 'Montserrat', Helvetica, sans-serif;
    font-size: 14px;
    font-weight: 300;
  }
  .rdtPicker th.rdtSwitch {
    width: 100px;
    height: 30px;
    font-family: 'Montserrat', Helvetica, sans-serif;
    font-size: 14px;
    font-weight: 400;
    border: 1px solid ${props => props.theme['gray-1']};
    border-radius: 5px;
    box-sizing: border-box;
  }
  .rdtPicker th.rdtNext,
  .rdtPicker th.rdtPrev {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
    font-family: 'Montserrat', Helvetica, sans-serif;
    font-size: 24px;
    font-weight: 300;
    border: 1px solid ${props => props.theme['gray-1']};
    border-radius: 5px;
    box-sizing: border-box;
  }

  .rdtPrev span,
  .rdtNext span {
    display: block;
    line-height: 0;
    user-select: none;
  }

  .rdtPicker th.rdtDisabled,
  .rdtPicker th.rdtDisabled:hover {
    background: none;
    color: ${props => props.theme['gray-2']};
    cursor: not-allowed;
  }
  .rdtPicker thead tr:first-child th {
    cursor: pointer;
  }
  .rdtPicker thead tr:first-child th:hover {
    background: #eeeeee;
  }

  .rdtPicker tfoot {
    border-top: 1px solid #f9f9f9;
  }

  .rdtPicker button {
    border: none;
    background: none;
    cursor: pointer;
  }
  .rdtPicker button:hover {
    background-color: ${props => props.theme['gray-1']};
  }

  .rdtPicker thead button {
    width: 100%;
    height: 100%;
  }

  td.rdtMonth,
  td.rdtYear {
    height: 50px;
    width: 25%;
    cursor: pointer;
  }
  td.rdtMonth:hover,
  td.rdtYear:hover {
    background: #eee;
  }

  .rdtCounters {
    display: inline-block;
  }

  .rdtCounters > div {
    float: left;
  }

  .rdtCounter {
    height: 100px;
  }

  .rdtCounter {
    width: 40px;
  }

  .rdtCounterSeparator {
    line-height: 100px;
  }

  .rdtCounter .rdtBtn {
    height: 40%;
    line-height: 40px;
    cursor: pointer;
    display: block;
    user-select: none;
  }
  .rdtCounter .rdtBtn:hover {
    background: #eee;
  }
  .rdtCounter .rdtCount {
    height: 20%;
    font-size: 1.2em;
  }

  .rdtMilli {
    vertical-align: middle;
    padding-left: 8px;
    width: 48px;
  }

  .rdtMilli input {
    width: 100%;
    font-size: 1.2em;
    margin-top: 37px;
  }

  .rdtTime td {
    cursor: default;
  }

`

const selectBorderColor = (state) => {
  switch (state) {
    case 'initial': return 'gray-2'
    case 'invalid': return 'error'
    case 'valid': return 'success'
    default: return 'gray-2'
  }
}

const DateInput = props => {
  console.log('props', props)
  const { errorState, ...rest } = props
  const borderColor = selectBorderColor(props.errorState)

  return <BaseDateInput borderColor={borderColor} {...rest} />
}

// Documentation: https://github.com/arqex/react-datetime
DateInput.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  dateFormat: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  timeFormat: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  input: PropTypes.bool,
  open: PropTypes.bool,
  locale: PropTypes.string,
  utc: PropTypes.bool,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  viewMode: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  inputProps: PropTypes.object,
  isValidDate: PropTypes.func,
  renderDay: PropTypes.func,
  renderMonth: PropTypes.func,
  renderYear: PropTypes.func,
  strictParsing: PropTypes.bool,
  closeOnSelect: PropTypes.bool,
  closeOnTab: PropTypes.bool,
  timeConstraints: PropTypes.object,
  disableOnClickOutside: PropTypes.bool,
  fullwidth: PropTypes.bool
}

DateInput.defaultProps = {
  open: true,
  dateFormat: true,
  timeFormat: false,
  input: true,
  utc: false,
  viewMode: 'days',
  className: '',
  locale: 'fr',
  strictParsing: false,
  closeOnSelect: true,
  closeOnTab: true,
  fullwidth: false
}

export default DateInput
