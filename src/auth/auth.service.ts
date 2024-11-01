
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {
    const { name, email, password } = signUpDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = this.jwtService.sign({ id: user._id });

    return { token };
  }

  async login(loginDto: LoginDto): Promise<{ token: string; userId: string; email: string, name: string  }> {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email });

    if (!user){
      throw new UnauthorizedException('E-mail ou Senha inválido(s).')
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched){
      throw new UnauthorizedException('E-mail ou Senha inválido(s).')
    }

    const token = this.jwtService.sign({id: user._id});

    return { token, userId: user._id.toString(), email: user.email, name: user.name  };

  }
}
