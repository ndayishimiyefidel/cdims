'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    
    try {
      // Step 1: Add unit_price column to stock table (if it doesn't exist)
      const stockTableDescription = await queryInterface.describeTable('stock');
      if (!stockTableDescription.unit_price) {
        await queryInterface.addColumn('stock', 'unit_price', {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: true,
          comment: 'Current unit price of the material in this stock'
        }, { transaction });
      }

      // Step 2: Migrate existing unit_price data from materials to stock (if materials has unit_price column)
      // Check if materials table has unit_price column first
      const tableDescription = await queryInterface.describeTable('materials');
      if (tableDescription.unit_price) {
        await queryInterface.sequelize.query(`
          UPDATE stock s
          INNER JOIN materials m ON s.material_id = m.id
          SET s.unit_price = m.unit_price
          WHERE m.unit_price IS NOT NULL
        `, { transaction });
      }

      // Step 3: Remove unit_price column from materials table (if it exists)
      const materialsTableDescription = await queryInterface.describeTable('materials');
      if (materialsTableDescription.unit_price) {
        await queryInterface.removeColumn('materials', 'unit_price', { transaction });
      }

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    
    try {
      // Step 1: Add unit_price column back to materials table
      await queryInterface.addColumn('materials', 'unit_price', {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        comment: 'Unit price of the material'
      }, { transaction });

      // Step 2: Migrate unit_price data back from stock to materials
      // This will set the latest unit_price for each material
      await queryInterface.sequelize.query(`
        UPDATE materials m
        INNER JOIN (
          SELECT material_id, unit_price
          FROM stock
          WHERE unit_price IS NOT NULL
          ORDER BY updated_at DESC
        ) s ON m.id = s.material_id
        SET m.unit_price = s.unit_price
      `, { transaction });

      // Step 3: Remove unit_price column from stock table
      await queryInterface.removeColumn('stock', 'unit_price', { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
