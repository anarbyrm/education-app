import { ChildEntity, Column } from 'typeorm';
import { User } from './user.entity';

@ChildEntity()
export class Admin extends User {
    // superuser | editor
    @Column({ default: 'editor'})
    role: string
}
