import { IsNumber } from "class-validator";

export class logoutDto {
  @IsNumber()
  userId: number;
}