import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Auth\LoginPraktikanController::store
* @see app/Http/Controllers/Auth/LoginPraktikanController.php:31
* @route '/login/praktikan'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/login/praktikan',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Auth\LoginPraktikanController::store
* @see app/Http/Controllers/Auth/LoginPraktikanController.php:31
* @route '/login/praktikan'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\LoginPraktikanController::store
* @see app/Http/Controllers/Auth/LoginPraktikanController.php:31
* @route '/login/praktikan'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Auth\LoginPraktikanController::store
* @see app/Http/Controllers/Auth/LoginPraktikanController.php:31
* @route '/login/praktikan'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Auth\LoginPraktikanController::store
* @see app/Http/Controllers/Auth/LoginPraktikanController.php:31
* @route '/login/praktikan'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Auth\LoginPraktikanController::destroy
* @see app/Http/Controllers/Auth/LoginPraktikanController.php:59
* @route '/praktikan/logout'
*/
export const destroy = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: destroy.url(options),
    method: 'post',
})

destroy.definition = {
    methods: ["post"],
    url: '/praktikan/logout',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Auth\LoginPraktikanController::destroy
* @see app/Http/Controllers/Auth/LoginPraktikanController.php:59
* @route '/praktikan/logout'
*/
destroy.url = (options?: RouteQueryOptions) => {
    return destroy.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\LoginPraktikanController::destroy
* @see app/Http/Controllers/Auth/LoginPraktikanController.php:59
* @route '/praktikan/logout'
*/
destroy.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: destroy.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Auth\LoginPraktikanController::destroy
* @see app/Http/Controllers/Auth/LoginPraktikanController.php:59
* @route '/praktikan/logout'
*/
const destroyForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Auth\LoginPraktikanController::destroy
* @see app/Http/Controllers/Auth/LoginPraktikanController.php:59
* @route '/praktikan/logout'
*/
destroyForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(options),
    method: 'post',
})

destroy.form = destroyForm

const LoginPraktikanController = { store, destroy }

export default LoginPraktikanController