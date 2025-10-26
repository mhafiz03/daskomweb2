import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\API\NilaiController::store
* @see app/Http/Controllers/API/NilaiController.php:23
* @route '/api-v1/nilai'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api-v1/nilai',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\API\NilaiController::store
* @see app/Http/Controllers/API/NilaiController.php:23
* @route '/api-v1/nilai'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\API\NilaiController::store
* @see app/Http/Controllers/API/NilaiController.php:23
* @route '/api-v1/nilai'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\API\NilaiController::store
* @see app/Http/Controllers/API/NilaiController.php:23
* @route '/api-v1/nilai'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\API\NilaiController::store
* @see app/Http/Controllers/API/NilaiController.php:23
* @route '/api-v1/nilai'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\API\NilaiController::showAsisten
* @see app/Http/Controllers/API/NilaiController.php:108
* @route '/api-v1/nilai/praktikan/{praktikan}/modul/{modul}'
*/
export const showAsisten = (args: { praktikan: string | number, modul: string | number } | [praktikan: string | number, modul: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showAsisten.url(args, options),
    method: 'get',
})

showAsisten.definition = {
    methods: ["get","head"],
    url: '/api-v1/nilai/praktikan/{praktikan}/modul/{modul}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\API\NilaiController::showAsisten
* @see app/Http/Controllers/API/NilaiController.php:108
* @route '/api-v1/nilai/praktikan/{praktikan}/modul/{modul}'
*/
showAsisten.url = (args: { praktikan: string | number, modul: string | number } | [praktikan: string | number, modul: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            praktikan: args[0],
            modul: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        praktikan: args.praktikan,
        modul: args.modul,
    }

    return showAsisten.definition.url
            .replace('{praktikan}', parsedArgs.praktikan.toString())
            .replace('{modul}', parsedArgs.modul.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\API\NilaiController::showAsisten
* @see app/Http/Controllers/API/NilaiController.php:108
* @route '/api-v1/nilai/praktikan/{praktikan}/modul/{modul}'
*/
showAsisten.get = (args: { praktikan: string | number, modul: string | number } | [praktikan: string | number, modul: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showAsisten.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\NilaiController::showAsisten
* @see app/Http/Controllers/API/NilaiController.php:108
* @route '/api-v1/nilai/praktikan/{praktikan}/modul/{modul}'
*/
showAsisten.head = (args: { praktikan: string | number, modul: string | number } | [praktikan: string | number, modul: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showAsisten.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\API\NilaiController::showAsisten
* @see app/Http/Controllers/API/NilaiController.php:108
* @route '/api-v1/nilai/praktikan/{praktikan}/modul/{modul}'
*/
const showAsistenForm = (args: { praktikan: string | number, modul: string | number } | [praktikan: string | number, modul: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showAsisten.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\NilaiController::showAsisten
* @see app/Http/Controllers/API/NilaiController.php:108
* @route '/api-v1/nilai/praktikan/{praktikan}/modul/{modul}'
*/
showAsistenForm.get = (args: { praktikan: string | number, modul: string | number } | [praktikan: string | number, modul: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showAsisten.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\NilaiController::showAsisten
* @see app/Http/Controllers/API/NilaiController.php:108
* @route '/api-v1/nilai/praktikan/{praktikan}/modul/{modul}'
*/
showAsistenForm.head = (args: { praktikan: string | number, modul: string | number } | [praktikan: string | number, modul: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showAsisten.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

showAsisten.form = showAsistenForm

/**
* @see \App\Http\Controllers\API\NilaiController::update
* @see app/Http/Controllers/API/NilaiController.php:163
* @route '/api-v1/nilai/{id}'
*/
export const update = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/api-v1/nilai/{id}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\API\NilaiController::update
* @see app/Http/Controllers/API/NilaiController.php:163
* @route '/api-v1/nilai/{id}'
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
* @see \App\Http\Controllers\API\NilaiController::update
* @see app/Http/Controllers/API/NilaiController.php:163
* @route '/api-v1/nilai/{id}'
*/
update.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\API\NilaiController::update
* @see app/Http/Controllers/API/NilaiController.php:163
* @route '/api-v1/nilai/{id}'
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
* @see \App\Http\Controllers\API\NilaiController::update
* @see app/Http/Controllers/API/NilaiController.php:163
* @route '/api-v1/nilai/{id}'
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

/**
* @see \App\Http\Controllers\API\NilaiController::show
* @see app/Http/Controllers/API/NilaiController.php:81
* @route '/api-v1/nilai'
*/
export const show = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api-v1/nilai',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\API\NilaiController::show
* @see app/Http/Controllers/API/NilaiController.php:81
* @route '/api-v1/nilai'
*/
show.url = (options?: RouteQueryOptions) => {
    return show.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\API\NilaiController::show
* @see app/Http/Controllers/API/NilaiController.php:81
* @route '/api-v1/nilai'
*/
show.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\NilaiController::show
* @see app/Http/Controllers/API/NilaiController.php:81
* @route '/api-v1/nilai'
*/
show.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\API\NilaiController::show
* @see app/Http/Controllers/API/NilaiController.php:81
* @route '/api-v1/nilai'
*/
const showForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\NilaiController::show
* @see app/Http/Controllers/API/NilaiController.php:81
* @route '/api-v1/nilai'
*/
showForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\NilaiController::show
* @see app/Http/Controllers/API/NilaiController.php:81
* @route '/api-v1/nilai'
*/
showForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

const NilaiController = { store, showAsisten, update, show }

export default NilaiController