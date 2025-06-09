import { IsEmail, IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateTenantDto {
  @IsNotEmpty()
  @IsString()
  username!: string;

  @IsNotEmpty()
  @IsString()
  firstname!: string;

  @IsNotEmpty()
  @IsString()
  lastname!: string;

  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;

  @IsNotEmpty()
  @IsNumber()
  age!: number;

  @IsNotEmpty()
  @IsString()
  guardian!: string;

  @IsNotEmpty()
  @IsString()
  address!: string;

  @IsNotEmpty()
  @IsString()
  phone_number!: string;
}
