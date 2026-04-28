<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

return new class extends Migration
{
    public function up(): void
    {
        $exists = DB::table('tbl_users')
            ->where('username', 'johndoe')
            ->exists();

        if ($exists) {
            return;
        }

        DB::table('tbl_users')->insert([
            'first_name' => 'John',
            'middle_name' => null,
            'last_name' => 'Doe',
            'suffix_name' => null,
            'gender_id' => null,
            'birth_date' => '2000-01-01',
            'username' => 'johndoe',
            'password' => Hash::make('password'),
            'is_deleted' => false,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function down(): void
    {
        DB::table('tbl_users')
            ->where('username', 'johndoe')
            ->delete();
    }
};
