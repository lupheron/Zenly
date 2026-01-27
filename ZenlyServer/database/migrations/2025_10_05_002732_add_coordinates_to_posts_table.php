<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('posts', function (Blueprint $table) {

            if (!Schema::hasColumn('posts', 'latitude')) {
                $table->decimal('latitude', 10, 8)
                      ->nullable()
                      ->after('location');
            }

            if (!Schema::hasColumn('posts', 'longitude')) {
                $table->decimal('longitude', 11, 8)
                      ->nullable()
                      ->after('latitude');
            }
        });
    }

    public function down(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            if (Schema::hasColumn('posts', 'latitude')) {
                $table->dropColumn('latitude');
            }

            if (Schema::hasColumn('posts', 'longitude')) {
                $table->dropColumn('longitude');
            }
        });
    }
};
