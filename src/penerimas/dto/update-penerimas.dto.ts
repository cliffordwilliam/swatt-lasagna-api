import { PartialType } from '@nestjs/mapped-types';
import { CreatePenerimaDto } from './create-penerimas.dto';

export class UpdatePenerimaDto extends PartialType(CreatePenerimaDto) {}
