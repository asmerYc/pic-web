import {get,post} from './http'

// export const apiAddress = p =>get('/api/system/module/queryParent',p)
export const apiAddress = p =>post('/api/v1/admin/app',p)