import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\API\KelasController::index
* @see app/Http/Controllers/API/KelasController.php:19
* @route '/api-v1/kelas'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api-v1/kelas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\API\KelasController::index
* @see app/Http/Controllers/API/KelasController.php:19
* @route '/api-v1/kelas'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\API\KelasController::index
* @see app/Http/Controllers/API/KelasController.php:19
* @route '/api-v1/kelas'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\KelasController::index
* @see app/Http/Controllers/API/KelasController.php:19
* @route '/api-v1/kelas'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\API\KelasController::index
* @see app/Http/Controllers/API/KelasController.php:19
* @route '/api-v1/kelas'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\KelasController::index
* @see app/Http/Controllers/API/KelasController.php:19
* @route '/api-v1/kelas'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\KelasController::index
* @see app/Http/Controllers/API/KelasController.php:19
* @route '/api-v1/kelas'
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
* @see \App\Http\Controllers\API\KelasController::store
* @see app/Http/Controllers/API/KelasController.php:33
* @route '/api-v1/kelas'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api-v1/kelas',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\API\KelasController::store
* @see app/Http/Controllers/API/KelasController.php:33
* @route '/api-v1/kelas'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\API\KelasController::store
* @see app/Http/Controllers/API/KelasController.php:33
* @route '/api-v1/kelas'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\API\KelasController::store
* @see app/Http/Controllers/API/KelasController.php:33
* @route '/api-v1/kelas'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\API\KelasController::store
* @see app/Http/Controllers/API/KelasController.php:33
* @route '/api-v1/kelas'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\API\KelasController::update
* @see app/Http/Controllers/API/KelasController.php:147
* @route '/api-v1/kelas/{id}'
*/
export const update = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/api-v1/kelas/{id}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\API\KelasController::update
* @see app/Http/Controllers/API/KelasController.php:147
* @route '/api-v1/kelas/{id}'
*/
update.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    if (Array.isArray(args)) {
        args = {
            id: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        id: args.id,
    }

    return update.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\API\KelasController::update
* @see app/Http/Controllers/API/KelasController.php:147
* @route '/api-v1/kelas/{id}'
*/
update.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\API\KelasController::update
* @see app/Http/Controllers/API/KelasController.php:147
* @route '/api-v1/kelas/{id}'
*/
const updateForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\API\KelasController::update
* @see app/Http/Controllers/API/KelasController.php:147
* @route '/api-v1/kelas/{id}'
*/
updateForm.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\API\KelasController::destroy
* @see app/Http/Controllers/API/KelasController.php:217
* @route '/api-v1/kelas/{id}'
*/
export const destroy = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api-v1/kelas/{id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\API\KelasController::destroy
* @see app/Http/Controllers/API/KelasController.php:217
* @route '/api-v1/kelas/{id}'
*/
destroy.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    if (Array.isArray(args)) {
        args = {
            id: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        id: args.id,
    }

    return destroy.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\API\KelasController::destroy
* @see app/Http/Controllers/API/KelasController.php:217
* @route '/api-v1/kelas/{id}'
*/
destroy.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\API\KelasController::destroy
* @see app/Http/Controllers/API/KelasController.php:217
* @route '/api-v1/kelas/{id}'
*/
const destroyForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\API\KelasController::destroy
* @see app/Http/Controllers/API/KelasController.php:217
* @route '/api-v1/kelas/{id}'
*/
destroyForm.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

/**
* @see \App\Http\Controllers\API\KelasController::reset
* @see app/Http/Controllers/API/KelasController.php:240
* @route '/api-v1/kelas/reset'
*/
export const reset = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reset.url(options),
    method: 'post',
})

reset.definition = {
    methods: ["post"],
    url: '/api-v1/kelas/reset',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\API\KelasController::reset
* @see app/Http/Controllers/API/KelasController.php:240
* @route '/api-v1/kelas/reset'
*/
reset.url = (options?: RouteQueryOptions) => {
    return reset.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\API\KelasController::reset
* @see app/Http/Controllers/API/KelasController.php:240
* @route '/api-v1/kelas/reset'
*/
reset.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reset.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\API\KelasController::reset
* @see app/Http/Controllers/API/KelasController.php:240
* @route '/api-v1/kelas/reset'
*/
const resetForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reset.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\API\KelasController::reset
* @see app/Http/Controllers/API/KelasController.php:240
* @route '/api-v1/kelas/reset'
*/
resetForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reset.url(options),
    method: 'post',
})

reset.form = resetForm

const KelasController = { index, store, update, destroy, reset }

export default KelasController