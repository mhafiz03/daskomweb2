<?php

namespace App\Http\Controllers\API;

use App\Models\Asisten;
use App\Models\Polling;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class PollingsController extends Controller
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
        $request->validate([
            'asisten_id' => 'required|integer|exists:asistens,id',
            'polling_id' => 'required|integer|exists:jenis_pollings,id',
            'praktikan_id' => 'required|integer|exists:praktikans,id',
        ]);
        
        try {
            $polling = Polling::where('praktikan_id', $request->praktikan_id)
                ->where('polling_id', $request->polling_id)
                ->first();
                
            if ($polling) {
                $polling->update([
                    'asisten_id' => $request->asisten_id,
                ]);
                return response()->json([
                    'message' => 'Polling updated successfully.'
                ], 200);
            } else {
                Polling::create([
                    'asisten_id' => $request->asisten_id,
                    'polling_id' => $request->polling_id,
                    'praktikan_id' => $request->praktikan_id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
                return response()->json([
                    'message' => 'Polling created successfully.'
                ], 201);
            }
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred while processing the request.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function show(string $id) // $id adalah pollingId (ID jenis polling)
    {
        try {
            $asisten = DB::table('pollings')
                ->leftJoin('jenis_pollings', 'jenis_pollings.id', '=', 'pollings.polling_id')
                ->leftJoin('asistens', 'asistens.id', '=', 'pollings.asisten_id')
                ->where('pollings.polling_id', $id) // Gunakan polling_id, bukan praktikan_id
                ->select('asistens.id', 'asistens.nama', 'asistens.kode', DB::raw('count(pollings.id) as total'))
                ->groupBy('asistens.id', 'asistens.nama', 'asistens.kode')
                ->get();

            return response()->json([
                'status' => 'success',
                'polling' => $asisten,
                'message' => 'Poll count by assistant code retrieved successfully.'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred while retrieving the data.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Show asistant
     */

     public function getAllAsistens()
     {
         try {
             $asistens = Asisten::select('id', 'nama', 'kode', 'deskripsi')->orderBy('nama', 'asc')->get();
 
             return response()->json([
                 'status' => 'success',
                 'asistens' => $asistens,
                 'message' => 'All asisten data retrieved successfully.'
             ], 200);
         } catch (\Exception $e) {
             return response()->json([
                 'status' => 'error',
                 'message' => 'Failed to retrieve asisten data.',
                 'error' => $e->getMessage(),
             ], 500);
         }
     }
     

      /**
     * Submit multiple pollings at once
     */
       /**
     * Submit multiple pollings at once
     */
    public function submitAll(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'submissions' => 'required|array',
                'submissions.*.polling_id' => 'required|integer|exists:jenis_pollings,id',
                'submissions.*.asisten_id' => 'required|integer|exists:asistens,id',
                'submissions.*.praktikan_id' => 'required|integer|exists:praktikans,id',
            ]);
    
            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }
    
            DB::beginTransaction();
    
            foreach ($request->submissions as $submission) {
                $result = Polling::updateOrCreate(
                    [
                        'polling_id' => $submission['polling_id'],
                        'praktikan_id' => $submission['praktikan_id'] 
                    ],
                    [
                        'asisten_id' => $submission['asisten_id'],
                        'created_at' => now(),
                        'updated_at' => now()
                    ]
                );
            }
    
            DB::commit();
    
            return response()->json([
                'status' => 'success',
                'message' => 'All pollings submitted successfully.',
                'data' => null // Optional: you can include additional data
            ]);
    
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Server error: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request) //praktikan
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
}
