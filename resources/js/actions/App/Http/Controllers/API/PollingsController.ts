import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\API\PollingsController::show
* @see app/Http/Controllers/API/PollingsController.php:93
* @route '/api-v1/polling/{id}'
*/
const show0b909498621eb1163504cbb7eb365cc1 = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show0b909498621eb1163504cbb7eb365cc1.url(args, options),
    method: 'get',
})

show0b909498621eb1163504cbb7eb365cc1.definition = {
    methods: ["get","head"],
    url: '/api-v1/polling/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\API\PollingsController::show
* @see app/Http/Controllers/API/PollingsController.php:93
* @route '/api-v1/polling/{id}'
*/
show0b909498621eb1163504cbb7eb365cc1.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return show0b909498621eb1163504cbb7eb365cc1.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\API\PollingsController::show
* @see app/Http/Controllers/API/PollingsController.php:93
* @route '/api-v1/polling/{id}'
*/
show0b909498621eb1163504cbb7eb365cc1.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show0b909498621eb1163504cbb7eb365cc1.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\PollingsController::show
* @see app/Http/Controllers/API/PollingsController.php:93
* @route '/api-v1/polling/{id}'
*/
show0b909498621eb1163504cbb7eb365cc1.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show0b909498621eb1163504cbb7eb365cc1.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\API\PollingsController::show
* @see app/Http/Controllers/API/PollingsController.php:93
* @route '/api-v1/polling/{id}'
*/
const show0b909498621eb1163504cbb7eb365cc1Form = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show0b909498621eb1163504cbb7eb365cc1.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\PollingsController::show
* @see app/Http/Controllers/API/PollingsController.php:93
* @route '/api-v1/polling/{id}'
*/
show0b909498621eb1163504cbb7eb365cc1Form.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show0b909498621eb1163504cbb7eb365cc1.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\PollingsController::show
* @see app/Http/Controllers/API/PollingsController.php:93
* @route '/api-v1/polling/{id}'
*/
show0b909498621eb1163504cbb7eb365cc1Form.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show0b909498621eb1163504cbb7eb365cc1.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show0b909498621eb1163504cbb7eb365cc1.form = show0b909498621eb1163504cbb7eb365cc1Form
/**
* @see \App\Http\Controllers\API\PollingsController::show
* @see app/Http/Controllers/API/PollingsController.php:93
* @route '/api-v1/pollings/{id}'
*/
const showa2481d50e34d22a8388a1c171da621ba = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showa2481d50e34d22a8388a1c171da621ba.url(args, options),
    method: 'get',
})

showa2481d50e34d22a8388a1c171da621ba.definition = {
    methods: ["get","head"],
    url: '/api-v1/pollings/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\API\PollingsController::show
* @see app/Http/Controllers/API/PollingsController.php:93
* @route '/api-v1/pollings/{id}'
*/
showa2481d50e34d22a8388a1c171da621ba.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return showa2481d50e34d22a8388a1c171da621ba.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\API\PollingsController::show
* @see app/Http/Controllers/API/PollingsController.php:93
* @route '/api-v1/pollings/{id}'
*/
showa2481d50e34d22a8388a1c171da621ba.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showa2481d50e34d22a8388a1c171da621ba.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\PollingsController::show
* @see app/Http/Controllers/API/PollingsController.php:93
* @route '/api-v1/pollings/{id}'
*/
showa2481d50e34d22a8388a1c171da621ba.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showa2481d50e34d22a8388a1c171da621ba.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\API\PollingsController::show
* @see app/Http/Controllers/API/PollingsController.php:93
* @route '/api-v1/pollings/{id}'
*/
const showa2481d50e34d22a8388a1c171da621baForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showa2481d50e34d22a8388a1c171da621ba.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\PollingsController::show
* @see app/Http/Controllers/API/PollingsController.php:93
* @route '/api-v1/pollings/{id}'
*/
showa2481d50e34d22a8388a1c171da621baForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showa2481d50e34d22a8388a1c171da621ba.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\PollingsController::show
* @see app/Http/Controllers/API/PollingsController.php:93
* @route '/api-v1/pollings/{id}'
*/
showa2481d50e34d22a8388a1c171da621baForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showa2481d50e34d22a8388a1c171da621ba.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

showa2481d50e34d22a8388a1c171da621ba.form = showa2481d50e34d22a8388a1c171da621baForm

export const show = {
    '/api-v1/polling/{id}': show0b909498621eb1163504cbb7eb365cc1,
    '/api-v1/pollings/{id}': showa2481d50e34d22a8388a1c171da621ba,
}

/**
* @see \App\Http\Controllers\API\PollingsController::store
* @see app/Http/Controllers/API/PollingsController.php:29
* @route '/api-v1/pollings'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api-v1/pollings',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\API\PollingsController::store
* @see app/Http/Controllers/API/PollingsController.php:29
* @route '/api-v1/pollings'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\API\PollingsController::store
* @see app/Http/Controllers/API/PollingsController.php:29
* @route '/api-v1/pollings'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\API\PollingsController::store
* @see app/Http/Controllers/API/PollingsController.php:29
* @route '/api-v1/pollings'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\API\PollingsController::store
* @see app/Http/Controllers/API/PollingsController.php:29
* @route '/api-v1/pollings'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

const PollingsController = { show, store }

export default PollingsController