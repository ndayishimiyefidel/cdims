const { DataTypes } = require('sequelize');
const { sequelize } = require('../src/config/database');

const StockMovement = sequelize.define('StockMovement', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  store_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    references: {
      model: 'stores',
      key: 'id'
    }
  },
  material_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    references: {
      model: 'materials',
      key: 'id'
    }
  },
  movement_type: {
    type: DataTypes.ENUM('IN', 'OUT', 'ADJUSTMENT'),
    allowNull: false
  },
  source_type: {
    type: DataTypes.ENUM('GRN', 'ISSUE', 'ADJUSTMENT'),
    allowNull: false
  },
  source_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false
  },
  qty: {
    type: DataTypes.DECIMAL(12, 3),
    allowNull: false
  },
  unit_price: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'stock_movements',
  timestamps: false,
  indexes: [
    {
      fields: ['store_id', 'material_id', 'created_at']
    }
  ]
});

module.exports = StockMovement;
