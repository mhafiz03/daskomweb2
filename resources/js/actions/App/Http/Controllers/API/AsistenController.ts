import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\API\AsistenController::update
* @see app/Http/Controllers/API/AsistenController.php:67
* @route '/api-v1/asisten'
*/
export const update = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/api-v1/asisten',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\API\AsistenController::update
* @see app/Http/Controllers/API/AsistenController.php:67
* @route '/api-v1/asisten'
*/
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\API\AsistenController::update
* @see app/Http/Controllers/API/AsistenController.php:67
* @route '/api-v1/asisten'
*/
update.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\API\AsistenController::update
* @see app/Http/Controllers/API/AsistenController.php:67
* @route '/api-v1/asisten'
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
* @see \App\Http\Controllers\API\AsistenController::update
* @see app/Http/Controllers/API/AsistenController.php:67
* @route '/api-v1/asisten'
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

/**
* @see \App\Http\Controllers\API\AsistenController::updatePp
* @see app/Http/Controllers/API/AsistenController.php:101
* @route '/api-v1/profilePic'
*/
export const updatePp = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updatePp.url(options),
    method: 'post',
})

updatePp.definition = {
    methods: ["post"],
    url: '/api-v1/profilePic',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\API\AsistenController::updatePp
* @see app/Http/Controllers/API/AsistenController.php:101
* @route '/api-v1/profilePic'
*/
updatePp.url = (options?: RouteQueryOptions) => {
    return updatePp.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\API\AsistenController::updatePp
* @see app/Http/Controllers/API/AsistenController.php:101
* @route '/api-v1/profilePic'
*/
updatePp.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updatePp.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\API\AsistenController::updatePp
* @see app/Http/Controllers/API/AsistenController.php:101
* @route '/api-v1/profilePic'
*/
const updatePpForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updatePp.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\API\AsistenController::updatePp
* @see app/Http/Controllers/API/AsistenController.php:101
* @route '/api-v1/profilePic'
*/
updatePpForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updatePp.url(options),
    method: 'post',
})

updatePp.form = updatePpForm

/**
* @see \App\Http\Controllers\API\AsistenController::destroyPp
* @see app/Http/Controllers/API/AsistenController.php:164
* @route '/api-v1/profilePic'
*/
export const destroyPp = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyPp.url(options),
    method: 'delete',
})

destroyPp.definition = {
    methods: ["delete"],
    url: '/api-v1/profilePic',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\API\AsistenController::destroyPp
* @see app/Http/Controllers/API/AsistenController.php:164
* @route '/api-v1/profilePic'
*/
destroyPp.url = (options?: RouteQueryOptions) => {
    return destroyPp.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\API\AsistenController::destroyPp
* @see app/Http/Controllers/API/AsistenController.php:164
* @route '/api-v1/profilePic'
*/
destroyPp.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyPp.url(options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\API\AsistenController::destroyPp
* @see app/Http/Controllers/API/AsistenController.php:164
* @route '/api-v1/profilePic'
*/
const destroyPpForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroyPp.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\API\AsistenController::destroyPp
* @see app/Http/Controllers/API/AsistenController.php:164
* @route '/api-v1/profilePic'
*/
destroyPpForm.delete = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroyPp.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroyPp.form = destroyPpForm

/**
* @see \App\Http\Controllers\API\AsistenController::updatePassword
* @see app/Http/Controllers/API/AsistenController.php:199
* @route '/api-v1/asisten/password'
*/
export const updatePassword = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updatePassword.url(options),
    method: 'patch',
})

updatePassword.definition = {
    methods: ["patch"],
    url: '/api-v1/asisten/password',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\API\AsistenController::updatePassword
* @see app/Http/Controllers/API/AsistenController.php:199
* @route '/api-v1/asisten/password'
*/
updatePassword.url = (options?: RouteQueryOptions) => {
    return updatePassword.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\API\AsistenController::updatePassword
* @see app/Http/Controllers/API/AsistenController.php:199
* @route '/api-v1/asisten/password'
*/
updatePassword.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updatePassword.url(options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\API\AsistenController::updatePassword
* @see app/Http/Controllers/API/AsistenController.php:199
* @route '/api-v1/asisten/password'
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
* @see \App\Http\Controllers\API\AsistenController::updatePassword
* @see app/Http/Controllers/API/AsistenController.php:199
* @route '/api-v1/asisten/password'
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
* @see \App\Http\Controllers\API\AsistenController::index
* @see app/Http/Controllers/API/AsistenController.php:24
* @route '/api-v1/asisten'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api-v1/asisten',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\API\AsistenController::index
* @see app/Http/Controllers/API/AsistenController.php:24
* @route '/api-v1/asisten'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\API\AsistenController::index
* @see app/Http/Controllers/API/AsistenController.php:24
* @route '/api-v1/asisten'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\AsistenController::index
* @see app/Http/Controllers/API/AsistenController.php:24
* @route '/api-v1/asisten'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\API\AsistenController::index
* @see app/Http/Controllers/API/AsistenController.php:24
* @route '/api-v1/asisten'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\AsistenController::index
* @see app/Http/Controllers/API/AsistenController.php:24
* @route '/api-v1/asisten'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\AsistenController::index
* @see app/Http/Controllers/API/AsistenController.php:24
* @route '/api-v1/asisten'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\API\AsistenController::destroy
* @see app/Http/Controllers/API/AsistenController.php:236
* @route '/api-v1/asisten/delete'
*/
export const destroy = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: destroy.url(options),
    method: 'post',
})

destroy.definition = {
    methods: ["post"],
    url: '/api-v1/asisten/delete',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\API\AsistenController::destroy
* @see app/Http/Controllers/API/AsistenController.php:236
* @route '/api-v1/asisten/delete'
*/
destroy.url = (options?: RouteQueryOptions) => {
    return destroy.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\API\AsistenController::destroy
* @see app/Http/Controllers/API/AsistenController.php:236
* @route '/api-v1/asisten/delete'
*/
destroy.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: destroy.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\API\AsistenController::destroy
* @see app/Http/Controllers/API/AsistenController.php:236
* @route '/api-v1/asisten/delete'
*/
const destroyForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\API\AsistenController::destroy
* @see app/Http/Controllers/API/AsistenController.php:236
* @route '/api-v1/asisten/delete'
*/
destroyForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(options),
    method: 'post',
})

destroy.form = destroyForm

const AsistenController = { update, updatePp, destroyPp, updatePassword, index, destroy }

export default AsistenController