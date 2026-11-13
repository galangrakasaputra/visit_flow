<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Entitas;
class EntitasController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $entitas = Entitas::all();

        return response()->json([
            'data' => $entitas
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validate = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string',
            'segment' => 'required|string',
            'region' => 'required|string'
        ]);

        $exist = Entitas::where('name', $validate['name'])
                 ->where('type', $validate['type'])
                 ->exists();

        if($exist){
            return response()->json([
                'message' => 'Entitas sudah ada'
            ]);
        }else{
            $entitas = Entitas::create([
                'name' => $validate['name'],
                'type' => $validate['type'],
                'segment' => $validate['segment'],
                'region' => $validate['region'],
            ]);

            return response()->json([
                'message' => "Entitas Berhasil Ditambahkan"
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validate = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string',
            'segment' => 'required|string',
            'region' => 'required|string'
        ]);

        $entitas = Entitas::find($id);

        if(!$entitas){
            return response()->json([
                'message' => 'Entitas Tidak Ada'
            ]);
        }

        $exist = Entitas::where('name', $validate['name'])
                ->where('type', $validate['type'])
                ->exists();
        if($exist){
            return response()->json([
                'message' => 'Entitas Sudah Ada'
            ]);
        }else{
            $entitas->update([
                'name' => $validate['name'],
                'type' => $validate['type'],
                'segment' => $validate['segment'],
                'region' => $validate['region']
            ]);

            return response()->json([
                'message' => "Entitas " . $entitas->name . " Berhasil Diperbarui"
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $entitas = Entitas::find($id);

        if(!$entitas){
            return response()->json([
                'message' => "Entitas Tidak ada"
            ]);
        }else{
            $entitas->delete();

            return response()->json([
                'message' => $entitas->name . " Berhasil Dihapus"
            ]);
        }
    }
}
