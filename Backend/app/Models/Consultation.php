<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Consultation extends Model
{
    protected $fillable = [
        'patient_id', 'medecin_id', 'date_heure', 'type', 'lien_visio', 'motif', 'compte_rendu', 'statut',
    ];

    protected $casts = [
        'date_heure' => 'datetime:Y-m-d H:i:s',
    ];

    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class, 'patient_id', 'user_id');
    }

    public function medecin(): BelongsTo
    {
        return $this->belongsTo(Medecin::class, 'medecin_id', 'user_id');
    }
}