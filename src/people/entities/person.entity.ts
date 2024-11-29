import { IsEmail } from "class-validator";
import { MessageEntity } from "src/message/entities/message.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("people")
export class Person {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "varchar", length: 100, nullable: false})
    name: string;

    @IsEmail()
    @Column({type: "varchar", length: 100, nullable: false, unique: true})
    email: string;

    @Column({ nullable: false, length: 255})
    password: string;

    @OneToMany(() => MessageEntity, message => message.of)
    messages_send: MessageEntity[]

    @OneToMany(() => MessageEntity, message => message.to)
    messages_received: MessageEntity[]

    @CreateDateColumn()
    created_at?: Date;

    @UpdateDateColumn()
    updated_at?: Date;
}
