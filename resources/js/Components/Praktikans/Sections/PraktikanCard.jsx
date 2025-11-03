import daskomIcon from "../../../../../resources/assets/daskom.svg";
import CircularImage from "../../Common/CircularImage";

export default function CardPraktikan({praktikan}) {
    console.log(praktikan)
    return (
        <>
            <div className="mx-auto mt-[13vh] font-poppins items-center flex flex-col">
                <div className="h-[436px] w-[352.8px] rounded-depth-lg border border-depth bg-depth-card pt-6 shadow-depth-lg">
                    {/* <CircularImage className="h-36 w-36 rounded-depth-full object-cover" src={daskomIcon} alt="Logo Daskom" /> */}
                    <div className="mx-auto relative flex h-40 w-40 items-center justify-center rounded-depth-full border border-depth bg-depth-background shadow-depth-md">
                            <img
                                src={daskomIcon}
                                alt="Logo Daskom"
                                className="h-36 w-36 rounded-depth-full object-cover"
                            />
                            <span className="pointer-events-none absolute inset-0 rounded-depth-full border border-white/20 shadow-[inset_0_2px_6px_rgba(255,255,255,0.25)]" />
                        </div>

                    <div className="mb-3 mt-4 flex justify-center">
                        <h1 className="max-w-[320px] truncate font-poppins text-lg font-bold text-depth-primary">
                            {praktikan.nama}
                        </h1>
                    </div>

                    <div className="flex px-5">
                        <ul className="mb-5 font-poppins text-sm text-depth-secondary">
                            <li className="my-1">
                                NIM
                            </li>
                            <li className="my-1">
                                Kelas
                            </li>
                            <li className="my-1">
                                No. Telp
                            </li>
                            <li className="my-1">
                                Email
                            </li>
                        </ul>
                        <ul className="ml-4 mb-5 font-poppins text-sm font-medium text-depth-primary">
                            <li className="my-1 max-w-[320px] truncate">
                                : {praktikan.nim}
                            </li>
                            <li className="my-1 max-w-[230px] truncate">
                                : {praktikan.kelas_id}
                            </li>
                            <li className="my-1 max-w-[230px] truncate">
                                : {praktikan.nomor_telepon}
                            </li>
                            <li className="my-1 max-w-[230px] truncate">
                                : {praktikan.email}
                            </li>
                        </ul>
                    </div>

                    <div className="mx-5 my-5 rounded-depth-md bg-[var(--depth-color-primary)] py-1 shadow-depth-md">
                        <h1 className="text-center font-poppins text-lg font-bold text-white">
                            Daskom Laboratory
                        </h1>
                    </div>
                </div>
            </div>
        </>
    );
}
