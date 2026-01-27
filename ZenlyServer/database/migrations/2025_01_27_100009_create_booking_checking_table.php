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
        Schema::create('booking_checking', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('request_id');
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('post_id');
            $table->date('start_date');
            $table->date('end_date');
            $table->decimal('price', 10, 2);
            $table->boolean('owner_confirmed')->default(false);
            $table->boolean('customer_confirmed')->default(false);
            $table->json('owner_data')->nullable();
            $table->json('customer_data')->nullable();
            $table->string('status', 50)->default('waiting_customer'); // waiting_customer, active, expired
            $table->timestamps();

            $table->index('request_id');
            $table->index('post_id');
            $table->index(['status', 'end_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('booking_checking');
    }
};
