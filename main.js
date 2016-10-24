/*
** By Dave Amphlett
**
*/

var serviceSpawner = require('service.spawner');
var serviceForeman = require('service.foreman');

var services = {
    'spawner': serviceSpawner,
    'foreman': serviceForeman
}

var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleSpecial = require('role.special');

var roles = {
    'harvester': roleHarvester,
    'upgrader': roleUpgrader,
    'builder': roleBuilder,
    'special': roleSpecial
};

module.exports.loop = function () {
    // console.log('Loop ===================================================');

    // var tower = Game.getObjectById('e31263ea5e485b6b4569b161');
    // if(tower) {
    //     var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
    //         filter: (structure) => structure.hits < structure.hitsMax
    //     });
    //     if(closestDamagedStructure) {
    //         tower.repair(closestDamagedStructure);
    //     }

    //     var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    //     if(closestHostile) {
    //         tower.attack(closestHostile);
    //     }
    // }

    for(var serviceName in services) {
        var service = services[serviceName];
        service.run();
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        var role = creep.memory.role;
        roles[role].run(creep);
    }
}