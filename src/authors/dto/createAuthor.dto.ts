import { ApiProperty } from "@nestjs/swagger";

export class CreateAuthorDto {
    @ApiProperty({
        description: 'Nombre del autor',
        type: String,
    })
    name: string;
    
    @ApiProperty({
        description: 'Apellido del autor',
        type: String,
    })
    surname: string;
}