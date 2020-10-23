// Copyright 2020 Axonibyte Innovations, LLC

function State(id) {
  this.id = id;// id in schema
  this.done = false;
  this.wipe = false;
  this.setEntry = null;
  this.nextStates = new Map();
  this.defaultNextState = null;
  this.incomingTransition = null;
  this.saveKey = null;
}

State.prototype.getNextState = function(transition) {
  let state = null;

  if(this.nextStates.has(transition))
    state = this.nextStates.get(transition);
  else if(this.defaultNextState != null)
    state = this.defaultNextState;
  else if(this.done) return null;
  else throw new Error('Invalid transition.');

  state.incomingTransition = transition;
  return state;
}

State.prototype.setDefaultState = function(state) {
  console.log(`[STATE] Setting the default next state for ${this.id} to ${state.id}`);
  this.defaultNextState = state;
}

State.prototype.linkState = function(transition, state) {
  if(this.nextStates.has(transition))
    throw new Error('State already exists.');
  if(state == null)
    throw new Error('Next state cannot be null.');
  console.log(`[STATE] Linking state ${this.id} to ${state.id} via ${transition}`);
  this.nextStates.set(transition, state);
}

State.prototype.setSetEntry = function(key, value) {
  if(this.setEntry != null) throw new Error('Set entry already known.');
  if(this.saveKey != null && this.saveKey == key)
    throw new Error('Detected potential collision in observer');
  console.log(`[STATE] Setting a new static entry for node ${this.id}, ${key}=${value}`);
  this.setEntry = {
    key: key,
    value: value
  };
}

State.prototype.getSaveEntry = function() {
  if(this.incomingTransition == null)
    throw new Error('This is the first state; as such, it has no incoming transition.');
  if(this.saveKey == null) throw new Error('No save key set.');
  return {
    key: this.saveKey,
    value: this.incomingTransition
  };
}

State.prototype.setSaveKey = function(key) {
  if(this.saveKey != null)
    throw new Error('Save key already known.');
  if(this.setEntry != null && this.setEntry['key'] == key)
    throw new Error('Detected potential collision in observer.');
  console.log(`[STATE] Setting a new dynamic entry for node ${this.id}, ${key}`);
  this.saveKey = key;
}

function Machine(errorFn) {
  this.errorFn = errorFn;
  this.register = new Map();
  this.currentState = null;
  this.listeners = [];
}

Machine.prototype.loadState = function(state) {
  this.currentState = state;

  if(this.currentState.wipe) {
    console.log(`[MACHINE] Detected an instruction to wipe the register.`);
    this.register.clear();
  }
}

Machine.prototype.pushToken = function(token) {
  console.log(`[MACHINE] Pushing a new token "${token}"`);
  this.currentState = this.currentState.getNextState(token);

  if(this.currentState == null)
    throw new Error('Illegal machine state.');

  if(this.currentState.wipe) {
    console.log(`[MACHINE] Detected an instruction to wipe the register.`);
    this.register.clear();
  }

  if(this.currentState.setEntry != null) {
    let setEntry = this.currentState.setEntry;
    console.log(`[MACHINE] Detected an instruction to set static entry ${setEntry['key']}=${setEntry['value']}`);
    this.register.set(setEntry['key'], setEntry['value']);
  }

  if(this.currentState.saveKey != null) {
    let saveEntry = this.currentState.getSaveEntry();
    console.log(`[MACHINE] Detected an instruction to set dynamic entry ${saveEntry['key']}=${saveEntry['value']}`);
    this.register.set(saveEntry['key'], saveEntry['value']);
  }

  for(let i = 0, size = this.listeners.length; i < size; i++) {
    let listener = this.listeners[i];
    console.log(`[MACHINE] Notifying listener at idx=${i} of changed state.`);
    listener.onState(this.currentState);
    if(this.currentState.done) {
      console.log(`[MACHINE] Notifying listener at idx=${i} of terminal state.`);
      listener.onTerminalState(this.currentState);
    }
  }
}

Machine.prototype.registerStateListener = function(listener) {
  console.log(`[MACHINE] Adding a new listener.`);
  this.listeners.push(listener);
}

