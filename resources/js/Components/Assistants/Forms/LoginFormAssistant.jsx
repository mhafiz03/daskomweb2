import { useState } from 'react';
import toast from 'react-hot-toast';
import eyeClose from '../../../../assets/form/eyeClose.png';
import eyeOpen from '../../../../assets/form/eyeOpen.png';
import ButtonOption from '../../Praktikans/Buttons/ButtonOption';
import Modal from '../../Praktikans/Modals/Modal';
import ModalForgotPass from '../Modals/ModalForgotPass';
import { submit } from '@/lib/wayfinder';
import { store as loginAsisten } from '@/actions/App/Http/Controllers/Auth/LoginAsistenController';

export default function LoginFormAssistant({ mode }) {
    const [values, setValues] = useState({
        kode: '',
        password: '',
    });

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const togglePasswordVisibility = () => {
        setPasswordVisible((prevState) => !prevState);
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    function handleChange(e) {
        const key = e.target.id;
        const value = e.target.value;
        setValues((values) => ({
            ...values,
            [key]: value,
        }));
    }

    function handleSubmit(e) {
        e.preventDefault();

        // Perform login using Inertia's router
        submit(loginAsisten(), {
            data: values,
            preserveScroll: true,
            onSuccess: (page) => {
                if (page.props.auth.asisten) {
                    toast.success('Login successful!');
                } else {
                    toast.error('Login failed! Please check your credentials.');
                }
                console.log(page.props);
            },
            onError: (error) => {
                Object.values(error).forEach((errMsg) => {
                    toast.error(errMsg);
                });
            }
        });
    }

    return (
        <div className="w-1/2 my-10 px-10">
            <h1 className="font-bold text-3xl text-darkGreen text-shadow-md text-center">
                WELCOME!
            </h1>
            <p className="font-bold text-lg text-center">
                Please login to start practicum.
            </p>
            <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
                <input
                    className="bg-lightGray py-1 px-4 mt-10 rounded-sm border-dustyBlue border-2 placeholder-dustyBlue uppercase w-full"
                    type="text"
                    id="kode"
                    value={values.kode}
                    onChange={handleChange}
                    name="kode"
                    placeholder="B0T"
                    maxLength={3}
                />

                <div className="relative">
                    <input
                        className="bg-lightGray py-1 px-4 mt-1 w-full rounded-sm border-dustyBlue border-2 placeholder-dustyBlue"
                        type={passwordVisible ? 'text' : 'password'}
                        id="password"
                        value={values.password}
                        onChange={handleChange}
                        name="password"
                        placeholder="Password"
                    />
                    <img
                        className="w-4 cursor-pointer absolute top-[55%] right-3 transform -translate-y-1/2"
                        src={passwordVisible ? eyeOpen : eyeClose}
                        alt="Toggle Password Visibility"
                        onClick={togglePasswordVisibility}
                    />
                   
                </div>
                <div className="relative items-center" >
                    {/* Error Message */}
                    {errorMessage && (
                        <p className="text-red-500 justify-center text-sm mt-2">{errorMessage}</p>
                    )}
                </div>


                <ButtonOption order="login" mode={mode} />
            </form>
            <div className="relative my-1 text-right">
                <p
                    className="inline-block relative text-sm text-deepForestGreen font-semibold cursor-pointer group"
                    onClick={openModal}
                >
                    Forgot Password?
                    <span className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-deepForestGreenDark transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" />
                </p>
            </div>

            {isModalOpen && (
                <Modal isOpen={isModalOpen} onClose={closeModal} width="w-[370px]">
                    <ModalForgotPass />
                </Modal>
            )}
        </div>
    );
}
