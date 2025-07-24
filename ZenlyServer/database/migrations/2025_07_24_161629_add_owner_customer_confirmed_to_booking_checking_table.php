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
        Schema::table('booking_checking', function (Blueprint $table) {
            $table->boolean('owner_confirmed')->default(false);
            $table->boolean('customer_confirmed')->default(false);
            $table->json('owner_data')->nullable();
            $table->json('customer_data')->nullable();
            $table->string('status')->default('waiting_customer');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('booking_checking', function (Blueprint $table) {
            $table->dropColumn(['owner_confirmed', 'customer_confirmed', 'owner_data', 'customer_data', 'status']);
        });
    }
};
