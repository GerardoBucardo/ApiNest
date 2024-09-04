import { Role } from "src/roles/entities/role.entity";
import * as bcrypt from 'bcrypt';
import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn, RelationId } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    lastName: string

    @Column()
    email: string

    @Column()
    password: string

    @Column({ default: true})
    isActive: boolean

    @ManyToOne(()=> Role)
    roles: Role;

    @RelationId((user: User) => user.roles)
    roleId: number;

    hashPassword(): void{
        const salt = bcrypt.genSaltSync(10);
        this.password = bcrypt.hashSync(this.password, salt);
    }

    checkPassword(contraseña: string): boolean {
        return bcrypt.compareSync(contraseña, this.password);
    }
}
