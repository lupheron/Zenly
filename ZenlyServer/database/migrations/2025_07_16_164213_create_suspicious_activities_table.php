<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        if (!Schema::hasTable('suspicious_activities')) {
            Schema::create('suspicious_activities', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('user_id');
                $table->string('activity_type');
                $table->string('controller');
                $table->string('action');
                $table->integer('count')->default(1);
                $table->string('ip_address', 45)->nullable();
                $table->text('user_agent')->nullable();
                $table->json('request_data')->nullable();
                $table->timestamps();

                $table->index(['user_id', 'created_at']);
                $table->index(['controller', 'action', 'created_at']);
            });
        }
    }

    public function down()
    {
        Schema::dropIfExists('suspicious_activities');
    }
};
