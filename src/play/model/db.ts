import { Mylist } from "./Mylist";

class Database {
  mylist: Finder<Mylist>;

  public constructor(dbname: string) {
    const db = this.connect(dbname);
    this.mylist = new Finder(db, "Mylist");
  }

  private connect(dbname: string): Promise<IDBDatabase> {
    return new Promise((resolve) => {
      const request = indexedDB.open(dbname);
      request.onsuccess = (event) => {
        const db = (event.target as IDBRequest).result as IDBDatabase;
        resolve(db);
      };
    });
  }
}

class Finder<T> {
  private db: Promise<IDBDatabase>;
  private tableName: string;

  public constructor(db: Promise<IDBDatabase>, tableName: string) {
    this.db = db;
    this.tableName = tableName;
  }

  find(callback: (record: T) => void): void {
    this.db.then((db) => {
      const trans = db.transaction(this.tableName, "readonly");
      const store = trans.objectStore(this.tableName);
      const request = store.openCursor();
      request.onsuccess = (event) => {
        const cur = (event.target as IDBRequest).result as IDBCursorWithValue;
        if (cur) {
          console.log(cur.value.value as T);
          callback(cur.value.value as T);
          cur.continue();
        }
      };
    });
  }
}

const dbname = localStorage.dbnames.match(/"(\w*)"/)[1];
export const db = new Database(dbname);
