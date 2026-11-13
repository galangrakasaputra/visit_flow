<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kunjungan extends Model
{
    protected $table = 'kunjungan';

    protected $fillable = [
        'entitas_id',
        'user_id',
        'tanggal_mulai',
        'tanggal_akhir',
        'status'
    ];

    public function entitas()
    {
        return $this->belongsTo(Entitas::class, 'entitas_id');
    }
}
