<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Kunjungan;
class KunjunganController extends Controller
{
    public function dataKunjungan(Request $request)
    {
        $user = $request->user();
        $kunjungan = Kunjungan::where('user_id', $user->id)
        ->with('entitas')
        ->get();

        return response()->json([
            'data' => $kunjungan
        ]);
    }

    public function store(Request $request)
    {
        $validate = $request->validate([
            'entitas_id' => 'required|exists:entitas,id',
            'user_id' => 'required|exists:users,id',
            'visit_date' => 'required|date',
        ]);

        $kunjungan = Kunjungan::create($validate);

        return response()->json([
            'message' => "Kunjungan Berhasil Ditambahkan"
        ]);
    }

    public function update(Request $request, $id)
    {
        $validate = $request->validate([
            'entitas_id' => 'required|exists:entitas,id',
            'visit_date' => 'required|date',
            'status' => 'required|boolean'
        ]);

        $kunjungan = Kunjungan::find($id);

        if(!$kunjungan){
            return response()->json([
                'message' => "Kunjungan Tidak Ditemukan"
            ]);
        }else{
            $kunjungan->update($validate);

            return response()->json([
                'message' => "Kunjungan Berhasil Diupdate"
            ]);
        }

    }

    public function updateStatus(Request $request, $id)
    {
        $validate = $request->validate([
            'status' => 'required|boolean'
        ]);

        $kunjungan = Kunjungan::findOrFail($id);

        if(!$kunjungan){
            return response()->json([
                'message' => "Kunjungan Tidak Ditemukan"
            ]);
        }else{
            $kunjungan->update($validate);

            return response()->json([
                'message' => "Status Kunjungan Diperbarui"
            ]);
        }
    }

    public function search(Request $request)
    {
        $validate = $request->validate([
            'status' => 'nullable|boolean',
            'tanggal_mulai' => 'nullable|date',
            'tanggal_akhir' => 'nullable|date',
            'name' => 'nullable|string',
            'type' => 'nullable|string',
            'segment' => 'nullable|string',
            'region' => 'nullable|string',
        ]);
        
        $query = Kunjungan::query()
            ->where('user_id', $request->user()->id)
            ->with('entitas');

        // Filter berdasarkan status kunjungan
        if (isset($validate['status'])) {
            $query->where('status', $validate['status']);
        }

        // Filter berdasarkan tanggal mulai
        if (isset($validate['tanggal_mulai'])) {
            $query->whereDate('visit_date', $validate['tanggal_mulai']);
        }

        // Filter berdasarkan tanggal akhir
        if (isset($validate['tanggal_akhir'])) {
            $query->whereDate('visit_date', $validate['tanggal_akhir']);
        }

        // Filter berdasarkan data entitas
        $query->whereHas('entitas', function ($q) use ($validate) {
            if (isset($validate['name'])) {
                $q->where('name', 'like', '%' . $validate['name'] . '%');
            }

            if (isset($validate['type'])) {
                $q->where('type', 'like', '%' . $validate['type'] . '%');
            }

            if (isset($validate['segment'])) {
                $q->where('segment', 'like', '%' . $validate['segment'] . '%');
            }

            if (isset($validate['region'])) {
                $q->where('region', 'like', '%' . $validate['region'] . '%');
            }
        });

        $kunjungan = $query->get();

        return response()->json([
            'data' => $kunjungan
        ]);
    }
}
