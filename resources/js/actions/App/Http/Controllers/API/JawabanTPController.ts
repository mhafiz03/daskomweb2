import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\API\JawabanTPController::getJawabanTP
* @see app/Http/Controllers/API/JawabanTPController.php:149
* @route '/api-v1/jawaban-tp/{nim}/{modulId}'
*/
export const getJawabanTP = (args: { nim: string | number, modulId: string | number } | [nim: string | number, modulId: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getJawabanTP.url(args, options),
    method: 'get',
})

getJawabanTP.definition = {
    methods: ["get","head"],
    url: '/api-v1/jawaban-tp/{nim}/{modulId}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\API\JawabanTPController::getJawabanTP
* @see app/Http/Controllers/API/JawabanTPController.php:149
* @route '/api-v1/jawaban-tp/{nim}/{modulId}'
*/
getJawabanTP.url = (args: { nim: string | number, modulId: string | number } | [nim: string | number, modulId: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            nim: args[0],
            modulId: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        nim: args.nim,
        modulId: args.modulId,
    }

    return getJawabanTP.definition.url
            .replace('{nim}', parsedArgs.nim.toString())
            .replace('{modulId}', parsedArgs.modulId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\API\JawabanTPController::getJawabanTP
* @see app/Http/Controllers/API/JawabanTPController.php:149
* @route '/api-v1/jawaban-tp/{nim}/{modulId}'
*/
getJawabanTP.get = (args: { nim: string | number, modulId: string | number } | [nim: string | number, modulId: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getJawabanTP.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\JawabanTPController::getJawabanTP
* @see app/Http/Controllers/API/JawabanTPController.php:149
* @route '/api-v1/jawaban-tp/{nim}/{modulId}'
*/
getJawabanTP.head = (args: { nim: string | number, modulId: string | number } | [nim: string | number, modulId: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getJawabanTP.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\API\JawabanTPController::getJawabanTP
* @see app/Http/Controllers/API/JawabanTPController.php:149
* @route '/api-v1/jawaban-tp/{nim}/{modulId}'
*/
const getJawabanTPForm = (args: { nim: string | number, modulId: string | number } | [nim: string | number, modulId: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getJawabanTP.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\JawabanTPController::getJawabanTP
* @see app/Http/Controllers/API/JawabanTPController.php:149
* @route '/api-v1/jawaban-tp/{nim}/{modulId}'
*/
getJawabanTPForm.get = (args: { nim: string | number, modulId: string | number } | [nim: string | number, modulId: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getJawabanTP.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\JawabanTPController::getJawabanTP
* @see app/Http/Controllers/API/JawabanTPController.php:149
* @route '/api-v1/jawaban-tp/{nim}/{modulId}'
*/
getJawabanTPForm.head = (args: { nim: string | number, modulId: string | number } | [nim: string | number, modulId: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getJawabanTP.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

getJawabanTP.form = getJawabanTPForm

/**
* @see \App\Http\Controllers\API\JawabanTPController::store
* @see app/Http/Controllers/API/JawabanTPController.php:29
* @route '/api-v1/jawaban-tp'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api-v1/jawaban-tp',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\API\JawabanTPController::store
* @see app/Http/Controllers/API/JawabanTPController.php:29
* @route '/api-v1/jawaban-tp'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\API\JawabanTPController::store
* @see app/Http/Controllers/API/JawabanTPController.php:29
* @route '/api-v1/jawaban-tp'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\API\JawabanTPController::store
* @see app/Http/Controllers/API/JawabanTPController.php:29
* @route '/api-v1/jawaban-tp'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\API\JawabanTPController::store
* @see app/Http/Controllers/API/JawabanTPController.php:29
* @route '/api-v1/jawaban-tp'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\API\JawabanTPController::show
* @see app/Http/Controllers/API/JawabanTPController.php:122
* @route '/api-v1/jawaban-tp/{idModul}'
*/
export const show = (args: { idModul: string | number } | [idModul: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api-v1/jawaban-tp/{idModul}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\API\JawabanTPController::show
* @see app/Http/Controllers/API/JawabanTPController.php:122
* @route '/api-v1/jawaban-tp/{idModul}'
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
* @see \App\Http\Controllers\API\JawabanTPController::show
* @see app/Http/Controllers/API/JawabanTPController.php:122
* @route '/api-v1/jawaban-tp/{idModul}'
*/
show.get = (args: { idModul: string | number } | [idModul: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\JawabanTPController::show
* @see app/Http/Controllers/API/JawabanTPController.php:122
* @route '/api-v1/jawaban-tp/{idModul}'
*/
show.head = (args: { idModul: string | number } | [idModul: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\API\JawabanTPController::show
* @see app/Http/Controllers/API/JawabanTPController.php:122
* @route '/api-v1/jawaban-tp/{idModul}'
*/
const showForm = (args: { idModul: string | number } | [idModul: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\JawabanTPController::show
* @see app/Http/Controllers/API/JawabanTPController.php:122
* @route '/api-v1/jawaban-tp/{idModul}'
*/
showForm.get = (args: { idModul: string | number } | [idModul: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\JawabanTPController::show
* @see app/Http/Controllers/API/JawabanTPController.php:122
* @route '/api-v1/jawaban-tp/{idModul}'
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

const JawabanTPController = { getJawabanTP, store, show }

export default JawabanTPController