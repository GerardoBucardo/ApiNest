import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Like, Repository } from 'typeorm';
import { RoleSearchDto } from './dto/role-search.dto';

@Injectable()
export class RolesService {
  constructor (
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
  ){}
  async create(createRoleDto: CreateRoleDto) {
    try{
      const role = await this.rolesRepository.create(createRoleDto);
      await this.rolesRepository.save(role);
      return {
        ok: true,
        message: "role created",
        status: HttpStatus.CREATED
      }
    }catch(error){
      throw new NotFoundException(`Ocurrio un error ${error.message}`)
    }
  }

  async findAll({ role, page, limit }: RoleSearchDto) {
    try{
      const [roles, total] = await this.rolesRepository.findAndCount({
        where: {
          role: Like(`%${role}%`),
          isActive: true
        },
        order: {id: 'DESC'},
        skip: (page - 1) * limit,
        take: limit,
      });
      console.log(roles)
      if(roles.length > 0){
        let totalPag: number = total / limit;
        if (totalPag % 1 != 0){
          totalPag = Math.trunc(totalPag) + 1;
        }
        let nextPag: number = page >= totalPag ? page : Number(page) + 1;
        let prevPag: number = page <= 1 ? page : page -1;
        return{
          ok: true,
          roles,
          total,
          totalPag,
          currentPage: Number(page),
          nextPag,
          prevPag,
          message: 'user found sucessfully',
          status: HttpStatus.OK
        }
      }
    }catch(error){
      throw new NotFoundException(`Ocurrio un error ${error.message}`)
    }
  }

  async findOne(id: number) {
    try{
      const roles = await this.rolesRepository.find({where: {id,isActive: true}});
      if(!roles){
        return {
          ok: false,
          message: "not found",
          status: HttpStatus.NOT_FOUND
        }
      }
      return {
        ok: true,
        message: "role founded",
        status: HttpStatus.CREATED,
        roles
      }
    }catch(error){
      throw new NotFoundException(`Ocurrio un error ${error.message}`)
    }
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    try{
      const role = await this.rolesRepository.findOne({where:{id}});
      role.role = updateRoleDto.role;
      await this.rolesRepository.save(role);
      return {
        ok: true,
        message: "role updated",
        status: HttpStatus.OK
      }
    }catch(error){
      throw new NotFoundException(`Ocurrio un error ${error.message}`)
    }
  }

  async remove(id: number) {
    try{
      const roles = await this.rolesRepository.findOne({where: {id,isActive: true}});
      if(!roles){
        return {
          ok: false,
          message: "not found",
          status: HttpStatus.NOT_FOUND
        }
      }
      roles.isActive = false;
      await this.rolesRepository.save(roles);

      return {
        ok: true,
        message: "role found",
        status: HttpStatus.OK
      }
    }catch(error){
      throw new NotFoundException(`Ocurrio un error ${error.message}`)
    }
  }
}
