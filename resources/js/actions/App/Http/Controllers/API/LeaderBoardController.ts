import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\API\LeaderBoardController::index
* @see app/Http/Controllers/API/LeaderBoardController.php:32
* @route '/api-v1/leaderboard'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api-v1/leaderboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\API\LeaderBoardController::index
* @see app/Http/Controllers/API/LeaderBoardController.php:32
* @route '/api-v1/leaderboard'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\API\LeaderBoardController::index
* @see app/Http/Controllers/API/LeaderBoardController.php:32
* @route '/api-v1/leaderboard'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\LeaderBoardController::index
* @see app/Http/Controllers/API/LeaderBoardController.php:32
* @route '/api-v1/leaderboard'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\API\LeaderBoardController::index
* @see app/Http/Controllers/API/LeaderBoardController.php:32
* @route '/api-v1/leaderboard'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\LeaderBoardController::index
* @see app/Http/Controllers/API/LeaderBoardController.php:32
* @route '/api-v1/leaderboard'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\LeaderBoardController::index
* @see app/Http/Controllers/API/LeaderBoardController.php:32
* @route '/api-v1/leaderboard'
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
* @see \App\Http\Controllers\API\LeaderBoardController::show
* @see app/Http/Controllers/API/LeaderBoardController.php:42
* @route '/api-v1/leaderboard/{idKelas}'
*/
export const show = (args: { idKelas: string | number } | [idKelas: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api-v1/leaderboard/{idKelas}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\API\LeaderBoardController::show
* @see app/Http/Controllers/API/LeaderBoardController.php:42
* @route '/api-v1/leaderboard/{idKelas}'
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
* @see \App\Http\Controllers\API\LeaderBoardController::show
* @see app/Http/Controllers/API/LeaderBoardController.php:42
* @route '/api-v1/leaderboard/{idKelas}'
*/
show.get = (args: { idKelas: string | number } | [idKelas: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\LeaderBoardController::show
* @see app/Http/Controllers/API/LeaderBoardController.php:42
* @route '/api-v1/leaderboard/{idKelas}'
*/
show.head = (args: { idKelas: string | number } | [idKelas: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\API\LeaderBoardController::show
* @see app/Http/Controllers/API/LeaderBoardController.php:42
* @route '/api-v1/leaderboard/{idKelas}'
*/
const showForm = (args: { idKelas: string | number } | [idKelas: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\LeaderBoardController::show
* @see app/Http/Controllers/API/LeaderBoardController.php:42
* @route '/api-v1/leaderboard/{idKelas}'
*/
showForm.get = (args: { idKelas: string | number } | [idKelas: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\API\LeaderBoardController::show
* @see app/Http/Controllers/API/LeaderBoardController.php:42
* @route '/api-v1/leaderboard/{idKelas}'
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

const LeaderBoardController = { index, show }

export default LeaderBoardController