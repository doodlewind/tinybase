import type {
  Sqlite3Persister,
  createSqlite3Persister as createSqlite3PersisterDecl,
} from '../../@types/persisters/persister-sqlite3/index.d.ts';
import {
  UpdateListener,
  createSqlitePersister,
} from '../common/sqlite/create.ts';
import {Database} from 'sqlite3';
import type {DatabasePersisterConfig} from '../../@types/persisters/index.d.ts';
import {IdObj} from '../../common/obj.ts';
import type {MergeableStore} from '../../@types/mergeable-store/index.d.ts';
import {Persists} from '../index.ts';
import type {Store} from '../../@types/store/index.d.ts';
import {promiseNew} from '../../common/other.ts';

const CHANGE = 'change';

type Observer = (_: any, _2: any, tableName: string) => void;

export const createSqlite3Persister = ((
  store: Store | MergeableStore,
  db: Database,
  configOrStoreTableName?: DatabasePersisterConfig | string,
  onSqlCommand?: (sql: string, args?: any[]) => void,
  onIgnoredError?: (error: any) => void,
): Sqlite3Persister =>
  createSqlitePersister(
    store,
    configOrStoreTableName,
    async (sql: string, args: any[] = []): Promise<IdObj<any>[]> =>
      await promiseNew((resolve, reject) =>
        db.all(sql, args, (error, rows: IdObj<any>[]) =>
          error ? reject(error) : resolve(rows),
        ),
      ),
    (listener: UpdateListener): Observer => {
      const observer = (_: any, _2: any, tableName: string) =>
        listener(tableName);
      db.on(CHANGE, observer);
      return observer;
    },
    (observer: Observer): any => db.off(CHANGE, observer),
    onSqlCommand,
    onIgnoredError,
    Persists.StoreOrMergeableStore,
    db,
  ) as Sqlite3Persister) as typeof createSqlite3PersisterDecl;
