import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import dbConnect from "@/app/lib/dbConnect";
import { generateToken } from "@/app/utils/jwt";
import Terms from "@/app/models/terms";
import User from "@/app/models/user";
import { expiryTime } from "../../../../../utils/constants";
interface LoginRequestBody {
  email: string;
  password: string;
}

interface LoginResponseSuccess {
  message: string;
  success: boolean;
  user: {
    id: string;
    email: string;
  };
  needToAcceptTerms: boolean;
  hasSubscription?: boolean;
  terms: string
}

interface LoginResponseError {
  error: string;
}

export async function POST(request: NextRequest): Promise<Response> {
  try {
    await dbConnect();
    const reqBody: LoginRequestBody = await request.json();
    const { email, password } = reqBody;

    if (!email || !password) {
      return NextResponse.json<LoginResponseError>(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }


    const user = await User.findOne({ email })
    if (!user || user.isAdmin) {
      return NextResponse.json<LoginResponseError>(
        { error: "Invalid credentials. Please try again." },
        { status: 401 }
      );
    }


    const isPasswordMatch = await bcryptjs.compare(password, user.password);
    if (!isPasswordMatch) {
      return NextResponse.json<LoginResponseError>(
        { error: "Invalid credentials. Please try again." },
        { status: 401 }
      );
    }
 
      
    const terms = await Terms.findOne({});

    const userAcceptedAt = user.termsAcceptedAt ;
    const termsUpdatedAt = terms?.updatedAt;
    let needToAcceptTerms = true;
    if(userAcceptedAt && termsUpdatedAt){
      needToAcceptTerms = new Date(userAcceptedAt) < new Date(termsUpdatedAt);
    } 

    if(needToAcceptTerms){
      return NextResponse.json<LoginResponseSuccess>({
        message: "Please Accept terms",
        success: true,
        user: {
          id: user._id,
          email: user.email
        },
        needToAcceptTerms: true,
        terms:terms.content
      });
    }
    else{
      const token = generateToken({
        userId: user._id,
        email: user.email,
        role: "User"
      });
      const response = NextResponse.json<LoginResponseSuccess>({
        message: "Login successful.",
        success: true,
        user: {
          id: user._id,
          email: user.email
        },
        hasSubscription: user.subscriptionCompleted,
        needToAcceptTerms: needToAcceptTerms,
        terms: needToAcceptTerms?terms.content:""
      });
      
      response.cookies.set({
        name: 'token',
        value: token,
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        path: '/',
        maxAge: expiryTime,
      });
      return response;
    }
  } catch (error: unknown) {
    let errorMessage = "An unexpected error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json<LoginResponseError>(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
