import { IsString, IsNotEmpty } from 'class-validator';

export class CredentialsDto {
  @IsString()
  @IsNotEmpty()
  username!: string;
  @IsString()
  @IsNotEmpty()
  password!: string;
}
