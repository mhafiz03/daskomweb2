import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Auth\PasswordPraktikanController::update
* @see app/Http/Controllers/Auth/PasswordPraktikanController.php:16
* @route '/praktikan/password'
*/
export const update = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/praktikan/password',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Auth\PasswordPraktikanController::update
* @see app/Http/Controllers/Auth/PasswordPraktikanController.php:16
* @route '/praktikan/password'
*/
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\PasswordPraktikanController::update
* @see app/Http/Controllers/Auth/PasswordPraktikanController.php:16
* @route '/praktikan/password'
*/
update.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Auth\PasswordPraktikanController::update
* @see app/Http/Controllers/Auth/PasswordPraktikanController.php:16
* @route '/praktikan/password'
*/
const updateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Auth\PasswordPraktikanController::update
* @see app/Http/Controllers/Auth/PasswordPraktikanController.php:16
* @route '/praktikan/password'
*/
updateForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

const PasswordPraktikanController = { update }

export default PasswordPraktikanController