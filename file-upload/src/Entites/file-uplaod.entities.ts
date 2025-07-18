import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()

export class File{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    originalName : string
    
    @Column()
    size : number

    @Column()
    mimeType : string

    @Column()
    url:string
    
    @Column()
    publicId:string

    @Column({nullable:true})
    description:string

    @Column()
    userId:string

    @Column({nullable:true})
    username : string

    @CreateDateColumn()
    created_At : Date
}
