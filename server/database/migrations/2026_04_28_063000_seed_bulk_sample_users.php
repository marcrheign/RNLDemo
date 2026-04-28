<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

return new class extends Migration
{
    public function up(): void
    {
        $alreadySeeded = DB::table('tbl_users')
            ->where('username', 'like', 'sampleuser%')
            ->exists();

        if ($alreadySeeded) {
            return;
        }

        $firstNames = [
            'Aaron', 'Abigail', 'Adrian', 'Aileen', 'Albert', 'Alexa', 'Alice', 'Alyssa', 'Amanda', 'Andre',
            'Angela', 'Anna', 'Anthony', 'Arnold', 'Ashley', 'Audrey', 'Barry', 'Bea', 'Ben', 'Bianca',
            'Brandon', 'Brenda', 'Bryan', 'Camille', 'Carl', 'Carla', 'Cedric', 'Chloe', 'Christian', 'Claire',
            'Daniel', 'Daphne', 'David', 'Diana', 'Dominic', 'Elaine', 'Eleanor', 'Elijah', 'Ella', 'Ethan',
            'Faith', 'Felix', 'Frances', 'Gabriel', 'Gail', 'Grace', 'Hannah', 'Hazel', 'Ian', 'Iris',
            'Isaac', 'Isabel', 'Jared', 'Jasmine', 'Jeremy', 'Jessica', 'Joel', 'John', 'Jonas', 'Julia',
            'Justin', 'Karen', 'Keith', 'Kevin', 'Kyle', 'Lara', 'Leah', 'Liam', 'Liza', 'Marcus',
            'Maria', 'Mark', 'Megan', 'Mia', 'Nathan', 'Nicole', 'Noah', 'Olivia', 'Paolo', 'Patricia',
            'Paul', 'Phoebe', 'Ralph', 'Ramon', 'Samantha'
        ];

        $lastNames = [
            'Anderson', 'Bautista', 'Carter', 'Castro', 'Cruz', 'Davis', 'Delos Santos', 'Diaz', 'Edwards', 'Evans',
            'Flores', 'Garcia', 'Gonzales', 'Gray', 'Gutierrez', 'Hall', 'Harris', 'Hernandez', 'Howard', 'Jackson',
            'James', 'Johnson', 'King', 'Lee', 'Lewis', 'Lopez', 'Martinez', 'Miller', 'Mitchell', 'Moore',
            'Morgan', 'Morris', 'Murphy', 'Nelson', 'Nguyen', 'Parker', 'Perez', 'Peterson', 'Ramirez', 'Reed',
            'Reyes', 'Richardson', 'Rivera', 'Roberts', 'Robinson', 'Rodriguez', 'Rogers', 'Ross', 'Ruiz', 'Sanchez',
            'Scott', 'Serrano', 'Smith', 'Stewart', 'Taylor', 'Thomas', 'Torres', 'Turner', 'Walker', 'Ward',
            'Watson', 'White', 'Williams', 'Wilson', 'Wright'
        ];

        $middleNames = ['A.', 'B.', 'C.', 'D.', 'E.', 'F.', null, null, null];
        $suffixes = [null, null, null, 'Jr.', 'Sr.', 'III'];
        $genderIds = DB::table('tbl_genders')
            ->where('is_deleted', false)
            ->pluck('gender_id')
            ->values()
            ->all();

        $users = [];

        for ($i = 0; $i < 85; $i++) {
            $firstName = $firstNames[$i % count($firstNames)];
            $lastName = $lastNames[$i % count($lastNames)];
            $age = 18 + ($i % 43);
            $birthDate = now()
                ->subYears($age)
                ->subDays(($i * 7) % 365)
                ->toDateString();

            $users[] = [
                'first_name' => $firstName,
                'middle_name' => $middleNames[$i % count($middleNames)],
                'last_name' => $lastName,
                'suffix_name' => $suffixes[$i % count($suffixes)],
                'gender_id' => count($genderIds) > 0 ? $genderIds[$i % count($genderIds)] : null,
                'birth_date' => $birthDate,
                'username' => 'sampleuser' . ($i + 1),
                'password' => Hash::make('password'),
                'is_deleted' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        DB::table('tbl_users')->insert($users);
    }

    public function down(): void
    {
        DB::table('tbl_users')
            ->where('username', 'like', 'sampleuser%')
            ->delete();
    }
};
