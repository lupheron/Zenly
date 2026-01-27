<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('booking_checking', function (Blueprint $table) {

            if (!Schema::hasColumn('booking_checking', 'owner_confirmed')) {
                $table->boolean('owner_confirmed')->default(false);
            }

            if (!Schema::hasColumn('booking_checking', 'customer_confirmed')) {
                $table->boolean('customer_confirmed')->default(false);
            }

            if (!Schema::hasColumn('booking_checking', 'owner_data')) {
                $table->json('owner_data')->nullable();
            }

            if (!Schema::hasColumn('booking_checking', 'customer_data')) {
                $table->json('customer_data')->nullable();
            }

            if (!Schema::hasColumn('booking_checking', 'status')) {
                $table->string('status')->default('waiting_customer');
            }
        });
    }

    public function down(): void
    {
        Schema::table('booking_checking', function (Blueprint $table) {
            $table->dropColumn([
                'owner_confirmed',
                'customer_confirmed',
                'owner_data',
                'customer_data',
                'status'
            ]);
        });
    }
};
