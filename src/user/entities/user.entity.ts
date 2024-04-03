import { 
    Column, 
    PrimaryGeneratedColumn, 
    CreateDateColumn,
    UpdateDateColumn,
    TableInheritance, 
    Entity,
    BaseEntity,
} from 'typeorm';


@Entity()
@TableInheritance({ column: {type: 'varchar', name: 'type'} })
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    firstName: string;

    @Column({ nullable: true })
    lastName: string;

    @Column({ nullable: true })
    bio: string;
    
    @Column({ nullable: true })
    photo: string;

    @Column({ default: false })
    isActive: boolean;

    @Column({ default: false })
    isFrozen: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}