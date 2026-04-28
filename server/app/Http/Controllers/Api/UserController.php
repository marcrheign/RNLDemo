<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function loadUsers()
    {
        $users = User::leftJoin('tbl_genders', 'tbl_users.gender_id', '=', 'tbl_genders.gender_id')
            ->where('tbl_users.is_deleted', false)
            ->select('tbl_users.*', 'tbl_genders.gender as gender_name')
            ->orderByDesc('tbl_users.id')
            ->paginate(15);

        return response()->json([
            'users' => $users->items(),
            'current_page' => $users->currentPage(),
            'last_page' => $users->lastPage(),
            'has_more' => $users->hasMorePages(),
            'total' => $users->total(),
        ], 200);
    }

    public function storeUser(Request $request)
    {
        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:50'],
            'middle_name' => ['nullable', 'string', 'max:50'],
            'last_name' => ['required', 'string', 'max:50'],
            'suffix_name' => ['nullable', 'string', 'max:20'],
            'gender_id' => ['required', 'integer', 'exists:tbl_genders,gender_id'],
            'birth_date' => ['required', 'date'],
            'username' => ['required', 'string', 'min:3', 'max:50', 'unique:tbl_users,username'],
            'password' => ['required', 'string', 'min:6', 'confirmed'],
        ]);

        User::create([
            'first_name' => $validated['first_name'],
            'middle_name' => $validated['middle_name'] ?? null,
            'last_name' => $validated['last_name'],
            'suffix_name' => $validated['suffix_name'] ?? null,
            'gender_id' => $validated['gender_id'],
            'birth_date' => $validated['birth_date'],
            'username' => $validated['username'],
            'password' => $validated['password'],
        ]);

        return response()->json([
            'message' => 'User Successfully Saved.',
        ], 200);
    }

    public function getUser($userId)
    {
        $user = User::where('is_deleted', false)
            ->find($userId);

        if (!$user) {
            return response()->json([
                'message' => 'User not found.',
            ], 404);
        }

        return response()->json([
            'user' => $user,
        ], 200);
    }

    public function updateUser(Request $request, $userId)
    {
        $user = User::where('is_deleted', false)
            ->find($userId);

        if (!$user) {
            return response()->json([
                'message' => 'User not found.',
            ], 404);
        }

        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:50'],
            'middle_name' => ['nullable', 'string', 'max:50'],
            'last_name' => ['required', 'string', 'max:50'],
            'suffix_name' => ['nullable', 'string', 'max:20'],
            'gender_id' => ['required', 'integer', 'exists:tbl_genders,gender_id'],
            'birth_date' => ['required', 'date'],
            'username' => ['required', 'string', 'min:3', 'max:50', 'unique:tbl_users,username,' . $user->id],
        ]);

        $user->update([
            'first_name' => $validated['first_name'],
            'middle_name' => $validated['middle_name'] ?? null,
            'last_name' => $validated['last_name'],
            'suffix_name' => $validated['suffix_name'] ?? null,
            'gender_id' => $validated['gender_id'],
            'birth_date' => $validated['birth_date'],
            'username' => $validated['username'],
        ]);

        return response()->json([
            'message' => 'User Successfully Updated.',
        ], 200);
    }

    public function deleteUser($userId)
    {
        $user = User::where('is_deleted', false)
            ->find($userId);

        if (!$user) {
            return response()->json([
                'message' => 'User not found.',
            ], 404);
        }

        $user->update([
            'is_deleted' => true,
        ]);

        return response()->json([
            'message' => 'User Successfully Deleted.',
        ], 200);
    }
}
