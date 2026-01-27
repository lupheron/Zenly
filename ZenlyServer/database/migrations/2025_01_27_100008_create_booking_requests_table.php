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
        Schema::create('booking_requests', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('post_id');
            $table->unsignedBigInteger('user_id');
            $table->datetime('send_date')->nullable();
            $table->string('status', 50)->default('pending'); // pending, active, cancelled
            $table->integer('book_status')->default(1); // 0 or 1
            $table->timestamps();

            $table->index('post_id');
            $table->index('user_id');
            $table->index(['user_id', 'post_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('booking_requests');
    }
};
