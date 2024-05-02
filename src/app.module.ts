import { HttpStatus, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { providePrismaClientExceptionFilter } from 'nestjs-prisma';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ItemsModule } from './items/items.module';
import { OrdersOnItemsModule } from './orders-on-items/orders-on-items.module';
import { OrdersModule } from './orders/orders.module';
import { PembayaransModule } from './pembayarans/pembayarans.module';
import { PembelisModule } from './pembelis/pembelis.module';
import { PenerimasModule } from './penerimas/penerimas.module';
import { PickupDeliveriesModule } from './pickup-deliveries/pickup-deliveries.module';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ItemsModule,
    RolesModule,
    UsersModule,
    AuthModule,
    PickupDeliveriesModule,
    PembayaransModule,
    PembelisModule,
    PenerimasModule,
    OrdersModule,
    OrdersOnItemsModule,
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
