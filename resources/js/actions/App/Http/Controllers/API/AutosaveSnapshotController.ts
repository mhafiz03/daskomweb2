import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\API\AutosaveSnapshotController::index
* @see app/Http/Controllers/API/AutosaveSnapshotController.php:91
* @route '/api-v1/praktikan/autosave'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api-v1/praktikan/autosave',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\API\AutosaveSnapshotController::index
* @see app/Http/Controllers/API/AutosaveSnapshotController.php:91
* @route '/api-v1/praktikan/autosave'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\API\AutosaveSnapshotController::index
* @see app/Http/Controllers/API/AutosaveSnapshotController.php:91
* @route '/api-v1/praktikan/autosave'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\AutosaveSnapshotController::index
* @see app/Http/Controllers/API/AutosaveSnapshotController.php:91
* @route '/api-v1/praktikan/autosave'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\API\AutosaveSnapshotController::index
* @see app/Http/Controllers/API/AutosaveSnapshotController.php:91
* @route '/api-v1/praktikan/autosave'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\AutosaveSnapshotController::index
* @see app/Http/Controllers/API/AutosaveSnapshotController.php:91
* @route '/api-v1/praktikan/autosave'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\AutosaveSnapshotController::index
* @see app/Http/Controllers/API/AutosaveSnapshotController.php:91
* @route '/api-v1/praktikan/autosave'
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
* @see \App\Http\Controllers\API\AutosaveSnapshotController::store
* @see app/Http/Controllers/API/AutosaveSnapshotController.php:168
* @route '/api-v1/praktikan/autosave'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api-v1/praktikan/autosave',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\API\AutosaveSnapshotController::store
* @see app/Http/Controllers/API/AutosaveSnapshotController.php:168
* @route '/api-v1/praktikan/autosave'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\API\AutosaveSnapshotController::store
* @see app/Http/Controllers/API/AutosaveSnapshotController.php:168
* @route '/api-v1/praktikan/autosave'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\API\AutosaveSnapshotController::store
* @see app/Http/Controllers/API/AutosaveSnapshotController.php:168
* @route '/api-v1/praktikan/autosave'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\API\AutosaveSnapshotController::store
* @see app/Http/Controllers/API/AutosaveSnapshotController.php:168
* @route '/api-v1/praktikan/autosave'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\API\AutosaveSnapshotController::bulkUpsert
* @see app/Http/Controllers/API/AutosaveSnapshotController.php:205
* @route '/api-v1/praktikan/autosave/bulk-upsert'
*/
export const bulkUpsert = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkUpsert.url(options),
    method: 'post',
})

bulkUpsert.definition = {
    methods: ["post"],
    url: '/api-v1/praktikan/autosave/bulk-upsert',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\API\AutosaveSnapshotController::bulkUpsert
* @see app/Http/Controllers/API/AutosaveSnapshotController.php:205
* @route '/api-v1/praktikan/autosave/bulk-upsert'
*/
bulkUpsert.url = (options?: RouteQueryOptions) => {
    return bulkUpsert.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\API\AutosaveSnapshotController::bulkUpsert
* @see app/Http/Controllers/API/AutosaveSnapshotController.php:205
* @route '/api-v1/praktikan/autosave/bulk-upsert'
*/
bulkUpsert.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkUpsert.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\API\AutosaveSnapshotController::bulkUpsert
* @see app/Http/Controllers/API/AutosaveSnapshotController.php:205
* @route '/api-v1/praktikan/autosave/bulk-upsert'
*/
const bulkUpsertForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: bulkUpsert.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\API\AutosaveSnapshotController::bulkUpsert
* @see app/Http/Controllers/API/AutosaveSnapshotController.php:205
* @route '/api-v1/praktikan/autosave/bulk-upsert'
*/
bulkUpsertForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: bulkUpsert.url(options),
    method: 'post',
})

bulkUpsert.form = bulkUpsertForm

