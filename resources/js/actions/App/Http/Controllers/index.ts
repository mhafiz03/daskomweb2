import API from './API'
import Auth from './Auth'

const Controllers = {
    API: Object.assign(API, API),
    Auth: Object.assign(Auth, Auth),
}

export default Controllers