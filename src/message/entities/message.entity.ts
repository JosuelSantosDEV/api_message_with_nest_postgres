import { Person } from "src/people/entities/person.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("messages")
export class MessageEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 255, nullable: false})
    text: string;

    @ManyToOne(() => Person, person => person.messages_send, {onDelete: 'SET NULL', onUpdate: 'CASCADE'})
    @JoinColumn({name: 'of'})
    of: Person;

    @ManyToOne(() => Person, person => person.messages_received, {onDelete: 'SET NULL', onUpdate: 'CASCADE'})
    @JoinColumn({name: 'to'})
    to: Person;

    @Column({nullable: false, default: false})
    wasRead: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}