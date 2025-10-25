import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Auth\RegisteredPraktikanController::store
* @see app/Http/Controllers/Auth/RegisteredPraktikanController.php:52
* @route '/api-v1/register/praktikan'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api-v1/register/praktikan',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Auth\RegisteredPraktikanController::store
* @see app/Http/Controllers/Auth/RegisteredPraktikanController.php:52
* @route '/api-v1/register/praktikan'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\RegisteredPraktikanController::store
* @see app/Http/Controllers/Auth/RegisteredPraktikanController.php:52
* @route '/api-v1/register/praktikan'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Auth\RegisteredPraktikanController::store
* @see app/Http/Controllers/Auth/RegisteredPraktikanController.php:52
* @route '/api-v1/register/praktikan'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Auth\RegisteredPraktikanController::store
* @see app/Http/Controllers/Auth/RegisteredPraktikanController.php:52
* @route '/api-v1/register/praktikan'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Auth\RegisteredPraktikanController::getKelas
* @see app/Http/Controllers/Auth/RegisteredPraktikanController.php:24
* @route '/api-v1/get-kelas'
*/
export const getKelas = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getKelas.url(options),
    method: 'get',
})

getKelas.definition = {
    methods: ["get","head"],
    url: '/api-v1/get-kelas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Auth\RegisteredPraktikanController::getKelas
* @see app/Http/Controllers/Auth/RegisteredPraktikanController.php:24
* @route '/api-v1/get-kelas'
*/
getKelas.url = (options?: RouteQueryOptions) => {
    return getKelas.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\RegisteredPraktikanController::getKelas
* @see app/Http/Controllers/Auth/RegisteredPraktikanController.php:24
* @route '/api-v1/get-kelas'
*/
getKelas.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getKelas.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Auth\RegisteredPraktikanController::getKelas
* @see app/Http/Controllers/Auth/RegisteredPraktikanController.php:24
* @route '/api-v1/get-kelas'
*/
getKelas.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getKelas.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Auth\RegisteredPraktikanController::getKelas
* @see app/Http/Controllers/Auth/RegisteredPraktikanController.php:24
* @route '/api-v1/get-kelas'
*/
const getKelasForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getKelas.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Auth\RegisteredPraktikanController::getKelas
* @see app/Http/Controllers/Auth/RegisteredPraktikanController.php:24
* @route '/api-v1/get-kelas'
*/
getKelasForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getKelas.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Auth\RegisteredPraktikanController::getKelas
* @see app/Http/Controllers/Auth/RegisteredPraktikanController.php:24
* @route '/api-v1/get-kelas'
*/
getKelasForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getKelas.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

getKelas.form = getKelasForm

const RegisteredPraktikanController = { store, getKelas }

export default RegisteredPraktikanController