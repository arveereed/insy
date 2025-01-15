<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('offer_type');
            $table->text('property_type');
            $table->json('images')->nullable();
            $table->text('body');
            $table->integer('bedrooms');
            $table->integer('bathrooms');
            $table->text('floor_squaremeter');
            $table->text('lot_squaremeter');
            $table->text('address');
            $table->text('price');
            $table->text('seller_name');
            $table->text('email');
            $table->text('mobile_number');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
