import AuditLogController from './AuditLogController'
import API from './API'
import Auth from './Auth'

const Controllers = {
    AuditLogController: Object.assign(AuditLogController, AuditLogController),
    API: Object.assign(API, API),
    Auth: Object.assign(Auth, Auth),
}

export default Controllers