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
    userId : string // REALTION FROM AUTH SERVICE I.E. USER
    
    @Column({nullable : true})
    authorName : string

    @CreateDateColumn()
    createdAt : Date;

    @UpdateDateColumn()
    updatedAt : Date;
}