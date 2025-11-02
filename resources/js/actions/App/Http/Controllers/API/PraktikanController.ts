import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\API\PraktikanController::updatePassword
* @see app/Http/Controllers/API/PraktikanController.php:301
* @route '/api-v1/praktikan/password'
*/
export const updatePassword = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updatePassword.url(options),
    method: 'patch',
})

updatePassword.definition = {
    methods: ["patch"],
    url: '/api-v1/praktikan/password',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\API\PraktikanController::updatePassword
* @see app/Http/Controllers/API/PraktikanController.php:301
* @route '/api-v1/praktikan/password'
*/
updatePassword.url = (options?: RouteQueryOptions) => {
    return updatePassword.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\API\PraktikanController::updatePassword
* @see app/Http/Controllers/API/PraktikanController.php:301
* @route '/api-v1/praktikan/password'
*/
updatePassword.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updatePassword.url(options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\API\PraktikanController::updatePassword
* @see app/Http/Controllers/API/PraktikanController.php:301
* @route '/api-v1/praktikan/password'
*/
const updatePasswordForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updatePassword.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\API\PraktikanController::updatePassword
* @see app/Http/Controllers/API/PraktikanController.php:301
* @route '/api-v1/praktikan/password'
*/
updatePasswordForm.patch = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updatePassword.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

updatePassword.form = updatePasswordForm

/**
* @see \App\Http\Controllers\API\PraktikanController::setPraktikan
* @see app/Http/Controllers/API/PraktikanController.php:58
* @route '/api-v1/tarik-praktikan'
*/
export const setPraktikan = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: setPraktikan.url(options),
    method: 'post',
})

setPraktikan.definition = {
    methods: ["post"],
    url: '/api-v1/tarik-praktikan',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\API\PraktikanController::setPraktikan
* @see app/Http/Controllers/API/PraktikanController.php:58
* @route '/api-v1/tarik-praktikan'
*/
setPraktikan.url = (options?: RouteQueryOptions) => {
    return setPraktikan.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\API\PraktikanController::setPraktikan
* @see app/Http/Controllers/API/PraktikanController.php:58
* @route '/api-v1/tarik-praktikan'
*/
setPraktikan.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: setPraktikan.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\API\PraktikanController::setPraktikan
* @see app/Http/Controllers/API/PraktikanController.php:58
* @route '/api-v1/tarik-praktikan'
*/
const setPraktikanForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: setPraktikan.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\API\PraktikanController::setPraktikan
* @see app/Http/Controllers/API/PraktikanController.php:58
* @route '/api-v1/tarik-praktikan'
*/
setPraktikanForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: setPraktikan.url(options),
    method: 'post',
})

setPraktikan.form = setPraktikanForm

/**
* @see \App\Http\Controllers\API\PraktikanController::getAssignedPraktikan
* @see app/Http/Controllers/API/PraktikanController.php:137
* @route '/api-v1/praktikan-tertarik'
*/
export const getAssignedPraktikan = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getAssignedPraktikan.url(options),
    method: 'get',
})

getAssignedPraktikan.definition = {
    methods: ["get","head"],
    url: '/api-v1/praktikan-tertarik',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\API\PraktikanController::getAssignedPraktikan
* @see app/Http/Controllers/API/PraktikanController.php:137
* @route '/api-v1/praktikan-tertarik'
*/
getAssignedPraktikan.url = (options?: RouteQueryOptions) => {
    return getAssignedPraktikan.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\API\PraktikanController::getAssignedPraktikan
* @see app/Http/Controllers/API/PraktikanController.php:137
* @route '/api-v1/praktikan-tertarik'
*/
getAssignedPraktikan.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getAssignedPraktikan.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\PraktikanController::getAssignedPraktikan
* @see app/Http/Controllers/API/PraktikanController.php:137
* @route '/api-v1/praktikan-tertarik'
*/
getAssignedPraktikan.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getAssignedPraktikan.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\API\PraktikanController::getAssignedPraktikan
* @see app/Http/Controllers/API/PraktikanController.php:137
* @route '/api-v1/praktikan-tertarik'
*/
const getAssignedPraktikanForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getAssignedPraktikan.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\PraktikanController::getAssignedPraktikan
* @see app/Http/Controllers/API/PraktikanController.php:137
* @route '/api-v1/praktikan-tertarik'
*/
getAssignedPraktikanForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getAssignedPraktikan.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\PraktikanController::getAssignedPraktikan
* @see app/Http/Controllers/API/PraktikanController.php:137
* @route '/api-v1/praktikan-tertarik'
*/
getAssignedPraktikanForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getAssignedPraktikan.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

getAssignedPraktikan.form = getAssignedPraktikanForm

/**
* @see \App\Http\Controllers\API\PraktikanController::setPassword
* @see app/Http/Controllers/API/PraktikanController.php:237
* @route '/api-v1/set-password'
*/
export const setPassword = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: setPassword.url(options),
    method: 'patch',
})

setPassword.definition = {
    methods: ["patch"],
    url: '/api-v1/set-password',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\API\PraktikanController::setPassword
* @see app/Http/Controllers/API/PraktikanController.php:237
* @route '/api-v1/set-password'
*/
setPassword.url = (options?: RouteQueryOptions) => {
    return setPassword.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\API\PraktikanController::setPassword
* @see app/Http/Controllers/API/PraktikanController.php:237
* @route '/api-v1/set-password'
*/
setPassword.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: setPassword.url(options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\API\PraktikanController::setPassword
* @see app/Http/Controllers/API/PraktikanController.php:237
* @route '/api-v1/set-password'
*/
const setPasswordForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: setPassword.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\API\PraktikanController::setPassword
* @see app/Http/Controllers/API/PraktikanController.php:237
* @route '/api-v1/set-password'
*/
setPasswordForm.patch = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: setPassword.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

setPassword.form = setPasswordForm

const PraktikanController = { updatePassword, setPraktikan, getAssignedPraktikan, setPassword }

export default PraktikanController