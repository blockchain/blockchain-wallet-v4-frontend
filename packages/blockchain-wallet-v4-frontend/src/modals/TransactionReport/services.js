import moment from 'moment'

export const isDatePosteriorToBtcGenesis = selectedDate => {
  const btcMinDate = moment('2009-01-03')
  const date = moment(selectedDate)
  return date.diff(btcMinDate, 'day') >= 0
}

export const isDatePosteriorToBchGenesis = selectedDate => {
  const bchMinDate = moment('2017-08-01')
  const date = moment(selectedDate)
  return date.diff(bchMinDate, 'day') >= 0
}

export const isDateAnterior = (date1, date2) => {
  return moment(date2).diff(date1, 'day') > 0
}

export const getBtcStartDates = (selectedDate, endDate) =>
  isDatePosteriorToBtcGenesis(selectedDate) && isDateAnterior(selectedDate, endDate)

export const getBtcEndDates = (selectedDate, startDate) =>
  isDatePosteriorToBtcGenesis(selectedDate) && isDateAnterior(startDate, selectedDate)

export const getBchStartDates = (selectedDate, endDate) =>
  isDatePosteriorToBchGenesis(selectedDate) && isDateAnterior(selectedDate, endDate)

export const getBchEndDates = (selectedDate, startDate) =>
  isDatePosteriorToBchGenesis(selectedDate) && isDateAnterior(startDate, selectedDate)
