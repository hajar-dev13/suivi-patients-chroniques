<?php

namespace Database\Seeders;

use App\Models\Medecin;
use App\Models\Mesure;
use App\Models\Patient;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Administrateur
        User::create([
            'nom' => 'Bennani', 'prenom' => 'Sara',
            'email' => 'admin@suivi.ma', 'password' => 'admin123', 'role' => 'ADMIN',
        ]);

        // Médecin
        $medecin = User::create([
            'nom' => 'Alami', 'prenom' => 'Youssef',
            'email' => 'medecin@suivi.ma', 'password' => 'medecin123', 'role' => 'MEDECIN',
        ]);
        Medecin::create([
            'user_id' => $medecin->id, 'specialite' => 'Cardiologie', 'num_ordre' => 'MED-4521',
        ]);

        // Patiente
        $fatima = User::create([
            'nom' => 'Tazi', 'prenom' => 'Fatima',
            'email' => 'fatima@suivi.ma', 'password' => 'patient123', 'role' => 'PATIENT',
        ]);
        Patient::create([
            'user_id' => $fatima->id, 'date_naissance' => '1972-09-30', 'sexe' => 'Femme',
            'telephone' => '0662345678', 'adresse' => 'Marrakech',
        ]);

        Mesure::create([
            'patient_id' => $fatima->id, 'type_mesure' => 'Poids', 'valeur' => 68,
            'unite' => 'kg', 'date_mesure' => now(),
        ]);
    }
}