import { NextResponse } from 'next/server';

// These are now safe on the server side
const ADMIN_USERNAME = "deepresearch@123";
const ADMIN_PASSWORD = "reportscreation@123";

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Check credentials
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      return NextResponse.json(
        { message: 'Login successful' }, 
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: 'Invalid username or password' }, 
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}