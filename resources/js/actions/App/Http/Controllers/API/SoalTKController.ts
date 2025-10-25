import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\API\SoalTKController::show
* @see app/Http/Controllers/API/SoalTKController.php:71
* @route '/api-v1/soal-tk/{idModul}'
*/
export const show = (args: { idModul: string | number } | [idModul: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api-v1/soal-tk/{idModul}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\API\SoalTKController::show
* @see app/Http/Controllers/API/SoalTKController.php:71
* @route '/api-v1/soal-tk/{idModul}'
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
* @see \App\Http\Controllers\API\SoalTKController::show
* @see app/Http/Controllers/API/SoalTKController.php:71
* @route '/api-v1/soal-tk/{idModul}'
*/
show.get = (args: { idModul: string | number } | [idModul: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\SoalTKController::show
* @see app/Http/Controllers/API/SoalTKController.php:71
* @route '/api-v1/soal-tk/{idModul}'
*/
show.head = (args: { idModul: string | number } | [idModul: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\API\SoalTKController::show
* @see app/Http/Controllers/API/SoalTKController.php:71
* @route '/api-v1/soal-tk/{idModul}'
*/
const showForm = (args: { idModul: string | number } | [idModul: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\SoalTKController::show
* @see app/Http/Controllers/API/SoalTKController.php:71
* @route '/api-v1/soal-tk/{idModul}'
*/
showForm.get = (args: { idModul: string | number } | [idModul: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\SoalTKController::show
* @see app/Http/Controllers/API/SoalTKController.php:71
* @route '/api-v1/soal-tk/{idModul}'
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

/**
* @see \App\Http\Controllers\API\SoalTKController::store
* @see app/Http/Controllers/API/SoalTKController.php:24
* @route '/api-v1/soal-tk/{idModul}'
*/
export const store = (args: { idModul: string | number } | [idModul: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api-v1/soal-tk/{idModul}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\API\SoalTKController::store
* @see app/Http/Controllers/API/SoalTKController.php:24
* @route '/api-v1/soal-tk/{idModul}'
*/
store.url = (args: { idModul: string | number } | [idModul: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return store.definition.url
            .replace('{idModul}', parsedArgs.idModul.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\API\SoalTKController::store
* @see app/Http/Controllers/API/SoalTKController.php:24
* @route '/api-v1/soal-tk/{idModul}'
*/
store.post = (args: { idModul: string | number } | [idModul: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\API\SoalTKController::store
* @see app/Http/Controllers/API/SoalTKController.php:24
* @route '/api-v1/soal-tk/{idModul}'
*/
const storeForm = (args: { idModul: string | number } | [idModul: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\API\SoalTKController::store
* @see app/Http/Controllers/API/SoalTKController.php:24
* @route '/api-v1/soal-tk/{idModul}'
*/
storeForm.post = (args: { idModul: string | number } | [idModul: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\API\SoalTKController::update
* @see app/Http/Controllers/API/SoalTKController.php:136
* @route '/api-v1/soal-tk/{idSoal}'
*/
export const update = (args: { idSoal: string | number } | [idSoal: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/api-v1/soal-tk/{idSoal}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\API\SoalTKController::update
* @see app/Http/Controllers/API/SoalTKController.php:136
* @route '/api-v1/soal-tk/{idSoal}'
*/
update.url = (args: { idSoal: string | number } | [idSoal: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { idSoal: args }
    }

    if (Array.isArray(args)) {
        args = {
            idSoal: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        idSoal: args.idSoal,
    }

    return update.definition.url
            .replace('{idSoal}', parsedArgs.idSoal.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\API\SoalTKController::update
* @see app/Http/Controllers/API/SoalTKController.php:136
* @route '/api-v1/soal-tk/{idSoal}'
*/
update.put = (args: { idSoal: string | number } | [idSoal: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\API\SoalTKController::update
* @see app/Http/Controllers/API/SoalTKController.php:136
* @route '/api-v1/soal-tk/{idSoal}'
*/
const updateForm = (args: { idSoal: string | number } | [idSoal: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\API\SoalTKController::update
* @see app/Http/Controllers/API/SoalTKController.php:136
* @route '/api-v1/soal-tk/{idSoal}'
*/
updateForm.put = (args: { idSoal: string | number } | [idSoal: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\API\SoalTKController::destroy
* @see app/Http/Controllers/API/SoalTKController.php:189
* @route '/api-v1/soal-tk/{idSoal}'
*/
export const destroy = (args: { idSoal: string | number } | [idSoal: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api-v1/soal-tk/{idSoal}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\API\SoalTKController::destroy
* @see app/Http/Controllers/API/SoalTKController.php:189
* @route '/api-v1/soal-tk/{idSoal}'
*/
destroy.url = (args: { idSoal: string | number } | [idSoal: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { idSoal: args }
    }

    if (Array.isArray(args)) {
        args = {
            idSoal: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        idSoal: args.idSoal,
    }

    return destroy.definition.url
            .replace('{idSoal}', parsedArgs.idSoal.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\API\SoalTKController::destroy
* @see app/Http/Controllers/API/SoalTKController.php:189
* @route '/api-v1/soal-tk/{idSoal}'
*/
destroy.delete = (args: { idSoal: string | number } | [idSoal: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\API\SoalTKController::destroy
* @see app/Http/Controllers/API/SoalTKController.php:189
* @route '/api-v1/soal-tk/{idSoal}'
*/
const destroyForm = (args: { idSoal: string | number } | [idSoal: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\API\SoalTKController::destroy
* @see app/Http/Controllers/API/SoalTKController.php:189
* @route '/api-v1/soal-tk/{idSoal}'
*/
destroyForm.delete = (args: { idSoal: string | number } | [idSoal: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const SoalTKController = { show, store, update, destroy }

export default SoalTKController