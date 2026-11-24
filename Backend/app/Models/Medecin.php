<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Medecin extends Model
{
    protected $primaryKey = 'user_id';
    public $incrementing = false;

    protected $fillable = ['user_id', 'specialite', 'num_ordre'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function traitements(): HasMany
    {
        return $this->hasMany(Traitement::class, 'medecin_id', 'user_id');
    }

    public function consultations(): HasMany
    {
        return $this->hasMany(Consultation::class, 'medecin_id', 'user_id');
    }
}