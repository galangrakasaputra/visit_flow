<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kunjungan extends Model
{
    protected $table = 'kunjungan';

    protected $fillable = [
        'entitas_id',
        'user_id',
        'visit_date',
        'status'
    ];

    public function entitas()
    {
        return $this->belongsTo(Entitas::class, 'entitas_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
