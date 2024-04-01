import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  middleName: string;
  @Column({ unique: true })
  email: string;
  @Column()
  password: string;
  // @Column({ type: 'date' })
  // birthDay: Date;
}
