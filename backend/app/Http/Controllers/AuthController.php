<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validate = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email',
            'password' => 'required|string|min:8'
        ]);

        $exists = User::where('email', $validate['email'])->exists();

        if($exists){
            return response()->json([
                'message' => 'Email Sudah Dipakai',
                'status' => 'error'
            ]);
        }else{
            $user = User::create([
                'name' => $validate['name'],
                'email' => $validate['email'],
                'password' => bcrypt($validate['password'])
            ]);

            return response()->json([
                'message' => 'Berhasil Membuat Akun',
                'user' => $user,
                'status' => 'success'
            ]);
        }

    }

    public function login(Request $request)
    {
        $validate = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string'
        ]);

        if(Auth::attempt($validate)){
            $user = Auth::user();
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'message' => 'Berhasil Login',
                'access_token' => $token,
                'token_type' => 'Bearer',
                'status' => 'success'
            ]);
        }

        return response()->json([
            'message' => "Email atau Password Salah",
            'status' => 'error'
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => "Berhasil Logout",
            'status' => "success"
        ]);
    }

    public function me(Request $request)
    {
        return response()->json([
            'user' => $request->user()
        ]);
    }
}
