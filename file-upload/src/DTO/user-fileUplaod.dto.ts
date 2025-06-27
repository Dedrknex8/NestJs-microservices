import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UserFileUploadDTO {
  @IsString()
  originalName: string;

  @IsNumber()
  size: number;

  @IsString()
  mimeType: string;

  @IsString()
  url: string;

  @IsString()
  publicId: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  userId: string;

  @IsOptional()
  @IsString()
  username?: string;
}
