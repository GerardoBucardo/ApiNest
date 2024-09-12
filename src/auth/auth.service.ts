import { HttpStatus, Injectable } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm/repository/Repository';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { LoginAuthDto } from './dto/auth.login.dto';
import { stat } from 'fs';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}
  async login({ email, password }: LoginAuthDto){
    // Busca el usuario en la base de datos por email y estado, incluyendo relaciones
    const user = await this.userRepository.findOne({
      relations: { roles: true },
      where: {
        email,
        isActive: true,
      },
    });

    // Si no se encuentra el usuario a la contraseña no coincide
    if(!user || !user.checkPassword(password)){
      return {
        message: "No se encontró el usuario",
        ok: false,
        status: HttpStatus.NOT_FOUND
      }
    }

    // Eliminamos el password del objeto usuario 
    // para no incluirlo en la respuesta
    user.password = undefined;
    // Definimos el payload del JWT con informacion del usuario
    const payload = {
      _sub: user.id,
      _name: user.name,
      _rol: user.roles,
    }

    // Firmamos el token JWT con el payload definido
    const token = this.jwtService.sign(payload);

    // Retornamos la respuesta con el token, el usuario y el estado HTTP OK
    return { 
      ok: true, 
      token, 
      user, 
      status: HttpStatus.OK }
  }
}
