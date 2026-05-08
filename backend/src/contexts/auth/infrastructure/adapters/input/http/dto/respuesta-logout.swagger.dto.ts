import { ApiProperty } from '@nestjs/swagger';

export class RespuestaLogoutSwaggerDto {
  @ApiProperty({ example: true })
  ok!: true;
}
