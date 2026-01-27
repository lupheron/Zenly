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
        Schema::create('guides', function (Blueprint $table) {
            $table->id();
            $table->string('first_name', 255);
            $table->string('last_name', 255);
            $table->enum('gender', ['male', 'female']);
            $table->date('date_of_birth')->nullable();
            $table->string('phone', 50);
            $table->string('email', 255);
            $table->string('password');
            $table->string('languages', 500);
            $table->integer('experience_years');
            $table->string('specialization', 500);
            $table->decimal('rating', 3, 2)->nullable();
            $table->string('location', 255);
            $table->enum('available', ['yes', 'no'])->default('yes');
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
        Schema::dropIfExists('guides');
    }
};
