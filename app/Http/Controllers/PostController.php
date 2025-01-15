<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('auth:sanctum', except: ['index', 'show']),
        ];
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Post::with('user')->latest()->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $fields = $request->validate([
            'title' => ['required', 'max:35'],
            'body' => ['required'],
            'images' => ['nullable', 'array'], // Accept an array of images
            'images.*' => ['string'], // Each image must be a Base64 string
            'offerType' => ['required'],
            'propertyType' => ['required'],
            'bedrooms' => ['required', 'numeric'],
            'bathrooms' => ['required', 'numeric'],
            'floorSquaremeter' => ['required'],
            'lotSquaremeter' => ['required'],
            'address' => ['required'],
            'price' => ['required'],
            'sellerName' => ['required', 'max:255'],
            'email' => ['required', 'email'],
            'mobileNumber' => ['required', 'digits:11', 'numeric'],
        ]);

        $uploadedImages = [];

        if (!empty($request->images)) {
            foreach ($request->images as $base64Image) {
                // Decode Base64 string
                $imageData = explode(',', $base64Image);
                $decodedImage = base64_decode($imageData[1]);

                // Generate a unique file name
                $imageName = uniqid() . '.png';

                // Store the file in the public storage
                Storage::disk('public')->put("uploads/{$imageName}", $decodedImage);

                // Add the file path to the array of uploaded images
                $uploadedImages[] = "uploads/{$imageName}";
            }
        }

        // Save post with images
        $fields['images'] = $uploadedImages; // Add image paths as an array

        $post = $request->user()->posts()->create([
            'title' => $fields['title'],
            'body' => $fields['body'],
            'images' => json_encode($uploadedImages), // Store as JSON in the database
            'offer_type' => $fields['offerType'],
            'property_type' => $fields['propertyType'],
            'bedrooms' => $fields['bedrooms'],
            'bathrooms' => $fields['bathrooms'],
            'floor_squaremeter' => $fields['floorSquaremeter'],
            'lot_squaremeter' => $fields['lotSquaremeter'],
            'address' => $fields['address'],
            'price' => $fields['price'],
            'seller_name' => $fields['sellerName'],
            'email' => $fields['email'],
            'mobile_number' => $fields['mobileNumber'],
        ]);

        return [
            'post' => $post,
            'user' => $post->user,
            'images_urls' => array_map(fn($path) => asset("storage/{$path}"), $uploadedImages),
        ];
    }

    /**
     * Display the specified resource.
     */
    public function show(Post $post)
    {
        return [
            'post' => $post,
            'user' => $post->user,
            'images' => json_decode($post->images, true), // Decode images for output
        ];
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Post $post)
    {
        Gate::authorize('modify', $post);

        $fields = $request->validate([
            'title' => ['required', 'max:255'],
            'body' => ['required'],
        ]);

        $post->update($fields);

        return [
            'post' => $post,
            'user' => $post->user,
        ];
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Post $post)
    {
        Gate::authorize('modify', $post);

        // Delete associated images
        $images = json_decode($post->images, true);
        if (!empty($images)) {
            foreach ($images as $imagePath) {
                if (Storage::disk('public')->exists($imagePath)) {
                    Storage::disk('public')->delete($imagePath);
                }
            }
        }

        // Delete the post record from the database
        $post->delete();

        return ['message' => 'The post and its associated images were deleted.'];
    }
}
