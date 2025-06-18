import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import User from "../../models/user";
import dbConnect from "@/app/lib/dbConnect";

interface SignupRequestBody {
    username: string;
    email: string;
    password: string;
}

interface SignupResponseSuccess {
    message: string;
    success: boolean;
    savedUser: unknown;
}

interface SignupResponseError {
    error: string;
}

export async function POST(request: Request): Promise<Response> {
    try {
       await dbConnect();
        const reqBody: SignupRequestBody = await request.json();
        const { username, email, password } = reqBody;

        //check if user already exists
        const user: typeof User | null = await User.findOne({ email });

        if (user) {
            return NextResponse.json<SignupResponseError>(
                { error: "User already exists" },
                { status: 400 }
            );
        }

        //hash password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password : hashedPassword,
        });

        const savedUser: unknown = await newUser.save();

        return NextResponse.json<SignupResponseSuccess>({
            message: "User created successfully",
            success: true,
            savedUser,
        });
    } catch (error: any) {
        return NextResponse.json<SignupResponseError>({ error: error.message }, { status: 500 });
    }
}
