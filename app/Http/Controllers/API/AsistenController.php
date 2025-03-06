<?php

namespace App\Http\Controllers\API;

use App\Models\Asisten;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AsistenController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index() //buat card asistens & foto polling
    {
        try {
            $asisten = Asisten::leftJoin('roles', 'roles.id', '=', 'asistens.role_id')
                ->select('nama', 'kode', 'roles.name as role', 'role_id', 'nomor_telepon', 'id_line', 'instagram', 'deskripsi', )
                ->get();
            return response()->json([
                'success' => true,
                'asisten' => $asisten,
                'message' => 'Asisten retrieved successfully.',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve Asisten.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $request->validate([
            'nomor_telepon' => 'required|string',
            'id_line' => 'required|string',
            'instagram' => 'required|string',
            'deskripsi' => 'required|string',
            // 'password' => 'required|string',
        ]);
        try {
            $asisten = Asisten::find(auth()->guard('asisten')->user()->id);
            if (!$asisten) {
                return response()->json([
                    'success' => false,
                    'message' => 'Asisten not found.',
                ], 404);
            }
            $asisten->nomor_telepon = $request->nomor_telepon;
            $asisten->id_line = $request->id_line;
            $asisten->instagram = $request->instagram;
            $asisten->deskripsi = $request->deskripsi;
            $asisten->save();

            return redirect()->back()->with('success', 'Asisten updated successfully.');
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update Asisten.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }



    /**
 * change password of asisten
 */

//public function updatePassword(Request $request)
//{
//    try {
//        $request->validate([
//            'current_password' => 'required|string',
//            'password' => 'required|string|min:8',
//        ]);
//
//
//        if (!$asisten) {
//            return response()->json(['message' => 'Asisten tidak ditemukan'], 404);
//        }
//
//        if (!Hash::check($request->current_password, $asisten->password)) {
//            return back()->withErrors([
//                'current_password' => 'Password saat ini tidak sesuai'
//            ]);
//        }
//
//        $asisten->password = Hash::make($request->password);
//        $asisten->save();
//
//        return back()->with('success', 'Password berhasil diubah');
//    } catch (ValidationException $e) {
//        return back()->withErrors($e->errors());
//    } catch (\Exception $e) {
//        return back()->withErrors([
//            'error' => 'Gagal mengubah password: ' . $e->getMessage()
//        ]);
//    }
//}



public function updatePassword(Request $request)
{
    $validator = Validator::make($request->all(), [
        'current_password' => 'required|string',
        'password' => 'required|string|min:8',
    ]);

    if ($validator->fails()) {
        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        return back()->withErrors($validator)->withInput();
    }

    try {
        $asisten = Asisten::where('id', $request->id)->first();
        if (!$asisten) {
            if ($request ->expectsJson()){
                return response()->json([
                    'message' => 'Asisten tidak ditemukan'
                ], 404);
            }
            return back()->with('error', 'Asisten tidak ditemukan');
        }

        if (!Hash::check($request->current_password, $asisten->password)) {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Password saat ini tidak sesuai'
                ], 422);
            }

            return back()->withErrors([
                'current_password' => 'Password saat ini tidak sesuai'
            ]);
        }

        $asisten->password = Hash::make($request->password);
        $asisten->save();

        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'Password berhasil diubah'
            ], 200);
        }

        return back()->with('success', 'Password berhasil diubah');
    } catch (ValidationException $e) {
        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'Validasi gagal',
                'errors' => $e->errors()
            ], 422);
        }

        return back()->withErrors($e->errors());
    } catch (\Exception $e) {
        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'Terjadi kesalahan saat mengubah password',
                'error' => $e->getMessage()
            ], 500);
        }
    }
        
}




    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $asisten = Asisten::findOrFail($id);
            $role = Role::findOrFail($asisten->role_id);
            $asisten->removeRole($role->name);
            $asisten->delete();
            return response()->json([
                'success' => true,
                'message' => 'Asisten deleted successfully.',
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Asisten or Role not found.',
                'error' => $e->getMessage(),
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete Asisten.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

}
