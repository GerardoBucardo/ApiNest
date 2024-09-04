import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { ok } from 'assert';

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

  async findAll() {
    try{
      const roles = await this.rolesRepository.find({where: {isActive: true}});
      return {
        ok: true,
        message: "roles founded",
        status: HttpStatus.CREATED,
        roles
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
        message: "role founded",
        status: HttpStatus.OK
      }
    }catch(error){
      throw new NotFoundException(`Ocurrio un error ${error.message}`)
    }
  }
}
