<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AddCoordinatesToPostsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Uzbekistan regions with sample coordinates
        $regionCoordinates = [
            'Andijon' => ['lat' => 40.7756, 'lng' => 72.3441],
            'Buxoro' => ['lat' => 39.7756, 'lng' => 64.4286],
            'Fargʻona' => ['lat' => 40.3864, 'lng' => 71.7864],
            'Jizzax' => ['lat' => 40.1158, 'lng' => 67.8422],
            'Xorazm' => ['lat' => 41.5279, 'lng' => 60.6235],
            'Namangan' => ['lat' => 40.9983, 'lng' => 71.6726],
            'Navoiy' => ['lat' => 40.0844, 'lng' => 65.3792],
            'Qashqadaryo' => ['lat' => 38.8406, 'lng' => 65.7942],
            'Qoraqalpogʻiston' => ['lat' => 43.7500, 'lng' => 59.0000],
            'Samarqand' => ['lat' => 39.6547, 'lng' => 66.9597],
            'Sirdaryo' => ['lat' => 40.8439, 'lng' => 68.6617],
            'Surxondaryo' => ['lat' => 37.9409, 'lng' => 67.5709],
            'Toshkent viloyati' => ['lat' => 41.2213, 'lng' => 69.8597],
            'Toshkent shahri' => ['lat' => 41.2995, 'lng' => 69.2401]
        ];

        // Get all posts that don't have coordinates
        $posts = DB::table('posts')
            ->whereNull('latitude')
            ->whereNull('longitude')
            ->get();

        foreach ($posts as $post) {
            // Add some random variation to coordinates within the region
            if (isset($regionCoordinates[$post->location])) {
                $baseCoords = $regionCoordinates[$post->location];
                
                // Add small random variation (±0.1 degrees)
                $latitude = $baseCoords['lat'] + (rand(-100, 100) / 1000);
                $longitude = $baseCoords['lng'] + (rand(-100, 100) / 1000);
                
                DB::table('posts')
                    ->where('id', $post->id)
                    ->update([
                        'latitude' => $latitude,
                        'longitude' => $longitude
                    ]);
            }
        }

        $this->command->info('Coordinates added to ' . $posts->count() . ' posts.');
    }
}
