import { Mylist } from "./Mylist";
import { Purchase } from "./Purchase";

class Database {
  mylist: Finder<Mylist>;
  purchase: Finder<Purchase>;

  public constructor(dbname: string) {
    const db = this.connect(dbname);
    this.mylist = new Finder(db, "MyList", (obj: any) => {
      return {
        mylist_id: String(obj.id),
        mylist_name: obj.title,
        worknos: obj.data,
      };
    });
    this.purchase = new Finder(db, "Purchase", (obj: any) => {
      return {
        workno: obj.workno,
        work_name: obj.name.ja_JP,
        maker_name: obj.maker.name.ja_JP,
      };
    });
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

type Convertable<T> = (obj: any) => T;
class Finder<T> {
  private db: Promise<IDBDatabase>;
  private tableName: string;
  private convert: Convertable<T>;

  public constructor(
    db: Promise<IDBDatabase>,
    tableName: string,
    convert: Convertable<T>
  ) {
    this.db = db;
    this.tableName = tableName;
    this.convert = convert;
  }

  async findAll(): Promise<T[]> {
    return this.db.then((db) => {
      const trans = db.transaction(this.tableName, "readonly");
      const store = trans.objectStore(this.tableName);
      const request = store.getAll();
      return new Promise((resolve) => {
        request.onsuccess = (event) => {
          const res = (event.target as IDBRequest)
            .result as IDBCursorWithValue[];
          resolve(res.map((r) => this.convert(r)));
        };
      });
    });
  }
}

const dbname = localStorage.dbnames.match(/(Play_\w*)/)[1];
export const db = new Database(dbname);
