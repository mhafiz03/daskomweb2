import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Auth\RegisteredAsistenController::store
* @see app/Http/Controllers/Auth/RegisteredAsistenController.php:31
* @route '/api-v1/register/asisten'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api-v1/register/asisten',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Auth\RegisteredAsistenController::store
* @see app/Http/Controllers/Auth/RegisteredAsistenController.php:31
* @route '/api-v1/register/asisten'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\RegisteredAsistenController::store
* @see app/Http/Controllers/Auth/RegisteredAsistenController.php:31
* @route '/api-v1/register/asisten'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Auth\RegisteredAsistenController::store
* @see app/Http/Controllers/Auth/RegisteredAsistenController.php:31
* @route '/api-v1/register/asisten'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Auth\RegisteredAsistenController::store
* @see app/Http/Controllers/Auth/RegisteredAsistenController.php:31
* @route '/api-v1/register/asisten'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

const RegisteredAsistenController = { store }

export default RegisteredAsistenController