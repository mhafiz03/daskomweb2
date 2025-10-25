import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\API\JawabanFITBController::store
* @see app/Http/Controllers/API/JawabanFITBController.php:24
* @route '/api-v1/jawaban-fitb'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api-v1/jawaban-fitb',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\API\JawabanFITBController::store
* @see app/Http/Controllers/API/JawabanFITBController.php:24
* @route '/api-v1/jawaban-fitb'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\API\JawabanFITBController::store
* @see app/Http/Controllers/API/JawabanFITBController.php:24
* @route '/api-v1/jawaban-fitb'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\API\JawabanFITBController::store
* @see app/Http/Controllers/API/JawabanFITBController.php:24
* @route '/api-v1/jawaban-fitb'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\API\JawabanFITBController::store
* @see app/Http/Controllers/API/JawabanFITBController.php:24
* @route '/api-v1/jawaban-fitb'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\API\JawabanFITBController::show
* @see app/Http/Controllers/API/JawabanFITBController.php:55
* @route '/api-v1/jawaban-fitb/{idModul}'
*/
export const show = (args: { idModul: string | number } | [idModul: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api-v1/jawaban-fitb/{idModul}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\API\JawabanFITBController::show
* @see app/Http/Controllers/API/JawabanFITBController.php:55
* @route '/api-v1/jawaban-fitb/{idModul}'
*/
show.url = (args: { idModul: string | number } | [idModul: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { idModul: args }
    }

    if (Array.isArray(args)) {
        args = {
            idModul: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        idModul: args.idModul,
    }

    return show.definition.url
            .replace('{idModul}', parsedArgs.idModul.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\API\JawabanFITBController::show
* @see app/Http/Controllers/API/JawabanFITBController.php:55
* @route '/api-v1/jawaban-fitb/{idModul}'
*/
show.get = (args: { idModul: string | number } | [idModul: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\JawabanFITBController::show
* @see app/Http/Controllers/API/JawabanFITBController.php:55
* @route '/api-v1/jawaban-fitb/{idModul}'
*/
show.head = (args: { idModul: string | number } | [idModul: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\API\JawabanFITBController::show
* @see app/Http/Controllers/API/JawabanFITBController.php:55
* @route '/api-v1/jawaban-fitb/{idModul}'
*/
const showForm = (args: { idModul: string | number } | [idModul: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\JawabanFITBController::show
* @see app/Http/Controllers/API/JawabanFITBController.php:55
* @route '/api-v1/jawaban-fitb/{idModul}'
*/
showForm.get = (args: { idModul: string | number } | [idModul: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\JawabanFITBController::show
* @see app/Http/Controllers/API/JawabanFITBController.php:55
* @route '/api-v1/jawaban-fitb/{idModul}'
*/
showForm.head = (args: { idModul: string | number } | [idModul: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

const JawabanFITBController = { store, show }

export default JawabanFITBController