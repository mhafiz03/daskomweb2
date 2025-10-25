import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\API\TugasPendahuluanController::index
* @see app/Http/Controllers/API/TugasPendahuluanController.php:15
* @route '/api-v1/tugas-pendahuluan'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api-v1/tugas-pendahuluan',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\API\TugasPendahuluanController::index
* @see app/Http/Controllers/API/TugasPendahuluanController.php:15
* @route '/api-v1/tugas-pendahuluan'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\API\TugasPendahuluanController::index
* @see app/Http/Controllers/API/TugasPendahuluanController.php:15
* @route '/api-v1/tugas-pendahuluan'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\TugasPendahuluanController::index
* @see app/Http/Controllers/API/TugasPendahuluanController.php:15
* @route '/api-v1/tugas-pendahuluan'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\API\TugasPendahuluanController::index
* @see app/Http/Controllers/API/TugasPendahuluanController.php:15
* @route '/api-v1/tugas-pendahuluan'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\TugasPendahuluanController::index
* @see app/Http/Controllers/API/TugasPendahuluanController.php:15
* @route '/api-v1/tugas-pendahuluan'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\TugasPendahuluanController::index
* @see app/Http/Controllers/API/TugasPendahuluanController.php:15
* @route '/api-v1/tugas-pendahuluan'
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
* @see \App\Http\Controllers\API\TugasPendahuluanController::update
* @see app/Http/Controllers/API/TugasPendahuluanController.php:44
* @route '/api-v1/tugas-pendahuluan'
*/
export const update = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/api-v1/tugas-pendahuluan',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\API\TugasPendahuluanController::update
* @see app/Http/Controllers/API/TugasPendahuluanController.php:44
* @route '/api-v1/tugas-pendahuluan'
*/
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\API\TugasPendahuluanController::update
* @see app/Http/Controllers/API/TugasPendahuluanController.php:44
* @route '/api-v1/tugas-pendahuluan'
*/
update.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\API\TugasPendahuluanController::update
* @see app/Http/Controllers/API/TugasPendahuluanController.php:44
* @route '/api-v1/tugas-pendahuluan'
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
* @see \App\Http\Controllers\API\TugasPendahuluanController::update
* @see app/Http/Controllers/API/TugasPendahuluanController.php:44
* @route '/api-v1/tugas-pendahuluan'
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

const TugasPendahuluanController = { index, update }

export default TugasPendahuluanController