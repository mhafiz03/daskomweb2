import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\API\SoalCommentController::showByModul
* @see app/Http/Controllers/API/SoalCommentController.php:14
* @route '/api-v1/asisten/soal-comment/{tipeSoal}/{modul}'
*/
export const showByModul = (args: { tipeSoal: string | number, modul: string | number } | [tipeSoal: string | number, modul: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showByModul.url(args, options),
    method: 'get',
})

showByModul.definition = {
    methods: ["get","head"],
    url: '/api-v1/asisten/soal-comment/{tipeSoal}/{modul}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\API\SoalCommentController::showByModul
* @see app/Http/Controllers/API/SoalCommentController.php:14
* @route '/api-v1/asisten/soal-comment/{tipeSoal}/{modul}'
*/
showByModul.url = (args: { tipeSoal: string | number, modul: string | number } | [tipeSoal: string | number, modul: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            tipeSoal: args[0],
            modul: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        tipeSoal: args.tipeSoal,
        modul: args.modul,
    }

    return showByModul.definition.url
            .replace('{tipeSoal}', parsedArgs.tipeSoal.toString())
            .replace('{modul}', parsedArgs.modul.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\API\SoalCommentController::showByModul
* @see app/Http/Controllers/API/SoalCommentController.php:14
* @route '/api-v1/asisten/soal-comment/{tipeSoal}/{modul}'
*/
showByModul.get = (args: { tipeSoal: string | number, modul: string | number } | [tipeSoal: string | number, modul: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showByModul.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\SoalCommentController::showByModul
* @see app/Http/Controllers/API/SoalCommentController.php:14
* @route '/api-v1/asisten/soal-comment/{tipeSoal}/{modul}'
*/
showByModul.head = (args: { tipeSoal: string | number, modul: string | number } | [tipeSoal: string | number, modul: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showByModul.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\API\SoalCommentController::showByModul
* @see app/Http/Controllers/API/SoalCommentController.php:14
* @route '/api-v1/asisten/soal-comment/{tipeSoal}/{modul}'
*/
const showByModulForm = (args: { tipeSoal: string | number, modul: string | number } | [tipeSoal: string | number, modul: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showByModul.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\SoalCommentController::showByModul
* @see app/Http/Controllers/API/SoalCommentController.php:14
* @route '/api-v1/asisten/soal-comment/{tipeSoal}/{modul}'
*/
showByModulForm.get = (args: { tipeSoal: string | number, modul: string | number } | [tipeSoal: string | number, modul: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showByModul.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\SoalCommentController::showByModul
* @see app/Http/Controllers/API/SoalCommentController.php:14
* @route '/api-v1/asisten/soal-comment/{tipeSoal}/{modul}'
*/
showByModulForm.head = (args: { tipeSoal: string | number, modul: string | number } | [tipeSoal: string | number, modul: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showByModul.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

showByModul.form = showByModulForm

/**
* @see \App\Http\Controllers\API\SoalCommentController::store
* @see app/Http/Controllers/API/SoalCommentController.php:52
* @route '/api-v1/praktikan/soal-comment/{praktikan}/{tipeSoal}/{soal}'
*/
export const store = (args: { praktikan: string | number, tipeSoal: string | number, soal: string | number } | [praktikan: string | number, tipeSoal: string | number, soal: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api-v1/praktikan/soal-comment/{praktikan}/{tipeSoal}/{soal}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\API\SoalCommentController::store
* @see app/Http/Controllers/API/SoalCommentController.php:52
* @route '/api-v1/praktikan/soal-comment/{praktikan}/{tipeSoal}/{soal}'
*/
store.url = (args: { praktikan: string | number, tipeSoal: string | number, soal: string | number } | [praktikan: string | number, tipeSoal: string | number, soal: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            praktikan: args[0],
            tipeSoal: args[1],
            soal: args[2],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        praktikan: args.praktikan,
        tipeSoal: args.tipeSoal,
        soal: args.soal,
    }

    return store.definition.url
            .replace('{praktikan}', parsedArgs.praktikan.toString())
            .replace('{tipeSoal}', parsedArgs.tipeSoal.toString())
            .replace('{soal}', parsedArgs.soal.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\API\SoalCommentController::store
* @see app/Http/Controllers/API/SoalCommentController.php:52
* @route '/api-v1/praktikan/soal-comment/{praktikan}/{tipeSoal}/{soal}'
*/
store.post = (args: { praktikan: string | number, tipeSoal: string | number, soal: string | number } | [praktikan: string | number, tipeSoal: string | number, soal: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\API\SoalCommentController::store
* @see app/Http/Controllers/API/SoalCommentController.php:52
* @route '/api-v1/praktikan/soal-comment/{praktikan}/{tipeSoal}/{soal}'
*/
const storeForm = (args: { praktikan: string | number, tipeSoal: string | number, soal: string | number } | [praktikan: string | number, tipeSoal: string | number, soal: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\API\SoalCommentController::store
* @see app/Http/Controllers/API/SoalCommentController.php:52
* @route '/api-v1/praktikan/soal-comment/{praktikan}/{tipeSoal}/{soal}'
*/
storeForm.post = (args: { praktikan: string | number, tipeSoal: string | number, soal: string | number } | [praktikan: string | number, tipeSoal: string | number, soal: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

const SoalCommentController = { showByModul, store }

export default SoalCommentController