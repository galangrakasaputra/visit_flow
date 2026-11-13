<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EntitasController;
use App\Http\Controllers\KunjunganController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function() {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::resource('entitas', EntitasController::class);
    Route::get('/kunjungan', [KunjunganController::class, 'dataKunjungan']);
    Route::post('/kunjungan', [KunjunganController::class, 'store']);
    Route::put('/kunjungan/{id}', [KunjunganController::class, 'update']);
    Route::put('/kunjungan/{id}/status', [KunjunganController::class, 'updateStatus']);
    Route::get('/kunjungan/search', [KunjunganController::class, 'search']);
});

