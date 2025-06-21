import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity()
export class PostEntity{
    @PrimaryGeneratedColumn()
    id : number

    @Column()
    title:string

    @Column()
    content : string

    @Column()
    userId : string // realtion to user from auth service
    
    @Column({nullable : true})
    authorName : string

     @CreateDateColumn()
    createdAt : Date;

    @UpdateDateColumn()
    updatedAt : Date;
}