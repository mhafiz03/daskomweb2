import RegisteredAsistenController from './RegisteredAsistenController'
import RegisteredPraktikanController from './RegisteredPraktikanController'
import LoginAsistenController from './LoginAsistenController'
import ConfirmablePasswordController from './ConfirmablePasswordController'
import PasswordAsistenController from './PasswordAsistenController'
import LoginPraktikanController from './LoginPraktikanController'
import PasswordPraktikanController from './PasswordPraktikanController'

const Auth = {
    RegisteredAsistenController: Object.assign(RegisteredAsistenController, RegisteredAsistenController),
    RegisteredPraktikanController: Object.assign(RegisteredPraktikanController, RegisteredPraktikanController),
    LoginAsistenController: Object.assign(LoginAsistenController, LoginAsistenController),
    ConfirmablePasswordController: Object.assign(ConfirmablePasswordController, ConfirmablePasswordController),
    PasswordAsistenController: Object.assign(PasswordAsistenController, PasswordAsistenController),
    LoginPraktikanController: Object.assign(LoginPraktikanController, LoginPraktikanController),
    PasswordPraktikanController: Object.assign(PasswordPraktikanController, PasswordPraktikanController),
}

export default Auth