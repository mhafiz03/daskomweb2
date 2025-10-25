import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\API\DeadlineController::reset
* @see app/Http/Controllers/API/DeadlineController.php:123
* @route '/api-v1/deadline/reset/{idPraktikum}'
*/
export const reset = (args: { idPraktikum: string | number } | [idPraktikum: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: reset.url(args, options),
    method: 'put',
})

reset.definition = {
    methods: ["put"],
    url: '/api-v1/deadline/reset/{idPraktikum}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\API\DeadlineController::reset
* @see app/Http/Controllers/API/DeadlineController.php:123
* @route '/api-v1/deadline/reset/{idPraktikum}'
*/
reset.url = (args: { idPraktikum: string | number } | [idPraktikum: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { idPraktikum: args }
    }

    if (Array.isArray(args)) {
        args = {
            idPraktikum: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        idPraktikum: args.idPraktikum,
    }

    return reset.definition.url
            .replace('{idPraktikum}', parsedArgs.idPraktikum.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\API\DeadlineController::reset
* @see app/Http/Controllers/API/DeadlineController.php:123
* @route '/api-v1/deadline/reset/{idPraktikum}'
*/
reset.put = (args: { idPraktikum: string | number } | [idPraktikum: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: reset.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\API\DeadlineController::reset
* @see app/Http/Controllers/API/DeadlineController.php:123
* @route '/api-v1/deadline/reset/{idPraktikum}'
*/
const resetForm = (args: { idPraktikum: string | number } | [idPraktikum: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reset.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\API\DeadlineController::reset
* @see app/Http/Controllers/API/DeadlineController.php:123
* @route '/api-v1/deadline/reset/{idPraktikum}'
*/
resetForm.put = (args: { idPraktikum: string | number } | [idPraktikum: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reset.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

reset.form = resetForm

/**
* @see \App\Http\Controllers\API\DeadlineController::show
* @see app/Http/Controllers/API/DeadlineController.php:32
* @route '/api-v1/deadline/{idPraktikum}'
*/
export const show = (args: { idPraktikum: string | number } | [idPraktikum: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api-v1/deadline/{idPraktikum}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\API\DeadlineController::show
* @see app/Http/Controllers/API/DeadlineController.php:32
* @route '/api-v1/deadline/{idPraktikum}'
*/
show.url = (args: { idPraktikum: string | number } | [idPraktikum: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { idPraktikum: args }
    }

    if (Array.isArray(args)) {
        args = {
            idPraktikum: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        idPraktikum: args.idPraktikum,
    }

    return show.definition.url
            .replace('{idPraktikum}', parsedArgs.idPraktikum.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\API\DeadlineController::show
* @see app/Http/Controllers/API/DeadlineController.php:32
* @route '/api-v1/deadline/{idPraktikum}'
*/
show.get = (args: { idPraktikum: string | number } | [idPraktikum: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\DeadlineController::show
* @see app/Http/Controllers/API/DeadlineController.php:32
* @route '/api-v1/deadline/{idPraktikum}'
*/
show.head = (args: { idPraktikum: string | number } | [idPraktikum: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\API\DeadlineController::show
* @see app/Http/Controllers/API/DeadlineController.php:32
* @route '/api-v1/deadline/{idPraktikum}'
*/
const showForm = (args: { idPraktikum: string | number } | [idPraktikum: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\DeadlineController::show
* @see app/Http/Controllers/API/DeadlineController.php:32
* @route '/api-v1/deadline/{idPraktikum}'
*/
showForm.get = (args: { idPraktikum: string | number } | [idPraktikum: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\DeadlineController::show
* @see app/Http/Controllers/API/DeadlineController.php:32
* @route '/api-v1/deadline/{idPraktikum}'
*/
showForm.head = (args: { idPraktikum: string | number } | [idPraktikum: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\API\DeadlineController::update
* @see app/Http/Controllers/API/DeadlineController.php:60
* @route '/api-v1/deadline/{id}'
*/
export const update = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/api-v1/deadline/{id}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\API\DeadlineController::update
* @see app/Http/Controllers/API/DeadlineController.php:60
* @route '/api-v1/deadline/{id}'
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
* @see \App\Http\Controllers\API\DeadlineController::update
* @see app/Http/Controllers/API/DeadlineController.php:60
* @route '/api-v1/deadline/{id}'
*/
update.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\API\DeadlineController::update
* @see app/Http/Controllers/API/DeadlineController.php:60
* @route '/api-v1/deadline/{id}'
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
* @see \App\Http\Controllers\API\DeadlineController::update
* @see app/Http/Controllers/API/DeadlineController.php:60
* @route '/api-v1/deadline/{id}'
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

const DeadlineController = { reset, show, update }

export default DeadlineController