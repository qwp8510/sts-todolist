import { ApiProperty } from "@nestjs/swagger";
import { UserResponse } from "src/user/dto";

export class AuthDto {
  @ApiProperty({
    description: 'username',
    minimum: 1,
  })
  username: string;

  @ApiProperty({
    description: 'password',
    minimum: 1,
  })
  password: string;
}

export class AuthResponse {
  @ApiProperty()
  token: string;

  @ApiProperty()
  user: UserResponse;
}
