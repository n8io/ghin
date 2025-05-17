import { string } from '../../../../models'

const FOREIGN_STATE_CODE = '*F'
const courseStateCodeRegex = /^[A-Z]{1,2}-[A-Z*0-9]{1,4}$/

const schemaCourseSearchState = string.refine(
  (value) => {
    if (value === FOREIGN_STATE_CODE) {
      return true
    }

    return courseStateCodeRegex.test(value)
  },
  {
    message: 'Invalid state code format. Expected format: US-OH, LC-01, MX-*A, or *F',
  }
)

export { schemaCourseSearchState }
