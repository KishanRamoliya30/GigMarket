import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { ApiError } from './commonError';

type PaginationType = {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

type SuccessResponse<T> = {
  success: true;
  message: string;
  data: T;
  pagination?: PaginationType;
};

type ErrorResponse = {
  success: false;
  message: string;
  errors?: Record<string, string> | { field: string; message: string }[];
};

type MongooseValidationError = {
  name: 'ValidationError';
  errors: Record<
    string,
    {
      message: string;
    }
  >;
};
export type HandlerContext = {
  params?: Record<string, string>;
};

export type ApiHandler<T = unknown> = (
  req: NextRequest,
  context: HandlerContext
) => Promise<NextResponse<T>>;

export function successResponse<T>(
  data: T,
  message = 'Success',
  status = 200,
  pagination: PaginationType | null = null
) {
  const response: SuccessResponse<T> = { success: true, message, data };
  if (pagination) {
    response.pagination = pagination;
  }

  return NextResponse.json(response, { status });
}

export function errorResponse(
  error: unknown,
  status = 500
): ReturnType<typeof NextResponse.json> {
  
  if (error instanceof ZodError) {
    const response: ErrorResponse = {
      success: false,
      message: 'Validation Failed',
      errors: error.errors.map((e) => ({
        field: String(e.path[0]),
        message: e.message,
      })),
    };
    return NextResponse.json(response, { status: 400 });
  }

  if (
    typeof error === 'object' &&
    error !== null &&
    (error as MongooseValidationError).name === 'ValidationError'
  ) {
    const errObj = error as MongooseValidationError;
    const errors: Record<string, string> = {};

    for (const field in errObj.errors) {
      errors[field] = errObj.errors[field].message;
    }

    const response: ErrorResponse = {
      success: false,
      message: 'Validation Error',
      errors,
    };

    return NextResponse.json(response, { status: 422 });
  }

  const customStatus = error instanceof ApiError ? error.status : status;

  const response: ErrorResponse = {
    success: false,
    message: error instanceof ApiError ? error.message : 'Something went wrong',
  };

  return NextResponse.json(response, { status: customStatus });
}

export function withApiHandler<T>(handler: ApiHandler<T>) {
  return async (
    req: NextRequest,
    context: HandlerContext = {}
  ): Promise<NextResponse<T>> => {
    try {
      return await handler(req, context);
    } catch (err) {
      console.error('API Error:', err);
      return errorResponse(err) as NextResponse<T>;
    }
  };
}