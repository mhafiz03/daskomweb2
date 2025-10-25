import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\API\HistoryJagaController::index
* @see app/Http/Controllers/API/HistoryJagaController.php:12
* @route '/api-v1/history-jaga'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api-v1/history-jaga',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\API\HistoryJagaController::index
* @see app/Http/Controllers/API/HistoryJagaController.php:12
* @route '/api-v1/history-jaga'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\API\HistoryJagaController::index
* @see app/Http/Controllers/API/HistoryJagaController.php:12
* @route '/api-v1/history-jaga'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\HistoryJagaController::index
* @see app/Http/Controllers/API/HistoryJagaController.php:12
* @route '/api-v1/history-jaga'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\API\HistoryJagaController::index
* @see app/Http/Controllers/API/HistoryJagaController.php:12
* @route '/api-v1/history-jaga'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\HistoryJagaController::index
* @see app/Http/Controllers/API/HistoryJagaController.php:12
* @route '/api-v1/history-jaga'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\HistoryJagaController::index
* @see app/Http/Controllers/API/HistoryJagaController.php:12
* @route '/api-v1/history-jaga'
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
* @see \App\Http\Controllers\API\HistoryJagaController::store
* @see app/Http/Controllers/API/HistoryJagaController.php:44
* @route '/api-v1/history-jaga'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api-v1/history-jaga',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\API\HistoryJagaController::store
* @see app/Http/Controllers/API/HistoryJagaController.php:44
* @route '/api-v1/history-jaga'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\API\HistoryJagaController::store
* @see app/Http/Controllers/API/HistoryJagaController.php:44
* @route '/api-v1/history-jaga'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\API\HistoryJagaController::store
* @see app/Http/Controllers/API/HistoryJagaController.php:44
* @route '/api-v1/history-jaga'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\API\HistoryJagaController::store
* @see app/Http/Controllers/API/HistoryJagaController.php:44
* @route '/api-v1/history-jaga'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

const HistoryJagaController = { index, store }

export default HistoryJagaController