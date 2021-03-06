const Task = Mep.require('strategy/Task');
const TunedPoint = Mep.require('strategy/TunedPoint');
const TunedAngle = Mep.require('strategy/TunedAngle');
const Delay = Mep.require('misc/Delay');
const lunar = Mep.getDriver('LunarCollector');
const Console = require('./Console');

const TAG = 'CollectBackRocketTask';

class CollectBackRocketTask extends Task {
    async onRun() {
        try {
            await Mep.Motion.go(new TunedPoint(-1100, 370, [ 1100, 340, 'blue' ]), { speed: 200, backward: false, tolerance: -1 });
            await Mep.Motion.go(new TunedPoint(-1230, 370, [ 1245, 340, 'blue' ]), { speed: 80, backward: false, tolerance: -1 });
            await this.common.collect();
            this.common.asyncRotateOnColor();
            this.common.robot.colorfulModules = 4;
            lunar.collect();
            await Delay(400);
            lunar.prepare(500, 515).catch(() => {});
            // await Mep.Motion.straight(-150);
            await Mep.Motion.go(new TunedPoint(-1000, 370, [ 1000, 340, 'blue' ]), { speed: 80, backward: true });
            this.finish();
        } catch (e) {
            switch (e.action) {
                case 'stuck':
                    await Delay(500);
                    try { await Mep.Motion.straight(200, { opposite: true }); } catch (e) { Mep.Log.error(TAG, e); }
                    break;
            }
            Mep.Log.error(TAG, e);
            this.suspend();
        }
    }

    isAvailable() {
        return (lunar.isEmpty() === true);
    }
}

module.exports = CollectBackRocketTask;
