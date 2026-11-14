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
            'data' => $kunjungan,
            'status' => 'success'
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        $validate = $request->validate([
            'entitas_id' => 'required|exists:entitas,id',
            'visit_date' => 'required|date',
        ]);

        $kunjungan = Kunjungan::create([
            'entitas_id' => $validate['entitas_id'],
            'user_id' => $user->id,
            'visit_date' => $validate['visit_date'],
        ]);

        return response()->json([
            'message' => "Kunjungan Berhasil Ditambahkan",
            'status' => 'success'
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
                'message' => "Kunjungan Tidak Ditemukan",
                'status' => 'error'
            ]);
        }else{
            $kunjungan->update($validate);

            return response()->json([
                'message' => "Kunjungan Berhasil Diupdate",
                'status' => 'success'
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
                'message' => "Kunjungan Tidak Ditemukan",
                'status' => 'error'
            ]);
        }else{
            $kunjungan->update($validate);

            return response()->json([
                'message' => "Status Kunjungan Diperbarui",
                'status' => 'error'
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
            $query->whereDate('visit_date', '>=', $validate['tanggal_mulai']);
        }

        if (isset($validate['tanggal_akhir'])) {
            $query->whereDate('visit_date', '<=', $validate['tanggal_akhir']);
        }

        // Filter berdasarkan data entitas
        $query->whereHas('entitas', function ($q) use ($validate) {
            if (isset($validate['name'])) {
                if (isset($validate['name'])) {
                    $q->whereRaw('LOWER(name) LIKE ?', [
                        '%' . strtolower($validate['name']) . '%'
                    ]);
                }
            }

            if (isset($validate['segment'])) {
                $q->where('segment', 'like', '%' . $validate['segment'] . '%');
            }
        });

        $kunjungan = $query->get();

        return response()->json([
            'data' => $kunjungan,
            'status' => 'success'
        ]);
    }

    public function countKunjungan(){
        $kunjungan = Kunjungan::count();

        return response()->json([
            'status' => 'success',
            'message' => 'Data Berhasil Diambil',
            'data' => $kunjungan
        ]);
    }

    public function delete(string $id){
        $kunjungan = Kunjungan::find($id);

        if(!$kunjungan){
            return response()->json([
                'message' => 'Kunjungan Tidak Ditemukan',
                'status' => 'error'
            ]);
        }else{
            $kunjungan->delete();

            return response()->json([
                'message' => "Kunjungan ke " . $kunjungan->entitas . "Di Tanggal " . $kunjungan->visit_date . " Berhasil Dihapus",
                'status' => 'error'
            ]);
        }
    }
}