Machine.prototype.onInput = function(input) {
  let tokens = input.split(/(\s+)/).filter(function(e) {
    return e.trim().length > 0;
  });

  console.log(`[MACHINE] Splitting input into ${tokens.length} token(s).`);

  for(let i = 0, size = tokens.length; i < size; i++) {
    try {
      this.pushToken(tokens[i]);
    } catch(error) {
      this.errorFn(error.message);
    }
  }
}

function Bootloader(serialized) {
  this.initialState = null;

  let states = new Map();

  for(let k in serialized)
    states.set(k, new State(k));
    // states.set(k, serialized[k]);

  console.log(`[BOOTLOADER] Loading ${states.size} state(s)...`);

  for(const [key, value] of states.entries()) {
    console.log(`[BOOTLOADER] Loading state id=${key}`);
    let stateObj = serialized[key];

    if('transitions' in stateObj) {
      let transitions = stateObj['transitions'];

      if('*' in transitions) {
        console.log(`[BOOTLOADER] Detected a default transition for state id=${key}`);
        let defaultStateKey = transitions['*'];
        states.get(key).setDefaultState(states.get(defaultStateKey.toString()));
      }

      for(let transition in transitions) {
        if(transition == '*') continue;
        console.log(`[BOOTLOADER] Detected a transition at edge=${transition} for state id=${key}`);
        let nextStateKey = transitions[transition].toString();
        if(!states.has(nextStateKey)) throw new Error('State not found.');
        value.linkState(transition, states.get(nextStateKey));
      }
    }

    if('save' in stateObj) {
      console.log(`[BOOTLOADER] Detected a dynamic entry keyword for state id=${key}`);
      value.setSaveKey(stateObj['save']);
    }

    if('set' in stateObj) {
      console.log(`[BOOTLOADER] Detected a static entry keyword for state id=${key}`);
      let setObj = stateObj['set'];
      let setKey = setObj['key'];
      let setVal = setObj['value'];
      value.setSetEntry(setKey, setVal);
    }

    if('state' in stateObj) {
      let stateFlag = stateObj['state'];
      if(stateFlag == 'restart') {
        console.log(`[BOOTLOADER] Detected a wiping directive for state id=${key}`);
        value.wipe = true;
      } else if(stateFlag == 'done') {
        console.log(`[BOOTLOADER] Detected a terminal directive for state id=${key}`);
        value.done = true;
      } else throw new Error('Illegal state flag.');
    }
  }

  if(states.size == 0) throw new Error('No state was loaded.');
  let initialStateEntry = states.values().next();
  console.log(`[BOOTLOADER] Setting initial state id=${initialStateEntry.key}`);
  this.initialState = initialStateEntry.value;
}

function Hypervisor(schema, changeFn, terminalFn, errorFn) {
  this.bootloader = new Bootloader(schema);
  this.machine = null;
  this.changeFn = changeFn;
  this.terminalFn = terminalFn;
  this.errorFn = errorFn;
}

Hypervisor.prototype.boot = function(machine) {
  console.log(`[HYPERVISOR] Booting hypervisor...`);
  this.machine = machine;
  machine.loadState(this.bootloader.initialState);
}

Hypervisor.prototype.onState = function(state) {
  let msg = `[HYPERVISOR] Reached new state: ${state.id} via token ${state.incomingTransition}`;
  console.log(msg);
  this.changeFn(msg);
  for(const [key, value] of this.machine.register.entries())
    console.log(`[HYPERVISOR] - ${key} = ${value}`);
}

Hypervisor.prototype.onTerminalState = function(state) {
  console.log(`[HYPERVISOR] Hit terminal state!`);
  this.terminalFn(this.machine.register);
  console.log(`[HYPERVISOR] Rebooting...`);
  this.machine.loadState(this.bootloader.initialState);
}

function DFA(schema, changeFn, terminalFn, errorFn) {
  this.machine = new Machine(errorFn);
  this.hypervisor = new Hypervisor(schema, changeFn, terminalFn, errorFn);
  this.hypervisor.boot(this.machine);
  this.machine.registerStateListener(this.hypervisor);
}

DFA.prototype.pushLine = function(input) {
  this.machine.onInput(input);
}
