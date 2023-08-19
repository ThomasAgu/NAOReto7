import { ApiProperty } from "@nestjs/swagger";
export class UpdateUserDto {

    @ApiProperty({
    description: 'Nombre del usuario', 
    type: String,
    })
    username?: string;

    @ApiProperty({
      description: 'contraseña del usuario actualizada', 
      type: String,
    })
    password?: string;
  }