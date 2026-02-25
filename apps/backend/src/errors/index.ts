export class AppError extends Error {
  constructor(
    public statusCode: number,
    public errorCode: string,
    message: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class BadRequestError extends AppError {
  constructor(message = "잘못된 요청입니다") {
    super(400, "BAD_REQUEST", message);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "인증이 필요합니다") {
    super(401, "UNAUTHORIZED", message);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "리소스를 찾을 수 없습니다") {
    super(404, "NOT_FOUND", message);
  }
}

export class ConflictError extends AppError {
  constructor(message = "리소스가 이미 존재합니다") {
    super(409, "CONFLICT", message);
  }
}

export class TooManyAttemptsError extends AppError {
  public retryAfter: number;
  constructor(retryAfter = 900) {
    super(429, "TOO_MANY_ATTEMPTS", "로그인 시도 횟수를 초과했습니다. 15분 후 다시 시도해주세요");
    this.retryAfter = retryAfter;
  }
}
