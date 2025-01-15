<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'body',
        'images',
        'offer_type',
        'property_type',
        'bedrooms',
        'bathrooms',
        'floor_squaremeter',
        'lot_squaremeter',
        'address',
        'price',
        'seller_name',
        'email',
        'mobile_number',
    ];

    public function user() : BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
