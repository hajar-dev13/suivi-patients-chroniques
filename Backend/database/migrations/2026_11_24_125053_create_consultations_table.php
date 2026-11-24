<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('consultations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('patient_id');
            $table->foreign('patient_id')->references('user_id')->on('patients')->cascadeOnDelete();
            // nullable : une demande du patient n'a pas encore de médecin ni de date
            $table->unsignedBigInteger('medecin_id')->nullable();
            $table->foreign('medecin_id')->references('user_id')->on('medecins')->nullOnDelete();
            $table->dateTime('date_heure')->nullable();
            $table->string('type')->default('Présentielle');
            $table->string('lien_visio')->nullable();
            $table->string('motif');
            $table->text('compte_rendu')->nullable();
            $table->string('statut')->default('Demandée');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('consultations');
    }
};