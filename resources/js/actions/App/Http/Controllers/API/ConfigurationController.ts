import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\API\ConfigurationController::index
* @see app/Http/Controllers/API/ConfigurationController.php:15
* @route '/api-v1/config'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api-v1/config',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\API\ConfigurationController::index
* @see app/Http/Controllers/API/ConfigurationController.php:15
* @route '/api-v1/config'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\API\ConfigurationController::index
* @see app/Http/Controllers/API/ConfigurationController.php:15
* @route '/api-v1/config'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\ConfigurationController::index
* @see app/Http/Controllers/API/ConfigurationController.php:15
* @route '/api-v1/config'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\API\ConfigurationController::index
* @see app/Http/Controllers/API/ConfigurationController.php:15
* @route '/api-v1/config'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\ConfigurationController::index
* @see app/Http/Controllers/API/ConfigurationController.php:15
* @route '/api-v1/config'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\ConfigurationController::index
* @see app/Http/Controllers/API/ConfigurationController.php:15
* @route '/api-v1/config'
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
* @see \App\Http\Controllers\API\ConfigurationController::update
* @see app/Http/Controllers/API/ConfigurationController.php:43
* @route '/api-v1/config'
*/
export const update = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/api-v1/config',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\API\ConfigurationController::update
* @see app/Http/Controllers/API/ConfigurationController.php:43
* @route '/api-v1/config'
*/
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\API\ConfigurationController::update
* @see app/Http/Controllers/API/ConfigurationController.php:43
* @route '/api-v1/config'
*/
update.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\API\ConfigurationController::update
* @see app/Http/Controllers/API/ConfigurationController.php:43
* @route '/api-v1/config'
*/
const updateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\API\ConfigurationController::update
* @see app/Http/Controllers/API/ConfigurationController.php:43
* @route '/api-v1/config'
*/
updateForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

const ConfigurationController = { index, update }

export default ConfigurationController