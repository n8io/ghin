import { float } from '../../../../models'

const schemaGeoCoordinate = float.transform((value) => (value ? value : null)).nullable()

export { schemaGeoCoordinate }
