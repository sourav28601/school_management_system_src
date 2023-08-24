'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Admins', [{
      name: 'Admin',
      email: 'admin@gmail.com',
      password: '$2b$10$jHoae0uFcZELA1YJjkWZ0uChef7QtxplPZjjwZ294B/fisoFWD2wK',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
