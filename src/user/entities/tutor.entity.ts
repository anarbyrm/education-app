import { ChildEntity, Column } from 'typeorm';
import { User } from './user.entity';

@ChildEntity()
export class Tutor extends User {

}