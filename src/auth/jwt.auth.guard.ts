// Importamos el decorador Injectable desde @nestjs/common
import { Injectable } from "@nestjs/common";
// Importamos AuthGuard desde @nestjs/passport
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class jwtAuthGuard extends AuthGuard('jwt') {}