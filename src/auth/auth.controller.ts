import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto/index";
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthResponseDto } from "./dto/auth-response.dto";
@ApiTags('auth')
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("signup")
  @ApiBody({ type: AuthDto })
  @ApiOperation({summary: 'Create account to perform CRUD Todo'})
  @ApiParam({ name: 'email', description: 'Email ID' })
  @ApiParam({ name: 'password', description: 'password' })
  @ApiResponse({ status: 201, description: 'User successfully registered', type: AuthResponseDto }) 
  signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post("signin")
  @ApiOperation({summary: 'Login to perform CRUD a Todo'})
  @ApiParam({ name: 'email', description: 'Email ID' })
  @ApiParam({ name: 'password', description: 'password' })
  @ApiResponse({ status: 200, description: 'User successfully registered', type: AuthResponseDto })
  signin(@Body() dto: AuthDto) {
    return this.authService.signin(dto);
  }
}
