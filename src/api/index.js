import { Apis } from './urls'
import { axiosRx, axiosEr } from '../utils'
import { map } from 'rxjs/operators'

// // export * from './urls'
// // const fetchSystemModules = axiosRx({
// //         url: Apis.parentModules,
// //     })
// //     .pipe(
// //         map(( /** @type { Res } */ it) => it.code === 0 ? it.data : [])
// //     )


// // const SystemModuleAdd = (data) => {
// //     return axiosEr({
// //         url: Apis.modules,
// //         method: 'post',
// //         data,
// //     })
// // }

const login = (data) => {
    return axiosEr({
        url: Apis.login,
        method: 'post',
        data,
    })
}

export {
    login,
    // SystemModuleAdd,
    // fetchSystemModules,
}