/**
* @see \App\Http\Controllers\API\AutosaveSnapshotController::destroy
* @see app/Http/Controllers/API/AutosaveSnapshotController.php:245
* @route '/api-v1/praktikan/autosave'
*/
export const destroy = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api-v1/praktikan/autosave',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\API\AutosaveSnapshotController::destroy
* @see app/Http/Controllers/API/AutosaveSnapshotController.php:245
* @route '/api-v1/praktikan/autosave'
*/
destroy.url = (options?: RouteQueryOptions) => {
    return destroy.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\API\AutosaveSnapshotController::destroy
* @see app/Http/Controllers/API/AutosaveSnapshotController.php:245
* @route '/api-v1/praktikan/autosave'
*/
destroy.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\API\AutosaveSnapshotController::destroy
* @see app/Http/Controllers/API/AutosaveSnapshotController.php:245
* @route '/api-v1/praktikan/autosave'
*/
const destroyForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\API\AutosaveSnapshotController::destroy
* @see app/Http/Controllers/API/AutosaveSnapshotController.php:245
* @route '/api-v1/praktikan/autosave'
*/
destroyForm.delete = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

/**
* @see \App\Http\Controllers\API\AutosaveSnapshotController::storeQuestionIds
* @see app/Http/Controllers/API/AutosaveSnapshotController.php:284
* @route '/api-v1/praktikan/autosave/questions'
*/
export const storeQuestionIds = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeQuestionIds.url(options),
    method: 'post',
})

storeQuestionIds.definition = {
    methods: ["post"],
    url: '/api-v1/praktikan/autosave/questions',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\API\AutosaveSnapshotController::storeQuestionIds
* @see app/Http/Controllers/API/AutosaveSnapshotController.php:284
* @route '/api-v1/praktikan/autosave/questions'
*/
storeQuestionIds.url = (options?: RouteQueryOptions) => {
    return storeQuestionIds.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\API\AutosaveSnapshotController::storeQuestionIds
* @see app/Http/Controllers/API/AutosaveSnapshotController.php:284
* @route '/api-v1/praktikan/autosave/questions'
*/
storeQuestionIds.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeQuestionIds.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\API\AutosaveSnapshotController::storeQuestionIds
* @see app/Http/Controllers/API/AutosaveSnapshotController.php:284
* @route '/api-v1/praktikan/autosave/questions'
*/
const storeQuestionIdsForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeQuestionIds.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\API\AutosaveSnapshotController::storeQuestionIds
* @see app/Http/Controllers/API/AutosaveSnapshotController.php:284
* @route '/api-v1/praktikan/autosave/questions'
*/
storeQuestionIdsForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeQuestionIds.url(options),
    method: 'post',
})

storeQuestionIds.form = storeQuestionIdsForm

/**
* @see \App\Http\Controllers\API\AutosaveSnapshotController::getQuestionIds
* @see app/Http/Controllers/API/AutosaveSnapshotController.php:333
* @route '/api-v1/praktikan/autosave/questions'
*/
export const getQuestionIds = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getQuestionIds.url(options),
    method: 'get',
})

getQuestionIds.definition = {
    methods: ["get","head"],
    url: '/api-v1/praktikan/autosave/questions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\API\AutosaveSnapshotController::getQuestionIds
* @see app/Http/Controllers/API/AutosaveSnapshotController.php:333
* @route '/api-v1/praktikan/autosave/questions'
*/
getQuestionIds.url = (options?: RouteQueryOptions) => {
    return getQuestionIds.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\API\AutosaveSnapshotController::getQuestionIds
* @see app/Http/Controllers/API/AutosaveSnapshotController.php:333
* @route '/api-v1/praktikan/autosave/questions'
*/
getQuestionIds.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getQuestionIds.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\AutosaveSnapshotController::getQuestionIds
* @see app/Http/Controllers/API/AutosaveSnapshotController.php:333
* @route '/api-v1/praktikan/autosave/questions'
*/
getQuestionIds.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getQuestionIds.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\API\AutosaveSnapshotController::getQuestionIds
* @see app/Http/Controllers/API/AutosaveSnapshotController.php:333
* @route '/api-v1/praktikan/autosave/questions'
*/
const getQuestionIdsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getQuestionIds.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\AutosaveSnapshotController::getQuestionIds
* @see app/Http/Controllers/API/AutosaveSnapshotController.php:333
* @route '/api-v1/praktikan/autosave/questions'
*/
getQuestionIdsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getQuestionIds.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\AutosaveSnapshotController::getQuestionIds
* @see app/Http/Controllers/API/AutosaveSnapshotController.php:333
* @route '/api-v1/praktikan/autosave/questions'
*/
getQuestionIdsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getQuestionIds.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

getQuestionIds.form = getQuestionIdsForm

const AutosaveSnapshotController = { index, store, bulkUpsert, destroy, storeQuestionIds, getQuestionIds }

export default AutosaveSnapshotController