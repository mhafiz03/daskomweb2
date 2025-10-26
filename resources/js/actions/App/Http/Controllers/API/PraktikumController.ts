import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\API\PraktikumController::index
* @see app/Http/Controllers/API/PraktikumController.php:17
* @route '/api-v1/praktikum'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api-v1/praktikum',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\API\PraktikumController::index
* @see app/Http/Controllers/API/PraktikumController.php:17
* @route '/api-v1/praktikum'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\API\PraktikumController::index
* @see app/Http/Controllers/API/PraktikumController.php:17
* @route '/api-v1/praktikum'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\PraktikumController::index
* @see app/Http/Controllers/API/PraktikumController.php:17
* @route '/api-v1/praktikum'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\API\PraktikumController::index
* @see app/Http/Controllers/API/PraktikumController.php:17
* @route '/api-v1/praktikum'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\PraktikumController::index
* @see app/Http/Controllers/API/PraktikumController.php:17
* @route '/api-v1/praktikum'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\PraktikumController::index
* @see app/Http/Controllers/API/PraktikumController.php:17
* @route '/api-v1/praktikum'
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
* @see \App\Http\Controllers\API\PraktikumController::store
* @see app/Http/Controllers/API/PraktikumController.php:64
* @route '/api-v1/praktikum'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api-v1/praktikum',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\API\PraktikumController::store
* @see app/Http/Controllers/API/PraktikumController.php:64
* @route '/api-v1/praktikum'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\API\PraktikumController::store
* @see app/Http/Controllers/API/PraktikumController.php:64
* @route '/api-v1/praktikum'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\API\PraktikumController::store
* @see app/Http/Controllers/API/PraktikumController.php:64
* @route '/api-v1/praktikum'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\API\PraktikumController::store
* @see app/Http/Controllers/API/PraktikumController.php:64
* @route '/api-v1/praktikum'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\API\PraktikumController::history
* @see app/Http/Controllers/API/PraktikumController.php:272
* @route '/api-v1/praktikum/history'
*/
export const history = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: history.url(options),
    method: 'get',
})

history.definition = {
    methods: ["get","head"],
    url: '/api-v1/praktikum/history',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\API\PraktikumController::history
* @see app/Http/Controllers/API/PraktikumController.php:272
* @route '/api-v1/praktikum/history'
*/
history.url = (options?: RouteQueryOptions) => {
    return history.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\API\PraktikumController::history
* @see app/Http/Controllers/API/PraktikumController.php:272
* @route '/api-v1/praktikum/history'
*/
history.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: history.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\PraktikumController::history
* @see app/Http/Controllers/API/PraktikumController.php:272
* @route '/api-v1/praktikum/history'
*/
history.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: history.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\API\PraktikumController::history
* @see app/Http/Controllers/API/PraktikumController.php:272
* @route '/api-v1/praktikum/history'
*/
const historyForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: history.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\PraktikumController::history
* @see app/Http/Controllers/API/PraktikumController.php:272
* @route '/api-v1/praktikum/history'
*/
historyForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: history.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\PraktikumController::history
* @see app/Http/Controllers/API/PraktikumController.php:272
* @route '/api-v1/praktikum/history'
*/
historyForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: history.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

history.form = historyForm

/**
* @see \App\Http\Controllers\API\PraktikumController::show
* @see app/Http/Controllers/API/PraktikumController.php:42
* @route '/api-v1/praktikum/{idKelas}'
*/
export const show = (args: { idKelas: string | number } | [idKelas: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api-v1/praktikum/{idKelas}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\API\PraktikumController::show
* @see app/Http/Controllers/API/PraktikumController.php:42
* @route '/api-v1/praktikum/{idKelas}'
*/
show.url = (args: { idKelas: string | number } | [idKelas: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{idKelas}', parsedArgs.idKelas.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\API\PraktikumController::show
* @see app/Http/Controllers/API/PraktikumController.php:42
* @route '/api-v1/praktikum/{idKelas}'
*/
show.get = (args: { idKelas: string | number } | [idKelas: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\PraktikumController::show
* @see app/Http/Controllers/API/PraktikumController.php:42
* @route '/api-v1/praktikum/{idKelas}'
*/
show.head = (args: { idKelas: string | number } | [idKelas: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\API\PraktikumController::show
* @see app/Http/Controllers/API/PraktikumController.php:42
* @route '/api-v1/praktikum/{idKelas}'
*/
const showForm = (args: { idKelas: string | number } | [idKelas: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\PraktikumController::show
* @see app/Http/Controllers/API/PraktikumController.php:42
* @route '/api-v1/praktikum/{idKelas}'
*/
showForm.get = (args: { idKelas: string | number } | [idKelas: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\PraktikumController::show
* @see app/Http/Controllers/API/PraktikumController.php:42
* @route '/api-v1/praktikum/{idKelas}'
*/
showForm.head = (args: { idKelas: string | number } | [idKelas: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\API\PraktikumController::update
* @see app/Http/Controllers/API/PraktikumController.php:99
* @route '/api-v1/praktikum/{id}'
*/
export const update = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/api-v1/praktikum/{id}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\API\PraktikumController::update
* @see app/Http/Controllers/API/PraktikumController.php:99
* @route '/api-v1/praktikum/{id}'
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
* @see \App\Http\Controllers\API\PraktikumController::update
* @see app/Http/Controllers/API/PraktikumController.php:99
* @route '/api-v1/praktikum/{id}'
*/
update.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\API\PraktikumController::update
* @see app/Http/Controllers/API/PraktikumController.php:99
* @route '/api-v1/praktikum/{id}'
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
* @see \App\Http\Controllers\API\PraktikumController::update
* @see app/Http/Controllers/API/PraktikumController.php:99
* @route '/api-v1/praktikum/{id}'
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

const PraktikumController = { index, store, history, show, update }

export default PraktikumController