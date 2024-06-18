"use strict";

import { User } from "../model/user";
import { Task } from "../model/task";

class InMemoryDb {
  private users: User[] = [];

  addUser(user: User): void {
    this.users.push(user);
  }

  getUsers(): User[] {
    return this.users;
  }
  
  getUser(userId: string): User | undefined {
    return this.users.find((user) => user.id === userId);
  }

  clearUsers(): void {
    this.users = [];
  }
}

export const db = new InMemoryDb();