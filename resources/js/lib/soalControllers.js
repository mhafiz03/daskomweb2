import * as SoalTAController from "@/actions/App/Http/Controllers/API/SoalTAController";
import * as SoalTKController from "@/actions/App/Http/Controllers/API/SoalTKController";
import * as SoalTPController from "@/actions/App/Http/Controllers/API/SoalTPController";
import * as SoalFITBController from "@/actions/App/Http/Controllers/API/SoalFITBController";
import * as SoalJurnalController from "@/actions/App/Http/Controllers/API/SoalJurnalController";
import * as SoalTMController from "@/actions/App/Http/Controllers/API/SoalTMController";

const SOAL_CONTROLLERS = {
    ta: SoalTAController,
    tk: SoalTKController,
    tp: SoalTPController,
    fitb: SoalFITBController,
    jurnal: SoalJurnalController,
    tm: SoalTMController,
};

export const getSoalController = (kategori) => SOAL_CONTROLLERS[kategori];

export { SOAL_CONTROLLERS };
