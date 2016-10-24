/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('foreman');
 * mod.thing == 'a thing'; // true
 */

var serviceForeman = {
    targetCreeperCount: function() {
        var status = this.getStatus();
        var neededRoles = this.determineNeededRoles(status);
        var total = 0;
        for (var role in neededRoles) {
            total = total + neededRoles[role];
        };
        return total;
    },

    run: function() {
        // console.log('Foreman ------------------------------------------------');
        this.clearUpCreeperMemory();

        var status = this.getStatus();
        var creeps = Game.creeps;

        var defaultRole = this.getDefaultRole(status);
        var neededRoles = this.determineNeededRoles(status);

        for (var name in creeps) {
            var creep = creeps[name];

            var neededRole = defaultRole;
            for (var role in neededRoles) {
                if (neededRoles[role] > 0) {
                    neededRole = role;
                    neededRoles[role] = neededRoles[role] - 1;
                    break;
                }
            }

            if (creep.memory.role != neededRole) {
                console.log('Turning '+creep.name+' from '+creep.memory.role+' to '+neededRole);
                creep.memory.role = neededRole;
                creep.say('=' + defaultRole);
            }
        }

    },

    getDefaultRole: function(status) {
        if (status.spawnerNeeds > 0) {
            return 'harvester';
        }

        return 'upgrader';
    },
    
    getSpawnedNeededRole: function() {
        var status = this.getStatus();
        var creeps = Game.creeps;

        var defaultRole = this.getDefaultRole(status);
        var neededRoles = this.determineNeededRoles(status);

        for (var name in creeps) {
            var creep = creeps[name];
            var role = creep.memory.role;
            if (neededRoles[role] && neededRoles[role] > 0) {
                neededRoles[role] = neededRoles[role] - 1;
            }
        }
        for (var role in neededRoles) {
            if (neededRoles[role] > 0) {
                return role;
            }
        }

        return 'harvester';
    },

    determineNeededRoles: function(status) {
        var needs = {};
        
        if (status.spawnerNeeds > 0) {
            needs = {
                'harvester': 6,
                'builder': 2
            };
        } else {
            needs = {
                'upgrader': 2,
                'builder': 6
            };
        }
        
        return needs;
    },
    
    getStatus: function() {
        var status = {};

        var spawner = Game.spawns['Spawn1'];
        var energyNeeders = spawner.room.find(FIND_MY_STRUCTURES, {
            filter: (structure) => {
                return (
                    structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_SPAWN ||
                    structure.structureType == STRUCTURE_TOWER
                ) && structure.energy < structure.energyCapacity;
            }
        });

        status.spawnerNeeds = (energyNeeders !== null && energyNeeders.length > 0); //spawner.energyCapacity - spawner.energy;

        status.creeperCount = Object.keys(Game.creeps).length;

        return status;
    },

    clearUpCreeperMemory: function() {
      for(var name in Memory.creeps) {
        if (Game.creeps[name] == undefined) {
          Memory.creeps[name] = undefined;
        }

      }
    }

};

module.exports = serviceForeman;
