<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens;

    protected $fillable = ['nom', 'prenom', 'email', 'password', 'role'];

    protected $hidden = ['password', 'remember_token'];

    protected function casts(): array
    {
        return [
            'password' => 'hashed', // le mot de passe est haché automatiquement
        ];
    }

    public function patient(): HasOne
    {
        return $this->hasOne(Patient::class, 'user_id');
    }

    public function medecin(): HasOne
    {
        return $this->hasOne(Medecin::class, 'user_id');
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class, 'user_id');
    }

    public function estPatient(): bool { return $this->role === 'PATIENT'; }
    public function estMedecin(): bool { return $this->role === 'MEDECIN'; }
    public function estAdmin(): bool { return $this->role === 'ADMIN'; }
}