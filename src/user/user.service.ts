import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Like, Repository } from 'typeorm';
import { Role } from 'src/roles/entities/role.entity';
import { SearcUserDto } from './dto/search-user.dto';

@Injectable()
export class UserService { 
  constructor( 
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>
  ) {}
  async create({email, name, lastName, password, roleId}: CreateUserDto) {
    try{
      const role = await this.roleRepository.findOne({where: { isActive: true, id: roleId }});
      if(!role){
        return{
          ok: true,
          message: 'role not found',
          status: HttpStatus.NOT_FOUND
        }
      }
      const user = await this.userRepository.create({
        email: email,
        name: name,
        lastName: lastName,
        password: password,
        roles: role
      })
      user.hashPassword();

      await this.userRepository.save(user);
      return{
        ok: true,
        message: 'user created sucessfully',
        status: HttpStatus.CREATED,
        user
      }
    }catch(error){
      throw new NotFoundException(`Ocurrio un error ${error.message}`)
    }
  }

  async findAll({name, lastName, page, limit }: SearcUserDto) {
    try {
      const [users, total] = await this.userRepository.findAndCount({        
        relations:{roles: true},
        where: {
          name: Like(`%${name}%`),
          lastName: Like(`%${lastName}%`),
          isActive: true
        },
        order: {id: 'DESC'},
        skip: (page - 1) * limit,
        take: limit,
      });
      console.log(users)
      if(users.length > 0){
        for (const user of users) { user.password = undefined }
        let totalPag: number = total / limit;
        if (totalPag % 1 != 0){
          totalPag = Math.trunc(totalPag) + 1;
        }
        let nextPag: number = page >= totalPag ? page : Number(page) + 1;
        let prevPag: number = page <= 1 ? page : page -1;
        return{
          ok: true,
          users,
          total,
          totalPag,
          currentPage: Number(page),
          nextPag,
          prevPag,
          message: 'user found sucessfully',
          status: HttpStatus.OK
        }
      }
      return{
        ok: false,
        message: 'user not found',
        status: HttpStatus.NOT_FOUND
      }

    } catch (error) {
      throw new NotFoundException(`Ocurrio un error ${error.message}`)
    }
  }

  async findOne(id: number) {
    try{
      const user = await this.userRepository.findOne({
        where: { id: id , isActive: true}, relations:{roles: true}
        
      })
      if(!user){
        return{
          ok: false,
          message: 'user not found',
          status: HttpStatus.NOT_FOUND
        }
      }
      return{
        ok: true,
        message: 'user found sucessfully',
        status: HttpStatus.FOUND,
        user
      }
    }catch(error){
      throw new NotFoundException(`Ocurrio un error ${error.message}`)
    }
  }

  async update(id: number ,{email, lastName, name, roleId}: UpdateUserDto) {
    try{
      const role = await this.roleRepository.findOne({where: { isActive: true, id: roleId }});
      if(!role){
        return{
          ok: false,
          message: 'role not found',
          status: HttpStatus.NOT_FOUND
        }
      }
      const user = await this.userRepository.findOne({where: {id}});
      if(!user){
        return{
          ok: false,
          message: 'user not found',
          status: HttpStatus.NOT_FOUND
        }
      }
      
      user.name = name,
      user.lastName = lastName,
      user.email = email,
      user.roles = role
      await this.userRepository.save(user);
      
      return{
        ok: true,
        message: 'user update sucessfully',
        status: HttpStatus.CREATED
      }
    }catch(error){
      throw new NotFoundException(`Ocurrio un error ${error.message}`)
    }
  }

  async remove(id: number) {
    try{
      const user = await this.userRepository.findOne({
        where: { id: id }
      })
      user.isActive = false;
      await this.userRepository.save(user)
      return{
        ok: true,
        message: 'user deleted sucessfully',
        status: HttpStatus.OK
      }
    }catch(error){
      throw new NotFoundException(`Ocurrio un error ${error.message}`)
    }
    
  }
}
