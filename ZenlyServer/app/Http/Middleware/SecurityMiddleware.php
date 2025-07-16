<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Services\SecurityService;

class SecurityMiddleware
{
    protected $securityService;

    public function __construct(SecurityService $securityService)
    {
        $this->securityService = $securityService;
    }

    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        // Skip security check for unauthenticated users
        if (!$user) {
            return $next($request);
        }

        // Get controller and action from route
        $route = $request->route();
        $controller = $this->getControllerName($route);
        $action = $this->getActionName($route);

        // Skip if no controller/action identified
        if (!$controller || !$action) {
            return $next($request);
        }

        // Check user activity
        $securityCheck = $this->securityService->checkUserActivity(
            $user->id,
            $controller,
            $action,
            $request->all()
        );

        if ($securityCheck['blocked']) {
            return response()->json([
                'message' => $securityCheck['message'],
                'status' => 429,
                'blocked_until' => $securityCheck['blocked_until'] ?? null,
                'violations' => $securityCheck['violations'] ?? null
            ], 429);
        }

        return $next($request);
    }

    private function getControllerName($route)
    {
        if (!$route) return null;

        $action = $route->getAction();

        if (isset($action['controller'])) {
            $controller = $action['controller'];
            $parts = explode('@', $controller);
            $controllerClass = $parts[0];

            // Extract controller name from full class path
            $controllerName = class_basename($controllerClass);

            return $controllerName;
        }

        return null;
    }

    private function getActionName($route)
    {
        if (!$route) return null;

        $action = $route->getAction();

        if (isset($action['controller'])) {
            $controller = $action['controller'];
            $parts = explode('@', $controller);
            return $parts[1] ?? null;
        }

        return null;
    }
}
