'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Group.belongsTo(models.User, {foreignKey: 'organizerId'});
      Group.hasMany(models.Venue, {foreignKey: 'groupId'});
      Group.hasMany(models.GroupImage, {foreignKey: 'groupId'});
      Group.belongsToMany(models.User, {
        through: 'Membership',
        foreignKey: 'groupId',
        otherKey: 'userId'
      });
      Group.belongsToMany(models.Venue, {
        through: 'Event',
        foreignKey: 'groupId',
        otherKey: 'venueId'
      })
    }
  }
  Group.init({
    organizerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(60),
      allowNull: false
    },
    about: {
      type: DataTypes.TEXT,
      validate: {
        len: [50,1000]
      },
    },
    type: {
      type: DataTypes.ENUM('Online', 'In Person'),
      defaultValue: 'In Person'
    },
    private: {
      type: DataTypes.BOOLEAN,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};
