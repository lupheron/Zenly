<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('user_blocks', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->timestamp('blocked_at');
            $table->timestamp('blocked_until');
            $table->string('reason');
            $table->json('details')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->timestamps();

            $table->index(['user_id', 'blocked_until']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('user_blocks');
    }
};
