module.exports = {
  up: queryInterface => queryInterface.bulkInsert(
    'SubCategories',
    [
      {
        id: '712d8908-f55a-41a2-946b-1cb82462617b',
        subCategoryName: 'Mobile',
        description: 'Mobile SubCategory',
        categoryId: 'dc6356e2-c366-4fe8-bf03-0fcd4f02e44c',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '32efed26-ed7f-4ec2-9eff-89cb9c046372',
        subCategoryName: 'Laptop',
        description: 'Laptop SubCategory',
        categoryId: 'dc6356e2-c366-4fe8-bf03-0fcd4f02e44c',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '0030a359-3618-4df5-aed7-15698831eca1',
        subCategoryName: 'Shirt',
        description: 'Shirt SubCategory',
        categoryId: 'ea14c71e-cbeb-4ab1-a270-fb20f917b7a0',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '952f4c26-12de-4eb6-9f0e-8bfa1135ff0d',
        subCategoryName: 'T-Shirt',
        description: 'T-Shirt SubCategory',
        categoryId: 'ea14c71e-cbeb-4ab1-a270-fb20f917b7a0',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    {},
  ),

  down: queryInterface => queryInterface.bulkDelete('SubCategories', null, {}),
};
