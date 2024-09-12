import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { JwStrategy } from './strategies/jwt-auth.strategy';
import { jwtSecret } from 'src/common/contants/constant.jwt';

@Module({
  imports: [
    // Importamos el módulo TypeOrmModule y registramos la entidad User
    TypeOrmModule.forFeature([User]),
    // Importamos el módulo PassportModule para usar estrategias de autenticación
    PassportModule,
    // Importamos el modulo JwtModule y configuramos las opciones de JWT
    JwtModule.register({
      secret: jwtSecret.secret, // Clave secreta para firmar las tokens JWT
      signOptions: { expiresIn: "24h" } // Configuramos la expiracion de los tokens a 24 horas
    })
  ],
  // Registramos el controlador de autenticacion
  controllers: [AuthController],
  //  Registramos los proveedores de servicios y estrategias de autenticacion
  providers: [AuthService, JwStrategy],
  // Extraemos el servicio de autenticacion para que pueda ser usado en otros módulos
  exports: [AuthService]
})
export class AuthModule {}
