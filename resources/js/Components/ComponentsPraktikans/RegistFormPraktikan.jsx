import { useState, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import toast from 'react-hot-toast';
import eyeClose from '../../../assets/form/eyeClose.png';
import eyeOpen from '../../../assets/form/eyeOpen.png';
import ButtonOption from '../../Components/ComponentsPraktikans/ButtonOption';


export default function RegistFormPraktikan({ mode }) {

    const [values, setValues] = useState({
        email: '',
        nama: '',
        nim: '',
        kelas_id: '',
        alamat: '',
        nomor_telepon: '',
        password: '',
    });
    const [kelas, setKelas] = useState([]);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [localErrors, setLocalErrors] = useState({});
    const [kelas, setKelas] = useState([]);

    const togglePasswordVisibility = () => {
        setPasswordVisible((prevState) => !prevState);
    };

    const handleChange = (e) => {
        const key = e.target.id;
        const value = e.target.value;
        setValues((prevValues) => ({
            ...prevValues,
            [key]: value,
        }));
    };

    const validateFields = () => {
        const newErrors = {};

        if (!values.email.trim()) newErrors.email = 'Email is required.';
        if (!values.nama.trim()) newErrors.nama = 'Nama Lengkap is required.';
        if (!values.nim.trim()) newErrors.nim = 'NIM is required.';
        if (!values.kelas_id.trim()) newErrors.kelas_id = 'Kelas is required.';
        if (!values.alamat.trim()) newErrors.alamat = 'Alamat is required.';
        if (!values.nomor_telepon.trim()) newErrors.nomor_telepon = 'No. Telepon is required.';
        if (!values.password.trim()) newErrors.password = 'Password is required.';
        else if (values.password.length < 8) newErrors.password = 'Password must be at least 8 characters.';

        setLocalErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateFields()) {
            try {
                await router.post('/api-v1/register/praktikan', values, {
                    preserveScroll: true,
                    onSuccess: () => {
                        toast.success('Registration finished!');
                        setTimeout(() => {
                            router.visit('/login?mode=praktikan');                    
                        }, 1500); 
                    },
                    onError: (error) => {
                        Object.values(error).forEach((errMsg) => {
                            toast.error(errMsg);
                        });
                    }
                });
            } catch (error) {
                toast.error('An unexpected error occurred. Please try again.');
            }
        }
    };



    useEffect(() => {
        async function fetchKelas() {
            try {
                const response = await fetch('/api-v1/kelas');
                if (response.ok) {
                    const data = await response.json();
                    setKelas(data.kelas || []);
                } else {
                    toast.error("Whoops terjadi kesalahan");
                }
            } catch (error) {
                toast.error("Whoops terjadi kesalahan");
            }
        }

        fetchKelas();
    }, []);

    console.log(mode);

    return (
        <div className="w-1/2 my-1 px-10">
            <p className="font-bold text-lg text-center">Let’s Get Started..</p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    className="bg-lightGray py-1 px-4 mt-3 rounded-sm border-dustyBlue border-2 placeholder-dustyBlue"
                    type="email"
                    id="email"
                    placeholder="Email"
                    value={values.email}
                    onChange={handleChange}
                />
                {localErrors.email && <p className="text-red-500 text-sm mt-1">{localErrors.email}</p>}
                <input
                    className="bg-lightGray py-1 px-4 mt-[-10px] rounded-sm border-dustyBlue border-2 placeholder-dustyBlue"
                    type="text"
                    id="nama"
                    placeholder="Nama Lengkap"
                    value={values.nama}
                    onChange={handleChange}
                />
                {localErrors.nama && <p className="text-red-500 text-sm mt-1">{localErrors.nama}</p>}
                <input
                    className="bg-lightGray py-1 px-4 mt-[-10px] rounded-sm border-dustyBlue border-2 placeholder-dustyBlue"
                    type="text"
                    id="nim"
                    placeholder="NIM"
                    value={values.nim}
                    onChange={handleChange}
                />
                {localErrors.nim && <p className="text-red-500 text-sm mt-1">{localErrors.nim}</p>}

               <select
                    className="bg-lightGray py-1 px-4 mt-[-10px] rounded-sm border-dustyBlue border-2 placeholder-dustyBlue w-full"
                    id="kelas_id"
                    value={values.kelas_id}
                    onChange={handleChange}
                >
                    <option value="" disabled>
                        Pilih Kelas
                    </option>
                    {kelas
                        .filter((k) => !k.kelas.startsWith("TOT")) // Hide classes that start with "TOT"
                        .map((k) => (
                            <option key={k.id} value={k.id}>
                                {k.kelas}
                            </option>
                        ))}
                </select>
                {localErrors.kelas_id && <p className="text-red-500 text-sm mt-1">{localErrors.kelas_id}</p>}
                <input
                    className="bg-lightGray py-1 px-4 mt-[-10px] rounded-sm border-dustyBlue border-2 placeholder-dustyBlue"
                    type="text"
                    id="alamat"
                    placeholder="Alamat"
                    value={values.alamat}
                    onChange={handleChange}
                />
                {localErrors.alamat && <p className="text-red-500 text-sm mt-1">{localErrors.alamat}</p>}
                <input
                    className="bg-lightGray py-1 px-4 mt-[-10px] rounded-sm border-dustyBlue border-2 placeholder-dustyBlue"
                    type="tel"
                    id="nomor_telepon"
                    placeholder="No. Telepon"
                    value={values.nomor_telepon}
                    onChange={handleChange}
                />
                {localErrors.nomor_telepon && <p className="text-red-500 text-sm mt-1">{localErrors.nomor_telepon}</p>}
                <div className="relative">
                    <input
                        className="bg-lightGray py-1 px-4 mt-[-10px] mb-5 w-full rounded-sm border-dustyBlue border-2 placeholder-dustyBlue"
                        type={passwordVisible ? 'text' : 'password'}
                        id="password"
                        placeholder="Password"
                        value={values.password}
                        onChange={handleChange}
                    />
                    <img
                        className="w-4 cursor-pointer absolute top-[25%] right-3 transform -translate-y-1/2"
                        src={passwordVisible ? eyeOpen : eyeClose}
                        alt="Toggle Password Visibility"
                        onClick={togglePasswordVisibility}
                    />
                    {localErrors.password && <p className="text-red-500 text-sm mt-1">{localErrors.password}</p>}
                </div>
                <ButtonOption order="register" mode="praktikan" />
            </form>
        </div>
    );
}
