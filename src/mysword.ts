
import { join as pathJoin } from "path";
import { Database } from "sqlite3";

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

    `INSERT INTO "main"."Details" ("Description", "Abbreviation", "Comments", "Version", "VersionDate", "PublishDate", "RightToLeft", "OT", "NT", "Strong", "CustomCSS") VALUES ('The New EMTV Greek Study Bible 2011 Edition', 'EMTV', '<P ALIGN=CENTER><B><big>The New EMTV Greek Study Bible 2011 Edition</big></B><br>
<B>TRANSLATED by Paul W. Esposito</B><br>
Copyright 2011 by Paul W. Esposito</P>

<hr>

<P ALIGN=CENTER><B>A
Message from the translator</B></P>

<P ALIGN=JUSTIFY>
Thank
you for reading the latest edition of the English Majority Text
Version of the New Testament. This brand new release has a single
column, wide margin text, great for writing in and taking notes. 
</P>
<P ALIGN=JUSTIFY>
I
firmly believe that what you hold in your hands is the closest
representation to the original autographs of the New Testament, by
having a translation that has its origins in the Byzantine Textform.</P>
<P ALIGN=JUSTIFY>
This
day and age, there is an incredible assault taking place against the
word of God, and has attacked all phases of society, including Bible
translators. New translations being released are changing God&rsquo;s
word to fit into today&rsquo;s society, and to be stylish. 
</P>
<P ALIGN=JUSTIFY>
What
makes this version different? It is God&rsquo;s good pleasure that
you and I compare these different translations of His word, in our
quest to know Him better. For God has declared, &ldquo;<I>My
people are destroyed for lack of knowledge</I>.&rdquo;
(Hosea 4:6) 
</P>
<P ALIGN=JUSTIFY>I
will point out that the Byzantine Majority Text Manuscripts are the
time-tested, trusted manuscripts that were all this world knew for
some 1500 years. These manuscripts were used by Erasmus, Luther, the
forty-seven scholars who translated the King James Bible, the Geneva
Bible, as well as all the reformers, who refused to stick with the
Latin Vulgate.</P>
<P ALIGN=JUSTIFY>
Some
500 years ago, when the first printed text was made, it was no
coincidence that God had provided these manuscripts, because these
are faithful manuscripts. 
</P>
<P ALIGN=JUSTIFY>
This
translation is the reading of the &ldquo;majority&rdquo; of those
same Byzantine Manuscripts that are in existence. Only, instead of
the eight or so trustworthy manuscripts that were available in the
1500&rsquo;s, we have hundreds! 
</P>
<P ALIGN=JUSTIFY>
To
me, the word of God is the only &ldquo;pure&rdquo; constant of the
universe. 
</P>
<P ALIGN=JUSTIFY>
<BR>
</P>
<P ALIGN=JUSTIFY>
&ldquo;<I>Every
word of God is pure;  </I>
</P>
<P ALIGN=JUSTIFY>
<I>He
is a shield to those who put their trust in Him. </I>
</P>
<P ALIGN=JUSTIFY>
<I>Do
not add to His words, </I>
</P>
<P ALIGN=JUSTIFY>
<I>Lest
He rebuke you, and you be found a liar</I>.&rdquo;
(Prov 30:5-6) 
</P>
<P ALIGN=JUSTIFY>
<BR>
</P>
<P ALIGN=JUSTIFY>
It
is my prayer that this work will bring honor to our Lord and Savior
Jesus Christ, and to our God and Father.  
</P>
<P ALIGN=JUSTIFY>	Peace
of Christ upon you all as you study the Father&rsquo;s word. 
</P>
<P ALIGN=JUSTIFY><BR>
</P>
<P ALIGN=JUSTIFY>In
His Service, 
</P>
<P ALIGN=JUSTIFY>Paul
W. Esposito, 
</P>
<P ALIGN=JUSTIFY>Stauros
Ministries</P>
<P ALIGN=JUSTIFY><U>Paul@Majoritytext.com</U></P>
<P ALIGN=JUSTIFY><BR>
</P>

<P ALIGN=CENTER><B>About
the Author</B></P>
<P><BR>
</P>
<P>I
cannot for a moment take one ounce of credit for this great Book,
this Bible translation.</P>
<P>All
the credit goes to Almighty God, and to His Son Jesus Christ, who
Himself is the living embodiment of the word of God, as His name
declares.</P>
<P>This
Book is God&rsquo;s word to mankind. Included in its pages is the
key of life:</P>
<ol><li>How to have peace with God.</li>
<li>How to stand before Him on Judgment Day, and to be accepted in the
Beloved.</li></ol>
<P>It&rsquo;s
my prayer that this Bible would be a blessing in your life.</P>
<P>May
the peace of Jesus Christ be imparted to your soul this day!</P>
<P><BR>
</P>
<P>Paul
W. Esposito</P>', '1.0', '2012-04-19 00:00:00', '2011', '0', '0', '1', '0', '.smcaps{font-variant:small-caps}');`
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
