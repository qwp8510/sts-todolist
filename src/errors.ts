import { HttpException, HttpStatus } from "@nestjs/common";

export class ClientException extends HttpException {
  code = "ClientException";

  constructor(
    code: string,
    message: string,
  ) {
    super(message, HttpStatus.BAD_REQUEST);
    this.code = code;
  }
}