const { validate } = require("./models/Content");

function validAnagram(str1, str2) {
  let count1 = {};
  let count2 = {};
  for (let i of str1) {
    if (!count1[i]) {
      count1[i] = 0;
    }
    count1[i] += 1;
  }
  for (let i of str2) {
    if (!count2[i]) {
      count2[i] = 0;
    }
    count2[i] += 1;
  }

  for (let i of Object.keys(count1)) {
    if (count1[i] !== count2[i]) {
      return false;
    }
  }
  return true;
}

class Student {
  constructor(firstName, lastName, age) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.age = age;
  }
}

let cea = new Student("cea", "iros", 24);

class Node {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}
class SingleList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }
  push(val) {
    let newNode = new Node(val);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      this.tail = newNode;
    }
    this.length++;
    return this;
  }
  pop() {
    if (!this.head) {
      return undefined;
    }
    let current = this.head;
    let nextNode = this.next;
    while (nextNode) {
      current = nextNode;
    }
    this.tail = nextNode;
    this.tail.next = null;
    this.length--;
    return nextNode;
  }
  shift() {
    if (this.length === 0) {
      return null;
    }
    let headNode = this.head;
    this.head = headNode.next;
    this.length--;
    if (this.length === 0) {
      this.tail = null;
    }
    return headNode;
  }
  unshift(node) {
    let nextNode = this.head;
    this.head = new Node(node);
    node.next = nextNode;
    this.length++;
    return this;
  }
}

class Stack {
  constructor() {
    this.first = null;
    this.last = null;
    this.size = 0;
  }
  push(val) {
    let newNode = new Node(val);
    if (!this.first) {
      this.first = newNode;
      this.last = newNode;
    } else {
      let temp = this.first;
      this.first = newNode;
      this.first.next = temp;
    }
    return this.size++;
  }
  pop() {
    if (!thsis.first) {
      return null;
    }
    let temp = this.first;
    if (this.first === this.last) {
      this.last = null;
    }
    this.first = this.first.next;
    this.size--;
    return temp.value;
  }
}

class Stack {
  constructor() {
    this.first = null;
    this.last = null;
    this.size = 0;
  }
  enqueue(val) {
    let newNode = new Node(val);
    if (!this.first) {
      this.first = newNode;
      this.last = newNode;
    } else {
      this.last.next = newNode;
      this.last = newNode;
    }
    return ++this.size;
  }
  dequeue() {
    if (!this.first) {
      let temp = this.first;
      if (this.first === this.last) {
        this.last = null;
      }
      this.first = this.first.next;
      this.size--;
      return temp.value;
    }
  }
}
