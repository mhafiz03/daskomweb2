import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\API\PelanggaranController::index
* @see app/Http/Controllers/API/PelanggaranController.php:16
* @route '/api-v1/pelanggaran'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api-v1/pelanggaran',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\API\PelanggaranController::index
* @see app/Http/Controllers/API/PelanggaranController.php:16
* @route '/api-v1/pelanggaran'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\API\PelanggaranController::index
* @see app/Http/Controllers/API/PelanggaranController.php:16
* @route '/api-v1/pelanggaran'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\PelanggaranController::index
* @see app/Http/Controllers/API/PelanggaranController.php:16
* @route '/api-v1/pelanggaran'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\API\PelanggaranController::index
* @see app/Http/Controllers/API/PelanggaranController.php:16
* @route '/api-v1/pelanggaran'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\PelanggaranController::index
* @see app/Http/Controllers/API/PelanggaranController.php:16
* @route '/api-v1/pelanggaran'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\PelanggaranController::index
* @see app/Http/Controllers/API/PelanggaranController.php:16
* @route '/api-v1/pelanggaran'
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
* @see \App\Http\Controllers\API\PelanggaranController::store
* @see app/Http/Controllers/API/PelanggaranController.php:41
* @route '/api-v1/pelanggaran'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api-v1/pelanggaran',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\API\PelanggaranController::store
* @see app/Http/Controllers/API/PelanggaranController.php:41
* @route '/api-v1/pelanggaran'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\API\PelanggaranController::store
* @see app/Http/Controllers/API/PelanggaranController.php:41
* @route '/api-v1/pelanggaran'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\API\PelanggaranController::store
* @see app/Http/Controllers/API/PelanggaranController.php:41
* @route '/api-v1/pelanggaran'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\API\PelanggaranController::store
* @see app/Http/Controllers/API/PelanggaranController.php:41
* @route '/api-v1/pelanggaran'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\API\PelanggaranController::destroy
* @see app/Http/Controllers/API/PelanggaranController.php:87
* @route '/api-v1/pelanggaran/{id}'
*/
export const destroy = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api-v1/pelanggaran/{id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\API\PelanggaranController::destroy
* @see app/Http/Controllers/API/PelanggaranController.php:87
* @route '/api-v1/pelanggaran/{id}'
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
* @see \App\Http\Controllers\API\PelanggaranController::destroy
* @see app/Http/Controllers/API/PelanggaranController.php:87
* @route '/api-v1/pelanggaran/{id}'
*/
destroy.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\API\PelanggaranController::destroy
* @see app/Http/Controllers/API/PelanggaranController.php:87
* @route '/api-v1/pelanggaran/{id}'
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
* @see \App\Http\Controllers\API\PelanggaranController::destroy
* @see app/Http/Controllers/API/PelanggaranController.php:87
* @route '/api-v1/pelanggaran/{id}'
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
* @see \App\Http\Controllers\API\PelanggaranController::reset
* @see app/Http/Controllers/API/PelanggaranController.php:109
* @route '/api-v1/pelanggaran/reset'
*/
export const reset = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reset.url(options),
    method: 'post',
})

reset.definition = {
    methods: ["post"],
    url: '/api-v1/pelanggaran/reset',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\API\PelanggaranController::reset
* @see app/Http/Controllers/API/PelanggaranController.php:109
* @route '/api-v1/pelanggaran/reset'
*/
reset.url = (options?: RouteQueryOptions) => {
    return reset.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\API\PelanggaranController::reset
* @see app/Http/Controllers/API/PelanggaranController.php:109
* @route '/api-v1/pelanggaran/reset'
*/
reset.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reset.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\API\PelanggaranController::reset
* @see app/Http/Controllers/API/PelanggaranController.php:109
* @route '/api-v1/pelanggaran/reset'
*/
const resetForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reset.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\API\PelanggaranController::reset
* @see app/Http/Controllers/API/PelanggaranController.php:109
* @route '/api-v1/pelanggaran/reset'
*/
resetForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reset.url(options),
    method: 'post',
})

reset.form = resetForm

const PelanggaranController = { index, store, destroy, reset }

export default PelanggaranController