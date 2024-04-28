import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  //   const itemsData = [
  //     { nama: 'Lasagna', tipe: 'Mini', harga: 60.0 },
  //     { nama: 'Lasagna', tipe: 'Small', harga: 90.0 },
  //     { nama: 'Lasagna', tipe: 'Medium', harga: 175.0 },
  //     { nama: 'Lasagna', tipe: 'Long', harga: 295.0 },
  //     { nama: 'Lasagna', tipe: 'Extra Medium', harga: 395.0 },
  //     { nama: 'Lasagna', tipe: 'Family', harga: 495.0 },
  //     { nama: 'Lasagna', tipe: 'Extra Family', harga: 550.0 },
  //     { nama: 'Lasagna', tipe: 'Party Medium', harga: 1300.0 },
  //     { nama: 'Lasagna', tipe: 'Party Large', harga: 2400.0 },

  //     { nama: 'Makaroni', tipe: 'Mini', harga: 50.0 },
  //     { nama: 'Makaroni', tipe: 'Small', harga: 85.0 },
  //     { nama: 'Makaroni', tipe: 'Oval', harga: 110.0 },
  //     { nama: 'Makaroni', tipe: 'Medium', harga: 160.0 },
  //     { nama: 'Makaroni', tipe: 'Long', harga: 245.0 },
  //     { nama: 'Makaroni', tipe: 'Extra Medium', harga: 325.0 },
  //     { nama: 'Makaroni', tipe: 'Family', harga: 375.0 },
  //     { nama: 'Makaroni', tipe: 'Extra Family', harga: 435.0 },
  //     { nama: 'Makaroni', tipe: 'Party Medium', harga: 1000.0 },
  //     { nama: 'Makaroni', tipe: 'Party Large', harga: 2000.0 },

  //     { nama: 'MarbelCake', tipe: '1 Loyang', harga: 330.0 },
  //     { nama: 'MarbelCake', tipe: '1 Potong', harga: 22.0 },
  //     { nama: 'MarbelCake', tipe: '3 Potong', harga: 63.0 },
  //     { nama: 'MarbelCake', tipe: '6 Potong', harga: 125.0 },
  //     { nama: 'MarbelCake', tipe: '8 Potong', harga: 169.0 },
  //     { nama: 'MarbelCake', tipe: '9 Potong', harga: 185.0 },
  //     { nama: 'MarbelCake', tipe: '12 Potong', harga: 245.0 },
  //     { nama: 'MarbelCake', tipe: 'Hampers', harga: 345.0 },

  //     { nama: 'Nastar', tipe: 'Toples Bulat', harga: 170.0 },
  //     { nama: 'Nastar', tipe: 'Toples Kotak', harga: 135.0 },

  //     { nama: 'Kastengles', tipe: 'Toples Bulat', harga: 195.0 },
  //     { nama: 'Kastengles', tipe: 'Toples Kotak', harga: 135.0 },

  //     { nama: 'Lidah Kucing', tipe: 'Toples Bulat', harga: 150.0 },
  //     { nama: 'Lidah Kucing', tipe: 'Toples Kotak', harga: 120.0 },

  //     { nama: 'Almond Keju', tipe: 'Toples Bulat', harga: 170.0 },
  //     { nama: 'Almond Keju', tipe: 'Toples Kotak', harga: 135.0 },

  //     { nama: 'Sagu Keju', tipe: 'Toples Bulat', harga: 150.0 },
  //     { nama: 'Sagu Keju', tipe: 'Toples Kotak', harga: 120.0 },

  //     { nama: 'Cheese Stick', tipe: 'Toples Kotak', harga: 150.0 },

  //     { nama: 'Biscoti', tipe: 'Toples Kotak', harga: 120.0 },

  //     { nama: 'Bolu Peuyeum', tipe: 'Biasa', harga: 125.0 },

  //     { nama: 'Hampers Cookies', tipe: 'K3', harga: 490.0 },
  //     { nama: 'Hampers Cookies', tipe: 'K4', harga: 630.0 },
  //     { nama: 'Hampers Cookies', tipe: 'K5', harga: 810.0 },
  //     { nama: 'Hampers Cookies', tipe: 'B3', harga: 615.0 },
  //     { nama: 'Hampers Cookies', tipe: 'B4', harga: 795.0 },

  //     { nama: 'Roti', tipe: 'Baso', harga: 16.0 },
  //     { nama: 'Roti', tipe: 'Keju', harga: 16.0 },
  //     { nama: 'Roti', tipe: 'Coklat', harga: 16.0 },
  //     { nama: 'Roti', tipe: 'Paket 3', harga: 45.0 },

  //     { nama: 'Box Hampers', tipe: 'K3', harga: 75.0 },
  //     { nama: 'Box Hampers', tipe: 'K4', harga: 95.0 },
  //     { nama: 'Box Hampers', tipe: 'K5', harga: 85.0 },
  //     { nama: 'Box Hampers', tipe: 'B3', harga: 85.0 },
  //     { nama: 'Box Hampers', tipe: 'B4', harga: 95.0 },
  //     { nama: 'Box Hampers', tipe: 'BL', harga: 85.0 },

  //     { nama: 'Pudding', tipe: 'Biasa', harga: 30.0 },
  //     { nama: 'Pudding', tipe: 'Packet 4', harga: 115.0 },
  //     { nama: 'Pudding', tipe: 'Paket 6', harga: 172.5 },

  //     { nama: 'Tas', tipe: 'K3', harga: 15.0 },
  //     { nama: 'Tas', tipe: 'K4', harga: 15.0 },
  //     { nama: 'Tas', tipe: 'K5', harga: 15.5 },
  //     { nama: 'Tas', tipe: 'B3', harga: 15.5 },
  //     { nama: 'Tas', tipe: 'B4', harga: 15.5 },
  //     { nama: 'Tas', tipe: 'MC', harga: 15.5 },
  //     { nama: 'Tas', tipe: 'L', harga: 15.5 },

  //     { nama: 'Air mineral', tipe: 'Biasa', harga: 5.0 },

  //     { nama: 'Poka', tipe: 'Biasa', harga: 12.0 },

  //     { nama: 'Kripik Cherry', tipe: 'Biasa', harga: 28.0 },

  //     { nama: 'Krupuk Akar', tipe: 'Biasa', harga: 28.0 },

  //     { nama: 'Sambel', tipe: 'Biasa', harga: 30.5 },
  //   ];

  //   const createdItems = [];

  //   for (const itemData of itemsData) {
  //     const createdItem = await prisma.item.create({
  //       data: itemData,
  //     });
  //     createdItems.push(createdItem);
  //   }
  //   console.log('Seeded items:', createdItems);

  //   const pickupDeliveries = [
  //     { name: 'Pickup' },
  //     { name: 'Delivery' },
  //     { name: 'Gojek' },
  //     { name: 'Citytran' },
  //     { name: 'Paxel' },
  //     { name: 'Daytrans' },
  //     { name: 'Baraya' },
  //     { name: 'Lintas' },
  //     { name: 'Bineka' },
  //     { name: 'Jne' },
  //   ];

  //   const createdItems = [];

  //   for (const pickupDelivery of pickupDeliveries) {
  //     const createdItem = await prisma.pickupDelivery.create({
  //       data: pickupDelivery,
  //     });
  //     createdItems.push(createdItem);
  //   }
  //   console.log('Seeded items:', createdItems);

  //   const Pembayarans = [
  //     { name: 'Tunai' },
  //     { name: 'Kartu Kredit' },
  //     { name: 'Qr' },
  //     { name: 'Transfer' },
  //   ];

  //   const createdItems = [];

  //   for (const pembayaran of Pembayarans) {
  //     const createdItem = await prisma.pembayaran.create({
  //       data: pembayaran,
  //     });
  //     createdItems.push(createdItem);
  //   }
  //   console.log('Seeded items:', createdItems);

  const Roles = [{ name: 'Admin' }, { name: 'Karyawan' }];

  const createdItems = [];

  for (const role of Roles) {
    const createdItem = await prisma.role.create({
      data: role,
    });
    createdItems.push(createdItem);
  }
  console.log('Seeded items:', createdItems);
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
