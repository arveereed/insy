<?php

namespace App\Http\Controllers;

use App\Models\PostCredential;
use App\Http\Requests\UpdatePostCredentialRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class PostCredentialController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('auth:sanctum', except: ['index']),
        ];
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return PostCredential::with('user')->latest()->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
{
    // Validate input
    $fields = $request->validate([
        'apartmentName' => ['required', 'string'],
        'role' => ['required', 'string'],
        'companyId' => ['nullable', 'string'], // Expecting Base64 string
        'licenseId' => ['nullable', 'string'], // Expecting Base64 string
        'propertyTitle' => ['nullable', 'string'], // Expecting Base64 string
        'businessPermit' => ['nullable', 'string'], // Expecting Base64 string
    ]);

    // Log the received fields for debugging
    // \Log::debug('Received fields: ', $fields);

    // Helper function to decode and store images
    $saveImage = function ($base64Image, $folder) {
        try {
            if (!$base64Image) {
                return null;
            }

            // Strip off the data URL prefix (e.g., "data:image/png;base64,")
            if (strpos($base64Image, 'base64,') !== false) {
                $imageData = explode('base64,', $base64Image)[1];
            } else {
                // If it's already just base64, directly use it
                $imageData = $base64Image;
            }

            // Log Base64 Image Data for debugging
            // \Log::debug('Base64 Image Data: ', ['data' => $imageData]);

            // Decode Base64 image data
            $decodedImage = base64_decode($imageData);

            if ($decodedImage === false) {
                // \Log::error('Failed to decode Base64 image data.');
                return null; // If decoding fails, return null
            }

            // Generate a unique file name
            $imageName = uniqid() . '.png';

            // Store the file in public storage
            Storage::disk('public')->put("credentials/{$folder}/{$imageName}", $decodedImage);

            // Log image file path for debugging
            // \Log::debug('Saved image path: ', ['path' => "credentials/{$folder}/{$imageName}"]);

            // Return the file path
            return "credentials/{$folder}/{$imageName}";
        } catch (\Exception $e) {
            // Log error for debugging
            // \Log::error("Image processing error: " . $e->getMessage());
            return null;
        }
    };

    // Process each image field
    $fields['companyId'] = $saveImage($fields['companyId'], 'company_ids');
    $fields['licenseId'] = $saveImage($fields['licenseId'], 'licenses');
    $fields['propertyTitle'] = $saveImage($fields['propertyTitle'], 'property_titles');
    $fields['businessPermit'] = $saveImage($fields['businessPermit'], 'business_permits');

    // Save post
    $post = $request->user()->postsCreds()->create([
        'apartment_name' => $fields['apartmentName'],
        'role' => $fields['role'],
        'company_id' => $fields['companyId'],
        'license_id' => $fields['licenseId'],
        'property_title' => $fields['propertyTitle'],
        'business_permit' => $fields['businessPermit'],
    ]);

    // Return response
    return response()->json([
        'post' => $post,
        'user' => $post->user,
        'image_urls' => array_filter([
            'companyId' => $fields['companyId'] ? asset("storage/{$fields['companyId']}") : null,
            'licenseId' => $fields['licenseId'] ? asset("storage/{$fields['licenseId']}") : null,
            'propertyTitle' => $fields['propertyTitle'] ? asset("storage/{$fields['propertyTitle']}") : null,
            'businessPermit' => $fields['businessPermit'] ? asset("storage/{$fields['businessPermit']}") : null,
        ]),
    ]);
}

/**
 * Display the specified resource.
 */
/**
 * Display the specified resource.
 */
    public function show(Request $request, $id)
    {
        // Retrieve the authenticated user
        $user = $request->user();

        // Retrieve the PostCredential record by its ID and ensure it belongs to the authenticated user
        $postCredential = PostCredential::with('user')
            ->where('id', $id)
            ->where('user_id', $user->id)
            ->first();

        // If the PostCredential does not exist or does not belong to the user, return a 404 response
        if (!$postCredential) {
            return response()->json(['error' => 'PostCredential not found or does not belong to the authenticated user'], 404);
        }

        // Return the PostCredential data along with associated user information
        return response()->json([
            'postCredential' => $postCredential,
            'user' => $postCredential->user,
        ]);
    }




    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePostCredentialRequest $request, PostCredential $postCredential)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PostCredential $postCredential)
    {
        //
    }
}
