<?php

namespace App\Http\Controllers\Auth;

use Inertia\Inertia;
use Inertia\Response;
use App\Models\Asisten;
use App\Models\Praktikan;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use App\Http\Controllers\Controller;
use App\Models\Kelas;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;

class RegisteredPraktikanController extends Controller
{
    /**
     * Display the registration view.
     */

     public function getKelas()
     {
        try {
            $kelas = Kelas::all();
            return response()->json([
                'status' => 'success',
                'message' => 'Kelas retrieved successfully.',
                'kelas' => $kelas,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve kelas.',
                'error' => $e->getMessage(),
            ], 500);
        }
     }

    public function create(): Response
    {
        return Inertia::render('Auth/Register');//ini pake path yg bener
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'nim' => 'required|string|max:12|unique:' . Praktikan::class,
            'nomor_telepon' =>'required|string|max:15',
            'email' => 'required|string|email',
            'kelas_id'=>'required|integer|exists:kelas,id',
            'alamat' => 'required|string',
            'password' =>'required|string',
        ]);

        $praktikan = Praktikan::create([
            'nama' => $request->nama,
            'nim' => $request->nim,
            'kelas_id' => $request->kelas_id,
            'alamat' => $request->alamat,
            'email' => $request->email,
            'nomor_telepon' => $request->nomor_telepon,
            'password' => Hash::make($request->password),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $praktikan->assignRole('PRAKTIKAN');

        return Redirect::route('login');
    }

    public function lupaPassword(Request $request): RedirectResponse
    {
        $request->validate([
            'new_password' => 'required|min:8',
            'confirm_password' => 'required|same:new_password',
        ]);

        try {
            // For a password reset, we might need to find the user by other identifiers
            // like email or username if we don't have a reliable ID
            $user = null;

            if ($request->has('id') && $request->id) {
                $user = Praktikan::find($request->id);
            }

            if ($request->has('email') && $request->email) {
                $user = Praktikan::where('email', $request->email)->first();
            }

            if (!$user) {
                return back()->withErrors([
                    'error' => 'User tidak ditemukan. Silakan periksa kembali data yang dimasukkan.',
                ]);
            }

            // Update the password
            $user->password = Hash::make($request->new_password);
            $user->save();

            return back()->with('success', 'Password berhasil diubah.');
        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ]);
        }
    }
}
