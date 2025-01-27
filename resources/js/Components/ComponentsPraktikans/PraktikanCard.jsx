import daskomIcon from "../../../../resources/assets/daskom.svg";
import CircularImage from "../CircularImage";

export default function CardPraktikan({praktikan}) {
    console.log(praktikan)
    return (
        <>
            <div className="mt-[13vh] mx-auto font-poppins">
                <div className="bg-softIvory h-[436px] w-[352.8px] shadow-xl rounded-lg pt-5">
                    <CircularImage src={daskomIcon} alt="Logo Daskom" />

                    <div className="flex justify-center mb-[10px] mt-[16px]">
                        <h1 className="font-poppins font-bold text-lg max-w-[320px] truncate">
                            {praktikan.nama}
                        </h1>
                    </div>

                    <div className="flex ">
                        <ul className="mx-[17px] mb-[20px] font-poppins text-sm">
                            <li className="my-[4px]">
                                NIM
                            </li>
                            <li className="my-[4px]">
                                Kelas
                            </li>
                            <li className="my-[4px]">
                                No. Telp
                            </li>
                            <li className="my-[4px]">
                                Email
                            </li>
                        </ul>
                        <ul className="mx-[17px] mb-[20px] font-poppins text-sm">
                            <li className="my-[4px] max-w-[320px] truncate">
                                : {praktikan.nim}
                            </li>
                            <li className="my-[4px] max-w-[230px] truncate">
                                : {praktikan.kelas_id}
                            </li>
                            <li className="my-[4px] max-w-[230px] truncate">
                                : {praktikan.nomor_telepon}
                            </li>
                            <li className="my-[4px] max-w-[230px] truncate">
                                : {praktikan.email}
                            </li>
                        </ul>
                    </div>

                    <div className="my-[20px] h-[27.5px] mx-[17px] bg-darkGreen rounded-md">
                        <h1 className="text-center text-white font-poppins font-bold text-lg">
                            Praktikan Daskom Laboratory
                        </h1>
                    </div>
                </div>
            </div>
        </>
    );
}
