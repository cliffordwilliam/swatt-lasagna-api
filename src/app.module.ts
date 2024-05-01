import { HttpStatus, Module } from '@nestjs/common';
import { providePrismaClientExceptionFilter } from 'nestjs-prisma';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ItemsModule } from './items/items.module';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PickupDeliveriesModule } from './pickup-deliveries/pickup-deliveries.module';
import { PembayaransModule } from './pembayarans/pembayarans.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ItemsModule,
    RolesModule,
    UsersModule,
    AuthModule,
    PickupDeliveriesModule,
    PembayaransModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    providePrismaClientExceptionFilter({
      P2000: HttpStatus.BAD_REQUEST,
      P2002: HttpStatus.CONFLICT,
      P2025: HttpStatus.NOT_FOUND,
    }),
  ],
})
export class AppModule {}
