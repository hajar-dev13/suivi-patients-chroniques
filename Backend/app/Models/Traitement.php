<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Traitement extends Model
{
    protected $fillable = ['patient_id', 'medecin_id', 'medicament', 'posologie', 'date_debut', 'date_fin', 'statut'];

    protected $casts = [
        'date_debut' => 'date:Y-m-d',
        'date_fin' => 'date:Y-m-d',
    ];

    protected $appends = ['est_actif'];

    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class, 'patient_id', 'user_id');
    }

    public function medecin(): BelongsTo
    {
        return $this->belongsTo(Medecin::class, 'medecin_id', 'user_id');
    }

    public function rappels(): HasMany
    {
        return $this->hasMany(Rappel::class);
    }

    // Actif = « En cours » et date de fin pas encore dépassée
    protected function estActif(): Attribute
    {
        return Attribute::get(fn () => $this->statut === 'En cours'
            && $this->date_fin !== null
            && $this->date_fin->greaterThanOrEqualTo(today()));
    }
}