import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
export class CreateUserDto {

    @ApiProperty({
        description: 'Nombre del nuevo usuario', 
        type: String,
    })
    username: string;

    @ApiProperty({
        description: 'contraseña del nuevo usuario', 
        type: String,
    })
    password: string;

    @ApiProperty({
        description: 'edad del nuevo usuario [opcional]', 
        type: Number,
    })
    age? : number;
}