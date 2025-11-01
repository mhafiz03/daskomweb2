import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\API\JawabanTMController::showAsisten
* @see app/Http/Controllers/API/JawabanTMController.php:143
* @route '/api-v1/jawaban-mandiri/praktikan/{praktikan}/modul/{modul}'
*/
export const showAsisten = (args: { praktikan: string | number, modul: string | number } | [praktikan: string | number, modul: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showAsisten.url(args, options),
    method: 'get',
})

showAsisten.definition = {
    methods: ["get","head"],
    url: '/api-v1/jawaban-mandiri/praktikan/{praktikan}/modul/{modul}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\API\JawabanTMController::showAsisten
* @see app/Http/Controllers/API/JawabanTMController.php:143
* @route '/api-v1/jawaban-mandiri/praktikan/{praktikan}/modul/{modul}'
*/
showAsisten.url = (args: { praktikan: string | number, modul: string | number } | [praktikan: string | number, modul: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            praktikan: args[0],
            modul: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        praktikan: args.praktikan,
        modul: args.modul,
    }

    return showAsisten.definition.url
            .replace('{praktikan}', parsedArgs.praktikan.toString())
            .replace('{modul}', parsedArgs.modul.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\API\JawabanTMController::showAsisten
* @see app/Http/Controllers/API/JawabanTMController.php:143
* @route '/api-v1/jawaban-mandiri/praktikan/{praktikan}/modul/{modul}'
*/
showAsisten.get = (args: { praktikan: string | number, modul: string | number } | [praktikan: string | number, modul: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showAsisten.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\JawabanTMController::showAsisten
* @see app/Http/Controllers/API/JawabanTMController.php:143
* @route '/api-v1/jawaban-mandiri/praktikan/{praktikan}/modul/{modul}'
*/
showAsisten.head = (args: { praktikan: string | number, modul: string | number } | [praktikan: string | number, modul: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showAsisten.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\API\JawabanTMController::showAsisten
* @see app/Http/Controllers/API/JawabanTMController.php:143
* @route '/api-v1/jawaban-mandiri/praktikan/{praktikan}/modul/{modul}'
*/
const showAsistenForm = (args: { praktikan: string | number, modul: string | number } | [praktikan: string | number, modul: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showAsisten.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\JawabanTMController::showAsisten
* @see app/Http/Controllers/API/JawabanTMController.php:143
* @route '/api-v1/jawaban-mandiri/praktikan/{praktikan}/modul/{modul}'
*/
showAsistenForm.get = (args: { praktikan: string | number, modul: string | number } | [praktikan: string | number, modul: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showAsisten.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\JawabanTMController::showAsisten
* @see app/Http/Controllers/API/JawabanTMController.php:143
* @route '/api-v1/jawaban-mandiri/praktikan/{praktikan}/modul/{modul}'
*/
showAsistenForm.head = (args: { praktikan: string | number, modul: string | number } | [praktikan: string | number, modul: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showAsisten.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

showAsisten.form = showAsistenForm

/**
* @see \App\Http\Controllers\API\JawabanTMController::store
* @see app/Http/Controllers/API/JawabanTMController.php:26
* @route '/api-v1/jawaban-tm'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api-v1/jawaban-tm',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\API\JawabanTMController::store
* @see app/Http/Controllers/API/JawabanTMController.php:26
* @route '/api-v1/jawaban-tm'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\API\JawabanTMController::store
* @see app/Http/Controllers/API/JawabanTMController.php:26
* @route '/api-v1/jawaban-tm'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\API\JawabanTMController::store
* @see app/Http/Controllers/API/JawabanTMController.php:26
* @route '/api-v1/jawaban-tm'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\API\JawabanTMController::store
* @see app/Http/Controllers/API/JawabanTMController.php:26
* @route '/api-v1/jawaban-tm'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\API\JawabanTMController::show
* @see app/Http/Controllers/API/JawabanTMController.php:117
* @route '/api-v1/jawaban-tm/{idModul}'
*/
export const show = (args: { idModul: string | number } | [idModul: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api-v1/jawaban-tm/{idModul}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\API\JawabanTMController::show
* @see app/Http/Controllers/API/JawabanTMController.php:117
* @route '/api-v1/jawaban-tm/{idModul}'
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
* @see \App\Http\Controllers\API\JawabanTMController::show
* @see app/Http/Controllers/API/JawabanTMController.php:117
* @route '/api-v1/jawaban-tm/{idModul}'
*/
show.get = (args: { idModul: string | number } | [idModul: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\JawabanTMController::show
* @see app/Http/Controllers/API/JawabanTMController.php:117
* @route '/api-v1/jawaban-tm/{idModul}'
*/
show.head = (args: { idModul: string | number } | [idModul: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\API\JawabanTMController::show
* @see app/Http/Controllers/API/JawabanTMController.php:117
* @route '/api-v1/jawaban-tm/{idModul}'
*/
const showForm = (args: { idModul: string | number } | [idModul: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\JawabanTMController::show
* @see app/Http/Controllers/API/JawabanTMController.php:117
* @route '/api-v1/jawaban-tm/{idModul}'
*/
showForm.get = (args: { idModul: string | number } | [idModul: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\JawabanTMController::show
* @see app/Http/Controllers/API/JawabanTMController.php:117
* @route '/api-v1/jawaban-tm/{idModul}'
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

const JawabanTMController = { showAsisten, store, show }

export default JawabanTMController