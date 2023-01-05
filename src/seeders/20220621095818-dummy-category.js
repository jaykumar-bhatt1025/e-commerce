module.exports = {
  up: queryInterface => queryInterface.bulkInsert(
    'Categories',
    [
      {
        id: 'e85723de-0c66-456d-a13a-a6d5556589ea',
        categoryName: 'Fashion',
        description: 'Fashion category',
        image: 'https://e-commerce-mini-project.s3.amazonaws.com/img_1655806392941.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'ea14c71e-cbeb-4ab1-a270-fb20f917b7a0',
        categoryName: 'Fashion',
        description: 'Fashion category',
        image: 'https://e-commerce-mini-project.s3.amazonaws.com/img_1655806392941.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'ea14c71e-cbeb-4ab1-a270-fb20f917b7a0',
        categoryName: 'Food',
        description: 'F category',
        image: 'https://e-commerce-mini-project.s3.amazonaws.com/img_1655806392941.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    {},
  ),

  down: queryInterface => queryInterface.bulkDelete('Categories', null, {}),
};
