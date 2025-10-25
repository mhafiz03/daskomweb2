import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\API\LaporanPraktikanController::store
* @see app/Http/Controllers/API/LaporanPraktikanController.php:24
* @route '/api-v1/laporan-praktikan'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api-v1/laporan-praktikan',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\API\LaporanPraktikanController::store
* @see app/Http/Controllers/API/LaporanPraktikanController.php:24
* @route '/api-v1/laporan-praktikan'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\API\LaporanPraktikanController::store
* @see app/Http/Controllers/API/LaporanPraktikanController.php:24
* @route '/api-v1/laporan-praktikan'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\API\LaporanPraktikanController::store
* @see app/Http/Controllers/API/LaporanPraktikanController.php:24
* @route '/api-v1/laporan-praktikan'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\API\LaporanPraktikanController::store
* @see app/Http/Controllers/API/LaporanPraktikanController.php:24
* @route '/api-v1/laporan-praktikan'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

const LaporanPraktikanController = { store }

export default LaporanPraktikanController