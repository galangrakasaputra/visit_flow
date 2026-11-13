<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Entitas extends Model
{
    protected $table = 'entitas';

    protected $fillable = [
        'name',
        'type',
        'segment',
        'region',
    ];

    public function kunjungan()
    {
        return $this->hasMany(Kunjungan::class, 'entitas_id');
    }
}
