<?php

namespace App\Http\Controllers\API;

use ImageKit\ImageKit;
use App\Models\Asisten;
use App\Models\FotoAsisten;
use Illuminate\Http\Request;
use App\Adapter\ImageKitAdapter;
use Spatie\Permission\Models\Role;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Intervention\Image\ImageManager;
use Illuminate\Support\Facades\Validator;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\Encoders\WebpEncoder;

class AsistenController extends Controller
{

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            if(!auth()->guard('asisten')->user()) {
                $asisten = Asisten::leftJoin('foto_asistens', 'foto_asistens.kode', '=', 'asistens.kode')
                    ->select('nama', 'asistens.kode', 'foto_asistens.foto', 'nomor_telepon', 'id_line', 'instagram', 'deskripsi')
                    ->orderBy('asistens.kode', 'asc')->get(); 
                
            }else{
                $asisten = Asisten::leftJoin('roles', 'roles.id', '=', 'asistens.role_id')
                ->leftJoin('foto_asistens', 'foto_asistens.kode', '=', 'asistens.kode')
                ->select('nama', 'asistens.kode', 'foto_asistens.foto', 'roles.name as role', 'role_id', 'nomor_telepon', 'id_line', 'instagram', 'deskripsi')
                ->orderBy('asistens.kode', 'asc')->get();
            }
            return response()->json([
                'success' => true,
                'asisten' => $asisten,
                'message' => 'Asisten retrieved successfully.',
            ], 200);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to retrieve Asisten.');
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

    public function updatePp(Request $request){
        // //inii bedaaa lagi
        if ($request->hasFile('upload')) {
            try {
                $validator = Validator::make($request->all(), [
                    'upload' => 'image|mimes:jpeg,png,jpg|max:512',
                ]);

                if ($validator->fails()) {
                    return back()->withErrors($validator->errors()); // Inertia handles errors automatically
                }

                $imageKit = new ImageKit(
                    env('IMAGEKIT_PUBLIC_KEY'),
                    env('IMAGEKIT_PRIVATE_KEY'),
                    env('IMAGEKIT_ENDPOINT_URL')
                );

                $user = auth('asisten')->user();
                $file = $request->file('upload');

                // Find existing record
                $foto = FotoAsisten::where('kode', $user->kode)->first();

                // Initialize adapter
                $adapter = new ImageKitAdapter($imageKit);

                // If an old image exists, delete it from ImageKit
                if ($foto && $foto->foto) {
                    $adapter->delete($foto->fileId);
                }

            
                // Upload to ImageKit
                $result = $adapter->upload('ProfilePicDaskom/' . $user->kode . '.' . $file->getClientOriginalExtension(), $file)->result;

                // Create or update FotoAsisten entry
                if ($foto) {
                    $foto->update([
                        'foto' => env('IMAGEKIT_ENDPOINT_URL') . $result->filePath. '?updatedAt='. now()->timestamp * 1000,
                        'fileId' => $result->fileId,
                    ]);
                } else {
                    FotoAsisten::create([
                        'kode' => $user->kode,
                        'foto' => env('IMAGEKIT_ENDPOINT_URL') . $result-> filePath . '?updatedAt=' . now()->timestamp * 1000,
                        'fileId' => $result->fileId,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }

                return back()->with('success', 'Profile picture updated successfully.');
            } catch (\Exception $e) {
                return back()->with('error', 'Something went wrong: ' . $e->getMessage());
            }
        }

        return back()->with('error', 'No file uploaded.');
        
    }


    public function destroyPp(){

        try {
            $imageKit = new ImageKit(
                env('IMAGEKIT_PUBLIC_KEY'),
                env('IMAGEKIT_PRIVATE_KEY'),
                env('IMAGEKIT_ENDPOINT_URL')
            );

            $user = auth('asisten')->user();

            // Find existing record
            $foto = FotoAsisten::where('kode', $user->kode)->first();

            // If an old image exists, delete it from ImageKit
            $adapter = new ImageKitAdapter($imageKit);

            if ($foto && $foto->foto) {
                $adapter->delete($foto->fileId);
                FotoAsisten::where('kode', $user->kode)->delete();
            }

            return back()->with('success', 'Profile picture deleted successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to delete profile picture: ' . $e->getMessage());
        }

    }



    /**
     * change password of asisten fixed
     */

    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|string',
            'password' => 'required|string|min:8',
        ]);

        try {

            $asisten = Asisten::find(auth()->guard('asisten')->user()->id);

            if (!$asisten) {
                return redirect()->back()->withErrors([
                    'error' => 'Asisten not found.'
                ]);
            }

            if (!Hash::check($request->current_password, $asisten->password)) {
                return redirect()->back()->withErrors([
                    'current_password' => 'Password Sebelunmnya tidak sesuai'
                ]);
            }

            $asisten->password = Hash::make($request->password);
            $asisten->save();

            return redirect()->back()->with('success', 'Password berhasil diubah');
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'gagal mengubah password',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    public function destroy(Request $request)
    {
        try {
        $data = request()->input('asistens', []);

        if (empty($data)) {
            return redirect(route('manage-role'))->with('error', 'No data provided.');
        }

        foreach ($data as $kode) {
            $asisten = Asisten::where('kode', $kode)->first();

            if (!$asisten) {
                return redirect(route('manage-role'))->with('error', "Asisten with kode $kode not found.");
            }

            $role = Role::find($asisten->role_id);
            if ($role) {
                $asisten->removeRole($role->name);
            }

            $asisten->delete();
        }

        // Return success message
        return redirect(route('manage-role'))->with('success', 'Selected Asistens deleted successfully.');
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
