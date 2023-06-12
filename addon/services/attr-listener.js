import Service from '@ember/service';
import EmberObject from '@ember/object';
import Evented from '@ember/object/evented';

export default class AttrListenService extends Service {
  eventManager = EmberObject.extend(Evented).create();

  on(name, target, method) {
    this.eventManager.on(name, target, method);
  }

  off(name, target, method) {
    this.eventManager.off(name, target, method);
  }

  trigger() {
    this.eventManager.trigger("attr-valid");
  }
}
