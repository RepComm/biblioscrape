import { join as pathJoin } from "path";
import sqlite3 from "sqlite3";
const {
  Database
} = sqlite3;
console.log(Database);
export class MySwordBible {
  constructor(name) {
    this.name = name;
  }
  create() {
    var _this = this;
    return new Promise(async function (_resolve, _reject) {
      let fname = `${_this.name}.bbl.mysword`;
      let fpath = pathJoin(".", fname);
      let db = _this.db = new Database(fpath, err => {
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
  details(d) {
    let stmt = this.db.prepare(`INSERT INTO Details ("Description", "Abbreviation", "Comments", "Version", "VersionDate", "PublishDate", "RightToLeft", "OT", "NT", "Strong", "CustomCSS") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"`);
    stmt.run(d.Description, d.Abbreviation, d.Comments, d.Version, d.VersionDate, d.PublishDate, d.RightToLeft, d.OT, d.NT, d.Strong, d.CustomCSS);
    stmt.finalize();
  }
  verse(book, chapter, verse, content) {
    let stmt = this.db.prepare("INSERT INTO Bible VALUES (?, ?, ?, ?)");
    stmt.run(book, chapter, verse, content);
    stmt.finalize();
  }
  close() {
    this.db.close();
  }
}