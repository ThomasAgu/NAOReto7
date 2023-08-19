import { ApiProperty } from "@nestjs/swagger";

export class CreateBookDto {
    @ApiProperty({
        description: 'Nombre del nuevo libro', 
        type: String,
    })
    name: string;
    
    @ApiProperty({
        description: 'Descripcion del nuevo libro', 
        type: String,
    })
    description: string;

    @ApiProperty({
        description: 'ISBN es un codigo que identifica a una edicion de un libro, 2 libros si tienen el mismo isbn en tonces son el mismo libro y misma edicion', 
        type: String,
    })
    ISBN : string;

    @ApiProperty({
        description: 'Cantidad de ejemplares del libro', 
        type: Number,
    })
    amount: number;

    @ApiProperty({
        description: 'Id del author del libro', 
        type: Number,
    })
    author_id: number;
}