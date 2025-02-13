import { ApiProperty } from "@nestjs/swagger";
import { UserResponse } from "src/user/dto";

export class CreateTeamDto {
  @ApiProperty({
    description: 'team name',
    minimum: 1,
  })
  name: string
}

export class InviteUserToTeamDto {
  @ApiProperty({
    description: 'username',
    minimum: 1,
  })
  username: string
}

export class GetTeamsResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  createdAt?: Date;
  
  @ApiProperty({ required: false })
  updatedAt?: Date;
}

export class GetTeamMemberResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  teamId: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  role: string;

  @ApiProperty({ required: false })
  createdAt?: Date;

  @ApiProperty({ required: false })
  updatedAt?: Date;

  @ApiProperty({ type: UserResponse })
  user: UserResponse;
}

export class GetTeamByIdResponse {
  @ApiProperty()
  team: GetTeamsResponse;

  @ApiProperty({ type: [GetTeamMemberResponse] })
  members: GetTeamMemberResponse[];
}
