import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Like, Repository } from 'typeorm';
import { RoleSearchDto } from 'src/roles/dto/role-search.dto';
import { CategorySearchDto } from './dto/category-search.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    try{
      const category = await this.categoryRepository.create(createCategoryDto);
      await this.categoryRepository.save(category);
      return {
        ok: true,
        message: "category created",
        status: HttpStatus.CREATED
      }
    }catch(error){
      throw new NotFoundException(`Ocurrio un error ${error.message}`)
    }
  }

  async findAll({ name, page, limit }: CategorySearchDto) {
    try{
      const [category, total] = await this.categoryRepository.findAndCount({
        where: {
          name: Like(`%${name}%`),
          isActive: true
        },
        order: {id: 'DESC'},
        skip: (page - 1) * limit,
        take: limit,
      });
      console.log(category)
      if(category.length > 0){
        let totalPag: number = total / limit;
        if (totalPag % 1 != 0){
          totalPag = Math.trunc(totalPag) + 1;
        }
        let nextPag: number = page >= totalPag ? page : Number(page) + 1;
        let prevPag: number = page <= 1 ? page : page -1;
        return{
          ok: true,
          category,
          total,
          totalPag,
          currentPage: Number(page),
          nextPag,
          prevPag,
          message: 'categorys found sucessfully',
          status: HttpStatus.OK
        }
      }
    }catch(error){
      throw new NotFoundException(`Ocurrio un error ${error.message}`)
    }
  }

  async findOne(id: number) {
    try{
      const categorys = await this.categoryRepository.find({where: {id,isActive: true}});
      if(!categorys){
        return {
          ok: false,
          message: "not found",
          status: HttpStatus.NOT_FOUND
        }
      }
      return {
        ok: true,
        message: "category founded",
        status: HttpStatus.CREATED,
        categorys
      }
    }catch(error){
      throw new NotFoundException(`Ocurrio un error ${error.message}`)
    }
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    try{
      const category = await this.categoryRepository.findOne({where:{id}});
      category.name = updateCategoryDto.name;
      await this.categoryRepository.save(category);
      return {
        ok: true,
        message: "category updated",
        status: HttpStatus.OK
      }
    }catch(error){
      throw new NotFoundException(`Ocurrio un error ${error.message}`)
    }
  }

  async remove(id: number) {
    try{
      const categorys = await this.categoryRepository.findOne({where: {id,isActive: true}});
      if(!categorys){
        return {
          ok: false,
          message: "not found",
          status: HttpStatus.NOT_FOUND
        }
      }
      categorys.isActive = false;
      await this.categoryRepository.save(categorys);

      return {
        ok: true,
        message: "category found",
        status: HttpStatus.OK
      }
    }catch(error){
      throw new NotFoundException(`Ocurrio un error ${error.message}`)
    }
  }
}
