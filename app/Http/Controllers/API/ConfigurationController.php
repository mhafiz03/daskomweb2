<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Configuration;
use Illuminate\Http\Request;

class ConfigurationController extends Controller
{
    /**
     * ALL CONF GOES HERE web conf, TP conf, Unlock ans conf
     */
    public function index()
    {
        try {
            $config = Configuration::select(
                'tp_activation',
                'tubes_activation',
                'polling_activation',
                'registrationPraktikan_activation',
                'registrationAsisten_activation',
                'kode_asisten'
            )->first();
            return response()->json([
                'success' => true,
                'config' => $config,
                'message' => 'Configuration retrieved successfully.'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve configuration.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        try {
            // Validasi data
            $request->validate([
                'tp_activation' => 'required|integer|in:0,1',
                'tubes_activation' => 'required|integer|in:0,1',
                'polling_activation' => 'required|integer|in:0,1',
                'registrationPraktikan_activation' => 'required|integer|in:0,1',
                'registrationAsisten_activation' => 'required|integer|in:0,1',
                'kode_asisten' => 'required|string',
            ]);

            // Cari atau buat record configuration
            $config = Configuration::firstOrNew(['id' => 1]);

            // Update data
            $config->tp_activation = $request->tp_activation;
            $config->tubes_activation = $request->tubes_activation;
            $config->polling_activation = $request->polling_activation;
            $config->registrationPraktikan_activation = $request->registrationPraktikan_activation;
            $config->registrationAsisten_activation = $request->registrationAsisten_activation;
            $config->kode_asisten = $request->kode_asisten ?? auth('sanctum')->user()->kode;
            $config->save();

            return response()->json([
                'config' => $config,
                'success' => true,
                'message' => 'Configuration updated successfully.'
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update configuration.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
