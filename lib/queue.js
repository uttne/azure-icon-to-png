class Queue {
  constructor() {
    this.list = [];
  }
  get length() {
    return this.list.length;
  }

  enqueue(value) {
    this.list.push(value);
  }

  tryDequeue() {
    if (this.list.length === 0) {
      return {
        error: "empty",
      };
    }
    const value = this.list[0];
    this.list.splice(0, 1);
    return {
      value: value,
    };
  }
}

exports = module.exports = {};

exports.Queue = Queue;
