import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\API\LaporanPjController::index
* @see app/Http/Controllers/API/LaporanPjController.php:16
* @route '/api-v1/laporan-pj'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api-v1/laporan-pj',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\API\LaporanPjController::index
* @see app/Http/Controllers/API/LaporanPjController.php:16
* @route '/api-v1/laporan-pj'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\API\LaporanPjController::index
* @see app/Http/Controllers/API/LaporanPjController.php:16
* @route '/api-v1/laporan-pj'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\LaporanPjController::index
* @see app/Http/Controllers/API/LaporanPjController.php:16
* @route '/api-v1/laporan-pj'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\API\LaporanPjController::index
* @see app/Http/Controllers/API/LaporanPjController.php:16
* @route '/api-v1/laporan-pj'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\LaporanPjController::index
* @see app/Http/Controllers/API/LaporanPjController.php:16
* @route '/api-v1/laporan-pj'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\LaporanPjController::index
* @see app/Http/Controllers/API/LaporanPjController.php:16
* @route '/api-v1/laporan-pj'
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
* @see \App\Http\Controllers\API\LaporanPjController::store
* @see app/Http/Controllers/API/LaporanPjController.php:55
* @route '/api-v1/laporan-pj/{idKelas}'
*/
export const store = (args: { idKelas: string | number } | [idKelas: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api-v1/laporan-pj/{idKelas}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\API\LaporanPjController::store
* @see app/Http/Controllers/API/LaporanPjController.php:55
* @route '/api-v1/laporan-pj/{idKelas}'
*/
store.url = (args: { idKelas: string | number } | [idKelas: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { idKelas: args }
    }

    if (Array.isArray(args)) {
        args = {
            idKelas: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        idKelas: args.idKelas,
    }

    return store.definition.url
            .replace('{idKelas}', parsedArgs.idKelas.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\API\LaporanPjController::store
* @see app/Http/Controllers/API/LaporanPjController.php:55
* @route '/api-v1/laporan-pj/{idKelas}'
*/
store.post = (args: { idKelas: string | number } | [idKelas: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\API\LaporanPjController::store
* @see app/Http/Controllers/API/LaporanPjController.php:55
* @route '/api-v1/laporan-pj/{idKelas}'
*/
const storeForm = (args: { idKelas: string | number } | [idKelas: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\API\LaporanPjController::store
* @see app/Http/Controllers/API/LaporanPjController.php:55
* @route '/api-v1/laporan-pj/{idKelas}'
*/
storeForm.post = (args: { idKelas: string | number } | [idKelas: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\API\LaporanPjController::show
* @see app/Http/Controllers/API/LaporanPjController.php:35
* @route '/api-v1/laporan-pj/{id}'
*/
export const show = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api-v1/laporan-pj/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\API\LaporanPjController::show
* @see app/Http/Controllers/API/LaporanPjController.php:35
* @route '/api-v1/laporan-pj/{id}'
*/
show.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\API\LaporanPjController::show
* @see app/Http/Controllers/API/LaporanPjController.php:35
* @route '/api-v1/laporan-pj/{id}'
*/
show.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\LaporanPjController::show
* @see app/Http/Controllers/API/LaporanPjController.php:35
* @route '/api-v1/laporan-pj/{id}'
*/
show.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\API\LaporanPjController::show
* @see app/Http/Controllers/API/LaporanPjController.php:35
* @route '/api-v1/laporan-pj/{id}'
*/
const showForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\LaporanPjController::show
* @see app/Http/Controllers/API/LaporanPjController.php:35
* @route '/api-v1/laporan-pj/{id}'
*/
showForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\LaporanPjController::show
* @see app/Http/Controllers/API/LaporanPjController.php:35
* @route '/api-v1/laporan-pj/{id}'
*/
showForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

const LaporanPjController = { index, store, show }

export default LaporanPjController