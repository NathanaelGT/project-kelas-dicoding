import type { Context } from 'hono';
import type { StatusCode } from 'hono/utils/http-status';

type CreateSuccessResponse<T> = {
  message?: string;
  data: T;
  status?: StatusCode;
};

export const success = <T>(c: Context, response: CreateSuccessResponse<T>) => {
  const { status, ...formattedResponse } = response;

  // @ts-expect-error
  formattedResponse.status = 'success';

  return c.json(formattedResponse, status);
};

export const fail = (c: Context, message: string, status: StatusCode) => {
  return c.json(
    {
      status: 'fail',
      message,
    },
    status,
  );
};
