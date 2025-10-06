'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('stock_history', 'unit_price_before', {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: true,
      comment: 'Unit price before the movement'
    });

    await queryInterface.addColumn('stock_history', 'unit_price_after', {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: true,
      comment: 'Unit price after the movement'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('stock_history', 'unit_price_before');
    await queryInterface.removeColumn('stock_history', 'unit_price_after');
  }
};