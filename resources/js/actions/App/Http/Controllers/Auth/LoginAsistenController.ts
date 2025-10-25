import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Auth\LoginAsistenController::store
* @see app/Http/Controllers/Auth/LoginAsistenController.php:33
* @route '/login/asisten'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/login/asisten',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Auth\LoginAsistenController::store
* @see app/Http/Controllers/Auth/LoginAsistenController.php:33
* @route '/login/asisten'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\LoginAsistenController::store
* @see app/Http/Controllers/Auth/LoginAsistenController.php:33
* @route '/login/asisten'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Auth\LoginAsistenController::store
* @see app/Http/Controllers/Auth/LoginAsistenController.php:33
* @route '/login/asisten'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Auth\LoginAsistenController::store
* @see app/Http/Controllers/Auth/LoginAsistenController.php:33
* @route '/login/asisten'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Auth\LoginAsistenController::destroy
* @see app/Http/Controllers/Auth/LoginAsistenController.php:64
* @route '/asisten/logout'
*/
export const destroy = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: destroy.url(options),
    method: 'post',
})

destroy.definition = {
    methods: ["post"],
    url: '/asisten/logout',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Auth\LoginAsistenController::destroy
* @see app/Http/Controllers/Auth/LoginAsistenController.php:64
* @route '/asisten/logout'
*/
destroy.url = (options?: RouteQueryOptions) => {
    return destroy.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\LoginAsistenController::destroy
* @see app/Http/Controllers/Auth/LoginAsistenController.php:64
* @route '/asisten/logout'
*/
destroy.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: destroy.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Auth\LoginAsistenController::destroy
* @see app/Http/Controllers/Auth/LoginAsistenController.php:64
* @route '/asisten/logout'
*/
const destroyForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Auth\LoginAsistenController::destroy
* @see app/Http/Controllers/Auth/LoginAsistenController.php:64
* @route '/asisten/logout'
*/
destroyForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(options),
    method: 'post',
})

destroy.form = destroyForm

const LoginAsistenController = { store, destroy }

export default LoginAsistenController