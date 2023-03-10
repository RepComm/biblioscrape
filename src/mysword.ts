
import { join as pathJoin } from "path";

import sqlite3 from "sqlite3";
const { Database } = sqlite3;

console.log(Database);

export interface BibleDetails {
  Description: string; 
  Abbreviation: string;
  Comments: string;
  Version: string;
  VersionDate: string;
  PublishDate: string;
  RightToLeft: string;
  OT: number;
  NT: number;
  Strong: string;
  CustomCSS: string;
}

export class MySwordBible {
  name: string;
  db: Database;

  constructor(name: string) {
    this.name = name;
  }

  create(): Promise<void> {
    return new Promise(async (_resolve, _reject) => {

      let fname = `${this.name}.bbl.mysword`;

      let fpath = pathJoin(".", fname);

      let db = this.db = new Database(fpath, (err) => {
        console.error(err);
      });

      db.serialize(() => {
        db.run("CREATE TABLE Details (Description NVARCHAR(255), Abbreviation NVARCHAR(50), Comments TEXT, Version TEXT, VersionDate DATETIME, PublishDate DATETIME, RightToLeft BOOL, OT BOOL, NT BOOL, Strong BOOL, CustomCSS TEXT)");
        db.run("CREATE TABLE Bible(Book INT, Chapter INT, Verse INT, Scripture TEXT, Primary Key(Book,Chapter,Verse))");

        _resolve();
        return;
      });
    });
  }

  details (d: BibleDetails) {
    let stmt = this.db.prepare(`INSERT INTO Details ("Description", "Abbreviation", "Comments", "Version", "VersionDate", "PublishDate", "RightToLeft", "OT", "NT", "Strong", "CustomCSS") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"`);
    
    stmt.run(
      d.Description,
      d.Abbreviation,
      d.Comments,
      d.Version,
      d.VersionDate,
      d.PublishDate,
      d.RightToLeft,
      d.OT,
      d.NT,
      d.Strong,
      d.CustomCSS
    );
    
    stmt.finalize();

  }

  verse (book: string, chapter: string, verse: string, content: string) {
    let stmt = this.db.prepare("INSERT INTO Bible VALUES (?, ?, ?, ?)");
    stmt.run(book, chapter, verse, content);
    
    stmt.finalize();
  }

  close() {
    this.db.close();
  }
}
