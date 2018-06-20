import moment from 'services/MomentHelper'

export const isDatePosteriorToBtcGenesis = selectedDate => {
  const btcMinDate = moment('2009-01-03', 'YYYY-MM-DD', true)
  const date = moment(selectedDate)
  return date.diff(btcMinDate, 'day') >= 0
}

export const isDatePosteriorToBchGenesis = selectedDate => {
  const bchMinDate = moment('2017-08-01', 'YYYY-MM-DD', true)
  const date = moment(selectedDate)
  return date.diff(bchMinDate, 'day') >= 0
}

export const isDateAnterior = (date1, date2) => {
  return moment(date2).diff(moment(date1), 'day') > 0
}

export const isDatePosterior = (date1, date2) => {
  return moment(date2).diff(moment(date1), 'day') < 0
}

export const isValidBtcStartDate = (selectedDate, endDate) =>
  isDatePosteriorToBtcGenesis(selectedDate) && isDateAnterior(selectedDate, endDate)

export const isValidBtcEndDate = (selectedDate, startDate) =>
  isDatePosteriorToBtcGenesis(selectedDate) && isDatePosterior(selectedDate, startDate)

export const isValidBchStartDate = (selectedDate, endDate) =>
  isDatePosteriorToBchGenesis(selectedDate) && isDateAnterior(selectedDate, endDate)

export const isValidBchEndDate = (selectedDate, startDate) =>
  isDatePosteriorToBchGenesis(selectedDate) && isDatePosterior(selectedDate, startDate)
