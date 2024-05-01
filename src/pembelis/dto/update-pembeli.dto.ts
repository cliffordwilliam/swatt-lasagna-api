import { PartialType } from '@nestjs/mapped-types';
import { CreatePembeliDto } from './create-pembeli.dto';

export class UpdatePembeliDto extends PartialType(CreatePembeliDto) {}
