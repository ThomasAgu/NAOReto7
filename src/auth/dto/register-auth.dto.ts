import { ApiProperty } from "@nestjs/swagger";
export class RegisterAuthDto {
  @ApiProperty({
    description: 'Nombre de usuario', 
    type: String,
  })
  username: string;

  @ApiProperty({
    description: 'Contraseña del usuario', 
    type: String,
  })
  password: string;
}
