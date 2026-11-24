<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Rappel extends Model
{
    protected $fillable = ['traitement_id', 'message', 'date_heure', 'frequence', 'actif'];

    protected $casts = [
        'actif' => 'boolean',
        'date_heure' => 'datetime:Y-m-d H:i:s',
    ];

    public function traitement(): BelongsTo
    {
        return $this->belongsTo(Traitement::class);
    }
}