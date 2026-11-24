<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Patient extends Model
{
    protected $primaryKey = 'user_id';
    public $incrementing = false;

    protected $fillable = ['user_id', 'date_naissance', 'sexe', 'telephone', 'adresse'];

    protected $casts = [
        'date_naissance' => 'date:Y-m-d',
    ];

    protected $appends = ['age'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function mesures(): HasMany
    {
        return $this->hasMany(Mesure::class, 'patient_id', 'user_id');
    }

    public function traitements(): HasMany
    {
        return $this->hasMany(Traitement::class, 'patient_id', 'user_id');
    }

    public function consultations(): HasMany
    {
        return $this->hasMany(Consultation::class, 'patient_id', 'user_id');
    }

    // Âge calculé à partir de la date de naissance (comme getAge() du front)
    protected function age(): Attribute
    {
        return Attribute::get(fn () => $this->date_naissance ? $this->date_naissance->age : null);
    }
}