<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        // Add timestamps to tables that don't have them
        $tables = [
            'rating',
            'post_comments',
            'post_views',
            'features',
            'gallery',
            'comments'
        ];

        foreach ($tables as $tableName) {
            if (Schema::hasTable($tableName) && !Schema::hasColumn($tableName, 'created_at')) {
                Schema::table($tableName, function (Blueprint $table) {
                    $table->timestamps();
                });
            }
        }

        // Add performance indexes (using try-catch to avoid duplicate index errors)
        if (Schema::hasTable('posts')) {
            try {
                Schema::table('posts', function (Blueprint $table) {
                    $table->index(['user_id', 'created_at'], 'posts_user_id_created_at_index');
                });
            } catch (\Exception $e) {
                // Index might already exist, ignore
            }
        }

        if (Schema::hasTable('post_comments')) {
            try {
                Schema::table('post_comments', function (Blueprint $table) {
                    $table->index(['user_id', 'created_at'], 'post_comments_user_id_created_at_index');
                });
            } catch (\Exception $e) {
                // Index might already exist, ignore
            }
        }

        if (Schema::hasTable('rating')) {
            try {
                Schema::table('rating', function (Blueprint $table) {
                    $table->index(['user_id', 'created_at'], 'rating_user_id_created_at_index');
                });
            } catch (\Exception $e) {
                // Index might already exist, ignore
            }
        }

        if (Schema::hasTable('post_views')) {
            try {
                Schema::table('post_views', function (Blueprint $table) {
                    $table->index(['user_id', 'created_at'], 'post_views_user_id_created_at_index');
                });
            } catch (\Exception $e) {
                // Index might already exist, ignore
            }
        }

        if (Schema::hasTable('gallery')) {
            try {
                Schema::table('gallery', function (Blueprint $table) {
                    $table->index(['user_id', 'created_at'], 'gallery_user_id_created_at_index');
                });
            } catch (\Exception $e) {
                // Index might already exist, ignore
            }
        }

        if (Schema::hasTable('features')) {
            try {
                Schema::table('features', function (Blueprint $table) {
                    $table->index(['user_id', 'created_at'], 'features_user_id_created_at_index');
                });
            } catch (\Exception $e) {
                // Index might already exist, ignore
            }
        }
    }

    public function down()
    {
        $tables = ['rating', 'post_comments', 'post_views', 'features', 'gallery', 'comments'];

        foreach ($tables as $tableName) {
            if (Schema::hasTable($tableName)) {
                Schema::table($tableName, function (Blueprint $table) {
                    $table->dropTimestamps();
                });
            }
        }

        // Drop indexes
        $indexes = [
            'posts' => 'posts_user_id_created_at_index',
            'post_comments' => 'post_comments_user_id_created_at_index',
            'rating' => 'rating_user_id_created_at_index',
            'post_views' => 'post_views_user_id_created_at_index',
            'gallery' => 'gallery_user_id_created_at_index',
            'features' => 'features_user_id_created_at_index'
        ];

        foreach ($indexes as $table => $index) {
            if (Schema::hasTable($table)) {
                try {
                    Schema::table($table, function (Blueprint $table) use ($index) {
                        $table->dropIndex($index);
                    });
                } catch (\Exception $e) {
                    // Index might not exist, ignore
                }
            }
        }
    }
};
