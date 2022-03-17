import { model } from 'data'

const { FIRST_YEAR } = model.components.taxCenter

export const selectReports = (state) => state.components.taxCenter.reports

export const selectOptions = () => {
  const CURRENT_YEAR = new Date().getFullYear()

  const availableYears = CURRENT_YEAR - FIRST_YEAR
  const options = [...new Array(availableYears)].map((_, i) => ({
    text: `${FIRST_YEAR + i}`,
    value: FIRST_YEAR + i
  }))

  // current year
  options.push({
    text: `${CURRENT_YEAR}`,
    value: CURRENT_YEAR
  })

  // all time option
  options.push({
    text: `All Time`,
    value: 0
  })

  return options
}

export const selectCreateReport = (state) => state.components.taxCenter.createReport
