import { ApiProperty } from '@nestjs/swagger';

export class SaludSwaggerDto {
  @ApiProperty({ example: 'ok' })
  status!: string;

  @ApiProperty({ example: 'backend' })
  service!: string;
}
