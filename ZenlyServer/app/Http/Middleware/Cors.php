<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class Cors
{
    public function handle(Request $request, Closure $next): Response
    {
        // Set CORS headers for all requests
        $headers = [
            'Access-Control-Allow-Origin' => '*',
            'Access-Control-Allow-Methods' => 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers' => 'Content-Type, Authorization, X-Requested-With, Accept',
        ];

        // Handle preflight OPTIONS request
        if ($request->isMethod('OPTIONS')) {
            return response('', 200, $headers);
        }

        // Continue with the request
        $response = $next($request);

        // Add headers to response
        foreach ($headers as $key => $value) {
            $response->headers->set($key, $value);
        }

        return $response;
    }
}