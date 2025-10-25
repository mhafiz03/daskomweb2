import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\API\JenisPollingController::index
* @see app/Http/Controllers/API/JenisPollingController.php:14
* @route '/api-v1/jenis-polling'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api-v1/jenis-polling',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\API\JenisPollingController::index
* @see app/Http/Controllers/API/JenisPollingController.php:14
* @route '/api-v1/jenis-polling'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\API\JenisPollingController::index
* @see app/Http/Controllers/API/JenisPollingController.php:14
* @route '/api-v1/jenis-polling'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\JenisPollingController::index
* @see app/Http/Controllers/API/JenisPollingController.php:14
* @route '/api-v1/jenis-polling'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\API\JenisPollingController::index
* @see app/Http/Controllers/API/JenisPollingController.php:14
* @route '/api-v1/jenis-polling'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\JenisPollingController::index
* @see app/Http/Controllers/API/JenisPollingController.php:14
* @route '/api-v1/jenis-polling'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\JenisPollingController::index
* @see app/Http/Controllers/API/JenisPollingController.php:14
* @route '/api-v1/jenis-polling'
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

const JenisPollingController = { index }

export default JenisPollingController