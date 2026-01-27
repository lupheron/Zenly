<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('drivers', function (Blueprint $table) {
            $table->id();
            $table->string('first_name', 50);
            $table->string('last_name', 50);
            $table->enum('gender', ['male', 'female', 'other']);
            $table->string('phone', 20);
            $table->string('email', 100);
            $table->string('password');
            $table->string('language', 100);
            $table->integer('experience_years');
            $table->string('license_number', 50);
            $table->enum('vehicle_type', ['car', 'minivan', 'bus', 'jeep']);
            $table->string('vehicle_model', 100);
            $table->string('plate_number', 20);
            $table->decimal('rating', 3, 2)->nullable();
            $table->enum('available', ['yes', 'no'])->default('yes');
            $table->string('location', 100);
            $table->decimal('price_per_day', 10, 2);
            $table->string('profile_photo')->nullable();
            $table->text('bio')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('drivers');
    }
};
