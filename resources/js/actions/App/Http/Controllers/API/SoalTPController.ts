import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\API\SoalTPController::show
* @see app/Http/Controllers/API/SoalTPController.php:48
* @route '/api-v1/soal-tp/{idModul}'
*/
export const show = (args: { idModul: string | number } | [idModul: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api-v1/soal-tp/{idModul}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\API\SoalTPController::show
* @see app/Http/Controllers/API/SoalTPController.php:48
* @route '/api-v1/soal-tp/{idModul}'
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
* @see \App\Http\Controllers\API\SoalTPController::show
* @see app/Http/Controllers/API/SoalTPController.php:48
* @route '/api-v1/soal-tp/{idModul}'
*/
show.get = (args: { idModul: string | number } | [idModul: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\SoalTPController::show
* @see app/Http/Controllers/API/SoalTPController.php:48
* @route '/api-v1/soal-tp/{idModul}'
*/
show.head = (args: { idModul: string | number } | [idModul: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\API\SoalTPController::show
* @see app/Http/Controllers/API/SoalTPController.php:48
* @route '/api-v1/soal-tp/{idModul}'
*/
const showForm = (args: { idModul: string | number } | [idModul: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\SoalTPController::show
* @see app/Http/Controllers/API/SoalTPController.php:48
* @route '/api-v1/soal-tp/{idModul}'
*/
showForm.get = (args: { idModul: string | number } | [idModul: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\SoalTPController::show
* @see app/Http/Controllers/API/SoalTPController.php:48
* @route '/api-v1/soal-tp/{idModul}'
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
* @see \App\Http\Controllers\API\SoalTPController::store
* @see app/Http/Controllers/API/SoalTPController.php:22
* @route '/api-v1/soal-tp/{idModul}'
*/
export const store = (args: { idModul: string | number } | [idModul: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api-v1/soal-tp/{idModul}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\API\SoalTPController::store
* @see app/Http/Controllers/API/SoalTPController.php:22
* @route '/api-v1/soal-tp/{idModul}'
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
* @see \App\Http\Controllers\API\SoalTPController::store
* @see app/Http/Controllers/API/SoalTPController.php:22
* @route '/api-v1/soal-tp/{idModul}'
*/
store.post = (args: { idModul: string | number } | [idModul: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\API\SoalTPController::store
* @see app/Http/Controllers/API/SoalTPController.php:22
* @route '/api-v1/soal-tp/{idModul}'
*/
const storeForm = (args: { idModul: string | number } | [idModul: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\API\SoalTPController::store
* @see app/Http/Controllers/API/SoalTPController.php:22
* @route '/api-v1/soal-tp/{idModul}'
*/
storeForm.post = (args: { idModul: string | number } | [idModul: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\API\SoalTPController::update
* @see app/Http/Controllers/API/SoalTPController.php:70
* @route '/api-v1/soal-tp/{idSoal}'
*/
export const update = (args: { idSoal: string | number } | [idSoal: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/api-v1/soal-tp/{idSoal}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\API\SoalTPController::update
* @see app/Http/Controllers/API/SoalTPController.php:70
* @route '/api-v1/soal-tp/{idSoal}'
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
* @see \App\Http\Controllers\API\SoalTPController::update
* @see app/Http/Controllers/API/SoalTPController.php:70
* @route '/api-v1/soal-tp/{idSoal}'
*/
update.put = (args: { idSoal: string | number } | [idSoal: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\API\SoalTPController::update
* @see app/Http/Controllers/API/SoalTPController.php:70
* @route '/api-v1/soal-tp/{idSoal}'
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
* @see \App\Http\Controllers\API\SoalTPController::update
* @see app/Http/Controllers/API/SoalTPController.php:70
* @route '/api-v1/soal-tp/{idSoal}'
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
* @see \App\Http\Controllers\API\SoalTPController::destroy
* @see app/Http/Controllers/API/SoalTPController.php:114
* @route '/api-v1/soal-tp/{idSoal}'
*/
export const destroy = (args: { idSoal: string | number } | [idSoal: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api-v1/soal-tp/{idSoal}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\API\SoalTPController::destroy
* @see app/Http/Controllers/API/SoalTPController.php:114
* @route '/api-v1/soal-tp/{idSoal}'
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
* @see \App\Http\Controllers\API\SoalTPController::destroy
* @see app/Http/Controllers/API/SoalTPController.php:114
* @route '/api-v1/soal-tp/{idSoal}'
*/
destroy.delete = (args: { idSoal: string | number } | [idSoal: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\API\SoalTPController::destroy
* @see app/Http/Controllers/API/SoalTPController.php:114
* @route '/api-v1/soal-tp/{idSoal}'
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
* @see \App\Http\Controllers\API\SoalTPController::destroy
* @see app/Http/Controllers/API/SoalTPController.php:114
* @route '/api-v1/soal-tp/{idSoal}'
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

const SoalTPController = { show, store, update, destroy }

export default SoalTPController