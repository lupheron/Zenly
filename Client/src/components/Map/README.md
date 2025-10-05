# Map Integration Component

This directory contains the map integration functionality for the Zenly website, allowing users to explore services across Uzbekistan through an interactive map interface.

## Components

### 1. `index.tsx` (Main Map Component)
- **Purpose**: Main container component that orchestrates the entire map functionality
- **Features**:
  - Service type filtering (radio buttons)
  - Region selection dropdown
  - Posts fetching and state management
  - Layout with 70% map and 30% sidebar

### 2. `MapControls.tsx`
- **Purpose**: Top section with filtering controls
- **Features**:
  - Service type radio buttons (All Services, Monuments, Restaurants, etc.)
  - Uzbekistan regions dropdown
  - Active filters display
  - Responsive design

### 3. `InteractiveMap.tsx`
- **Purpose**: The main map visualization
- **Features**:
  - Fallback map component (works without Google Maps API)
  - Service type color coding
  - Posts visualization with markers
  - Google Maps integration ready (when API key is provided)
  - Loading states and error handling

### 4. `MapPostsSidebar.tsx`
- **Purpose**: Right sidebar showing filtered posts
- **Features**:
  - Post cards with images, ratings, and prices
  - Responsive design
  - Links to individual post pages
  - Empty states and loading indicators

### 5. `types.ts`
- **Purpose**: TypeScript type definitions
- **Exports**:
  - `MapPost`: Post data structure with coordinates
  - `AreaType`: Service type structure
  - `MapBounds`: Map boundary coordinates
  - `UzbekistanRegion`: Region data structure

### 6. `useMapPosts.ts` (Hook)
- **Purpose**: API integration hook
- **Features**:
  - Fetches posts for map display
  - Fetches posts for sidebar
  - Query caching and optimization
  - Error handling

## API Endpoints

The map functionality uses these new API endpoints:

### 1. `/api/map/posts`
- **Method**: GET
- **Parameters**:
  - `area_id` (optional): Filter by service type
  - `region` (optional): Filter by region
  - `bounds` (optional): Filter by map bounds
- **Returns**: Posts with coordinates for map display

### 2. `/api/map/posts-by-region`
- **Method**: GET
- **Parameters**:
  - `area_id` (optional): Filter by service type
  - `region` (optional): Filter by region
- **Returns**: Posts for sidebar display (limited to 10)

### 3. `/api/map/regions`
- **Method**: GET
- **Returns**: Uzbekistan regions with coordinates

## Database Requirements

### Migration Required
You need to run this migration to add coordinates to posts:

```bash
php artisan make:migration add_coordinates_to_posts_table
```

**Migration Content:**
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->decimal('latitude', 10, 8)->nullable()->after('location');
            $table->decimal('longitude', 11, 8)->nullable()->after('latitude');
        });
    }

    public function down()
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->dropColumn(['latitude', 'longitude']);
        });
    }
};
```

Then run:
```bash
php artisan migrate
```

## Environment Setup

### Google Maps API Key (Optional)
To enable full Google Maps functionality, add to your `.env` file:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

**Get API Key:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/google/maps-apis)
2. Create a new project or select existing
3. Enable Maps JavaScript API
4. Create credentials (API Key)
5. Restrict the API key to your domain

## Service Types & Colors

The map uses these service types with corresponding colors:

- **Monuments**: Red (#FF6B6B)
- **Restaurants**: Teal (#4ECDC4)
- **Guest Houses**: Blue (#45B7D1)
- **Eco Travel Zones**: Green (#96CEB4)
- **Hotels**: Yellow (#FFEAA7)
- **Resorts**: Plum (#DDA0DD)

## Usage

The map component is already integrated into the landing page. Users can:

1. **Select a region** from the dropdown to focus the map
2. **Choose a service type** to filter posts
3. **View posts on the map** with color-coded markers
4. **Browse posts in the sidebar** with detailed information
5. **Click on posts** to view full details

## Features

### ✅ Implemented
- [x] Service type filtering
- [x] Region selection
- [x] Posts display on map (fallback)
- [x] Posts sidebar
- [x] Responsive design
- [x] Loading states
- [x] API integration
- [x] Database structure

### 🔄 Ready for Enhancement
- [ ] Google Maps integration (requires API key)
- [ ] Real-time marker updates
- [ ] Cluster markers for dense areas
- [ ] Advanced filtering options
- [ ] Map styles customization

## Troubleshooting

### Common Issues

1. **Map not showing posts**: Ensure posts have latitude/longitude coordinates
2. **API errors**: Check if the Laravel server is running and API routes are accessible
3. **Google Maps not loading**: Verify API key is correctly set in environment variables

### Development Notes

- The component uses dynamic imports to avoid SSR issues
- Fallback map works without Google Maps API key
- All components are fully typed with TypeScript
- Responsive design works on mobile and desktop
- Posts are cached for 5 minutes to improve performance
