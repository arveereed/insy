<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PostCredential extends Model
{
    use HasFactory;

    protected $fillable = [
        'apartment_name',
        'role',
        'company_id',
        'license_id',
        'property_title',
        'business_permit',
    ];

    public function user() : BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
