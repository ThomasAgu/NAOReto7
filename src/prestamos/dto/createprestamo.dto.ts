import { ApiProperty } from "@nestjs/swagger";
export class CreatePrestamoDto {
    @ApiProperty({
        description: 'Id del usuario que saco el prestamo', 
        type: Number,
    })
    user_id: number;

    @ApiProperty({
        description: 'Id del libro prestameado', 
        type: Number,
    })
    book_id: number;
}