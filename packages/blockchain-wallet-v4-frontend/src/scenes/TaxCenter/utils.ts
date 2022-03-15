import moment from 'moment'

export const FIRST_YEAR = 2014

export const getLimits = (option) => {
  if (option === 0) {
    return {
      from: moment().year(FIRST_YEAR).startOf('year').toISOString(),
      to: moment().subtract(1, 'days').toISOString()
    }
  }

  return {
    from: moment().year(option).startOf('year').toISOString(),
    to: moment().year(option).endOf('year').toISOString()
  }
}
