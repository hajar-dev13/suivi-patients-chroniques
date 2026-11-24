<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Mesure extends Model
{
    // Types de mesure et leur unité
    public const TYPES = [
        'Glycémie' => 'g/L',
        'Tension systolique' => 'mmHg',
        'Fréquence cardiaque' => 'bpm',
        'Température' => '°C',
        'Poids' => 'kg',
    ];

    protected $fillable = ['patient_id', 'type_mesure', 'valeur', 'unite', 'date_mesure', 'commentaire'];

    protected $casts = [
        'valeur' => 'float',
        'date_mesure' => 'datetime:Y-m-d H:i:s',
    ];

    protected $appends = ['est_anormale'];

    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class, 'patient_id', 'user_id');
    }

    // Même règle que estAnormale() du front : déclenche l'alerte au médecin
    protected function estAnormale(): Attribute
    {
        return Attribute::get(function () {
            $v = (float) $this->valeur;
            return match ($this->type_mesure) {
                'Glycémie' => $v < 0.7 || $v > 1.26,
                'Tension systolique' => $v < 90 || $v > 140,
                'Fréquence cardiaque' => $v < 50 || $v > 110,
                'Température' => $v < 35.5 || $v > 38,
                default => false,
            };
        });
    }
}