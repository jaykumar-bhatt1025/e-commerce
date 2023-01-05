module.exports = {
  up: queryInterface => queryInterface.bulkInsert(
    'Addresses',
    [
      {
        id: 'ce621522-4175-44d8-8fbd-5479787568a7',
        userId: 'becfb722-0fe4-4662-8d5a-c0d2e8463ca2',
        houseNo: 123,
        landmark: 'Manibhadra Campus',
        city: 'Surat',
        state: 'Gujarat',
        country: 'India',
        pincode: '395010',
        isArchived: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'ed1d34c3-002e-44ea-8f4d-a7701b66123c',
        userId: '56f2cccb-784e-4439-9f22-1b7fdb65a3d5',
        houseNo: 456,
        landmark: 'Ambika Heights',
        city: 'Surat',
        state: 'Gujarat',
        country: 'India',
        pincode: '395012',
        isArchived: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    {},
  ),

  down: queryInterface => queryInterface.bulkDelete('Addresses', null, {}),
};
