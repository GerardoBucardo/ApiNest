// Importamos los modulos y decoradores necesarios desde @nestjs/common
import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
// Importamos el AuthService que contiene la logica de autenticacion
import { AuthService } from "./auth.service";
// Importamos el DTO que define la estructura de los datos de login
import { LoginAuthDto } from "./dto/auth.login.dto";

@Controller('auth')
export class AuthController{
  constructor(private authService: AuthService) {}

  // Define la ruta POST /auth/login con un codigo de estado HTTP 200(OK)
  @HttpCode(HttpStatus.OK)
  @Post('login') // Nombre de la ruta de la api
  sigIn(@Body() LoginDto: LoginAuthDto) {
    // Llama al metodo Login del AuthService con los datos de Login
    return this.authService.login(LoginDto);
  }
}