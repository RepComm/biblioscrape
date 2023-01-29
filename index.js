import { readFileSync } from "fs";
import { parse } from "node-html-parser";
export class Verse {
  constructor(id) {
    this.id = id;
    this.texts = new Array();
  }
  append(text) {
    this.texts.push(text);
  }
  toString() {
    let results = new Array();
    for (let text of this.texts) {
      results.push(text);
    }
    return `Verse: ${this.id}\n${results.join(" ")}\n`;
  }
}
export class Chapter {
  constructor(id) {
    this.id = id;
    this.verses = new Map();
  }
  getVerse(id, create = true) {
    if (this.getVerseCache && this.getVerseCache.id === id) {
      return this.getVerseCache;
    } else {
      let result = this.verses.get(id);
      if (create && !result) {
        result = new Verse(id);
        this.verses.set(id, result);
      }
      this.getVerseCache = result;
      return result;
    }
  }
  toString() {
    let results = new Array();
    for (let [verseId, verse] of this.verses) {
      results.push(verse.toString());
    }
    return `Chapter: ${this.id}\n${results.join(" ")}`;
  }
}
export class Book {
  constructor(id) {
    this.id = id;
    this.chapters = new Map();
  }
  getChapter(id, create = true) {
    if (this.getChapterCache && this.getChapterCache.id === id) {
      return this.getChapterCache;
    } else {
      let result = this.chapters.get(id);
      if (!result && create) {
        result = new Chapter(id);
        this.chapters.set(id, result);
      }
      this.getChapterCache = result;
      return result;
    }
  }
  toString() {
    let results = new Array();
    for (let [chapterId, chapter] of this.chapters) {
      results.push(chapter.toString());
    }
    return `Book: ${this.id}\n${results.join(" ")}`;
  }
}
function esv_org() {
  let raw = readFileSync("./sample-content/Matthew 1 _ ESV.org.html", {
    encoding: "utf-8"
  });
  let html = parse(raw);
  let bookName = html.getElementsByTagName("title")[0].textContent;
  let bookContent = html.getElementById("bible-content");
  let sections = bookContent.getElementsByTagName("section");
  let book = new Book(bookName);
  for (let section of sections) {
    let chapterText = section.rawAttributes["data-reference"];
    if (chapterText) {
      let firstVerseFound = false;
      let verseNumText = undefined;
      if (!firstVerseFound) {
        // section.querySelector("starts-chapter");
        verseNumText = "1";
      }
      let verseNodes = section.querySelectorAll(".verse");
      for (let verseNode of verseNodes) {
        let verseNum = verseNode.querySelector(".verse-num");
        if (verseNum) verseNumText = verseNum.textContent;
        for (let child of verseNode.childNodes) {
          if (!child.rawAttributes || !child.rawAttributes["data-offset"]) {
            if (child.tagName !== "u" && child.tagName !== "U") {
              child.remove();
            } else {
              if (child.textContent !== ",") child.textContent = child.textContent.trim() + " ";
            }
          }
        }
        book.getChapter(chapterText).getVerse(verseNumText).append(verseNode.textContent.trim());

        // console.log(chapterText, verseNumText, `"${verseNode.textContent}"`);
      }
    }
  }

  console.log(book.toString());
}
async function main() {
  esv_org();
}
main();