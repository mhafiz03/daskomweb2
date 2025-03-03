<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Praktikan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class PraktikanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
    

    /**
     * Update the praktikan's password.
     */
    public function setPassword(Request $request)
{
    // Validate the request
    $validator = Validator::make($request->all(), [
        'nim' => 'required|exists:praktikans,nim',
        'password' => 'required|min:6',
    ], [
        'nim.required' => 'NIM harus diisi',
        'nim.exists' => 'NIM tidak ditemukan dalam database',
        'password.required' => 'Password baru harus diisi',
        'password.min' => 'Password baru minimal 6 karakter',
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
        // Find the praktikan by NIM
        $praktikan = Praktikan::where('nim', $request->nim)->first();
        
        if (!$praktikan) {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Praktikan tidak ditemukan'
                ], 404);
            }
            
            return back()->with('error', 'Praktikan tidak ditemukan');
        }

        // Update the password
        $praktikan->password = Hash::make($request->password);
        $praktikan->save();

        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'Password Praktikan berhasil diperbarui'
            ], 200);
        }
        
        return redirect()->back()->with('success', 'Password Praktikan berhasil diperbarui');
    } catch (\Exception $e) {
        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'Terjadi kesalahan saat memperbarui password',
                'error' => $e->getMessage()
            ], 500);
        }
        
        return back()->with('error', 'Terjadi kesalahan saat memperbarui password');
    }
}
}
