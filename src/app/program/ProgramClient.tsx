"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";

/* ------------------------------------------------------------------ */
/* Types & helper components                                          */
/* ------------------------------------------------------------------ */
interface ProgrammeItemConfig {
  id: number;
  title: string;
  subtitle?: string;
  defaultOpen?: boolean;
  toggleLabel?: string;
  toggleAltLabel?: string;
  content?: ReactNode;
}

/* Helper for italic stage directions */
function Dir({ children }: { children: ReactNode }) {
  return <p className="programme-direction">{children}</p>;
}

/* Helper for bold instruction lines */
function Bold({ children }: { children: ReactNode }) {
  return <p className="programme-bold">{children}</p>;
}

/* Helper for verse labels */
function VerseLabel({ children }: { children: ReactNode }) {
  return <p className="programme-verse-label">{children}</p>;
}

/* ------------------------------------------------------------------ */
/* Section divider with flower ornament                                */
/* ------------------------------------------------------------------ */
function SectionDivider({ title }: { title: string }) {
  return (
    <Reveal>
      <div className="programme-section-divider">
        <img
          src="/images/flower-divider.png"
          alt=""
          aria-hidden="true"
          className="programme-flower"
        />
        <h2 className="programme-section-title">{title}</h2>
      </div>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/* Interactive Program Client Component                                */
/* ------------------------------------------------------------------ */
export function ProgramClient() {
  // State for all expandable item IDs
  // Items 3, 6, 7, 8, 9, 12, 13, 14, 15, 20 are expanded by default (matching Figma mockup)
  // Items 10 (Vows) and 11 (Ring ceremony) are collapsed by default with "Read" button
  const [openItems, setOpenItems] = useState<Record<number, boolean>>({
    3: true,
    6: true,
    7: true,
    8: true,
    9: true,
    10: false, // Vows (labeled "Read")
    11: false, // Ring ceremony (labeled "Read")
    12: true,
    13: true,
    14: true,
    15: true,
    20: true,
  });

  const expandableIds = [3, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 20];

  const toggleItem = (id: number) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const areAllExpanded = expandableIds.every((id) => openItems[id]);

  const toggleAll = () => {
    const nextState = !areAllExpanded;
    const updated: Record<number, boolean> = {};
    expandableIds.forEach((id) => {
      updated[id] = nextState;
    });
    setOpenItems(updated);
  };

  return (
    <div className="programme-page-wrapper">
      {/* Top navigation utility */}
      <nav className="programme-nav" aria-label="Programme navigation">
        <Link href="/" className="programme-nav-back">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span>Return to Invitation</span>
        </Link>

        <div className="programme-nav-actions">
          <button
            type="button"
            onClick={toggleAll}
            className="programme-nav-btn"
            aria-label={areAllExpanded ? "Collapse all sections" : "Expand all sections"}
          >
            {areAllExpanded ? "Collapse all" : "Expand all"}
          </button>
        </div>
      </nav>

      <main className="programme-page">
        {/* ---- Header ---- */}
        <Reveal>
          <header className="programme-header">
            <img
              src="/images/flower-divider.png"
              alt=""
              aria-hidden="true"
              className="programme-flower"
            />
            <h1 className="programme-main-title">Wedding programme</h1>
          </header>
        </Reveal>

        {/* 1 */}
        <Reveal>
          <div className="programme-item">
            <span className="programme-num">1</span>
            <div className="programme-content">
              <p className="programme-title">GROOM &amp; GROOM&apos;S MEN ENTER</p>
            </div>
          </div>
        </Reveal>

        {/* 2 */}
        <Reveal>
          <div className="programme-item">
            <span className="programme-num">2</span>
            <div className="programme-content">
              <p className="programme-title">MINISTERS ENTER</p>
            </div>
          </div>
        </Reveal>

        {/* 3 — Processional Hymn 1 */}
        <Reveal>
          <div className="programme-item">
            <span className="programme-num">3</span>
            <div className="programme-content">
              <p className="programme-title">PROCESSIONAL HYMN 1</p>
              <p className="programme-subtitle">Showers of Blessing</p>
            </div>
            <button
              type="button"
              onClick={() => toggleItem(3)}
              className="programme-toggle"
              aria-expanded={openItems[3]}
            >
              {openItems[3] ? "Close" : "Open"}
            </button>

            {openItems[3] && (
              <div className="programme-body">
                <p>1.There shall be showers of blessing:</p>
                <p>This is the promise of love;</p>
                <p>There shall be seasons refreshing,</p>
                <p>Sent from the Saviour above.</p>

                <VerseLabel>Refrain</VerseLabel>
                <p className="programme-refrain">
                  <em>
                    Showers of blessing,
                    <br />
                    Showers of blessing we need:
                    <br />
                    Mercy-drops round us are falling,
                    <br />
                    But for the showers we plead.
                  </em>
                </p>

                <p>2.There shall be showers of blessing,</p>
                <p>Precious reviving again;</p>
                <p>Over the hills and the valleys,</p>
                <p>Sound of abundance of rain.</p>

                <p>3.There shall be showers of blessing:</p>
                <p>Send them upon us, O Lord;</p>
                <p>Grant to us now a refreshing,</p>
                <p>Come, and now honour Thy Word.</p>

                <p>4.There shall be showers of blessing:</p>
                <p>Oh, that today they might fall,</p>
                <p>Now as to God we&apos;re confessing,</p>
                <p>Now as on Jesus we call!</p>
              </div>
            )}
          </div>
        </Reveal>

        {/* 4 */}
        <Reveal>
          <div className="programme-item">
            <span className="programme-num">4</span>
            <div className="programme-content">
              <p className="programme-title">BRIDE, FATHER &amp; THE BRIDAL TRAIN ENTER</p>
              <p className="programme-subtitle">
                Goodness of God (CeCe Winans), by Minister Blessing Simeon
              </p>
            </div>
          </div>
        </Reveal>

        {/* 5 */}
        <Reveal>
          <div className="programme-item">
            <span className="programme-num">5</span>
            <div className="programme-content">
              <p className="programme-title">OPENING PRAYER</p>
            </div>
          </div>
        </Reveal>

        {/* ---- Section: Exhortation ---- */}
        <SectionDivider title="Exhortation, charge & declaration" />

        {/* 6 — Giving of the Bride */}
        <Reveal>
          <div className="programme-item">
            <span className="programme-num">6</span>
            <div className="programme-content">
              <p className="programme-title">GIVING OF THE BRIDE</p>
            </div>
            <button
              type="button"
              onClick={() => toggleItem(6)}
              className="programme-toggle"
              aria-expanded={openItems[6]}
            >
              {openItems[6] ? "Close" : "Open"}
            </button>

            {openItems[6] && (
              <div className="programme-body">
                <p>
                  Doubly blessed is the couple which comes to the marriage altar with the
                  approval and blessings of their families. Who has the honour of
                  presenting this woman to be married to this man?
                </p>
                <Dir>
                  (The minister, receiving the woman, shall cause the man with his right
                  hand to take the woman by her right hand.)
                </Dir>
              </div>
            )}
          </div>
        </Reveal>

        {/* 7 — Wedding Address */}
        <Reveal>
          <div className="programme-item">
            <span className="programme-num">7</span>
            <div className="programme-content">
              <p className="programme-title">WEDDING ADDRESS</p>
            </div>
            <button
              type="button"
              onClick={() => toggleItem(7)}
              className="programme-toggle"
              aria-expanded={openItems[7]}
            >
              {openItems[7] ? "Close" : "Read"}
            </button>

            {openItems[7] && (
              <div className="programme-body">
                <p>
                  Dearly beloved, we are gathered together here in the sight of God, and
                  in the face of this congregation, to join together John and Chioma in
                  holy matrimony, which is an honourable estate, instituted of God in the
                  time of man&apos;s innocence, signifying to us the mystical union that is
                  between Christ and His Church; which holy estate Christ adorned and
                  beautified with His presence, and first miracle that He wrought in Cana
                  of Galilee; and is commended by Saint Paul to be honourable among all
                  people; and therefore it is not to be entered into unadvisedly,
                  lightly, or wantonly, to satisfy men&apos;s carnal lusts and appetites,
                  like brute beasts that have no understanding; but reverently,
                  discreetly, advisedly, soberly and in the fear of God; duly considering
                  the causes for which Matrimony was ordained.
                </p>
                <p>
                  Firstly, it was ordained for the procreation of children, to be
                  brought up in the fear and nurture of the Lord, and to the praise of
                  His Holy Name.
                </p>
                <p>
                  Secondly, it was ordained for a remedy against sin, and to avoid
                  fornication; that those who do not have the gift of self-control might
                  marry and keep themselves undefiled members of Christ&apos;s body.
                </p>
                <p>
                  Thirdly, it was ordained for the mutual society, help, and comfort,
                  that each ought to have of the other, both in prosperity and
                  adversity. It is into this holy estate that these two persons present
                  now come to be joined.
                </p>
                <p>
                  Therefore, if anyone can show any just cause why they may not
                  lawfully be joined together, let them speak now, or else hereafter for
                  ever hold their peace.
                </p>
                <Dir>
                  (And also, speaking to the couple to be married, while they stand, the
                  Minister shall say:)
                </Dir>
                <p>
                  I require and charge you both, as you will answer on the dreadful day
                  of judgment when the secrets of all hearts shall be disclosed, that if
                  either of you knows any impediment why you may not be lawfully joined
                  together in marriage, you confess it now. For be well assured that
                  those who are joined together otherwise than God&apos;s Word allows are
                  not joined together by God; neither is their marriage lawful.
                </p>
              </div>
            )}
          </div>
        </Reveal>

        {/* 8 — Hymn 2 */}
        <Reveal>
          <div className="programme-item">
            <span className="programme-num">8</span>
            <div className="programme-content">
              <p className="programme-title">HYMN 2</p>
              <p className="programme-subtitle">Great Is Thy Faithfulness</p>
            </div>
            <button
              type="button"
              onClick={() => toggleItem(8)}
              className="programme-toggle"
              aria-expanded={openItems[8]}
            >
              {openItems[8] ? "Close" : "Open"}
            </button>

            {openItems[8] && (
              <div className="programme-body">
                <p>1.Great is Thy faithfulness, O God, my Father;</p>
                <p>There is no shadow of turning with Thee.</p>
                <p>Thou changest not, Thy compassions, they fail not;</p>
                <p>As Thou hast been, Thou forever wilt be</p>

                <VerseLabel>Refrain</VerseLabel>
                <p className="programme-refrain">
                  <em>
                    Great is Thy faithfulness! Great is Thy faithfulness!
                    <br />
                    Morning by morning new mercies I see;
                    <br />
                    All I have needed Thy hand hath provided;
                    <br />
                    Great is Thy faithfulness, Lord, unto me!
                  </em>
                </p>

                <p>2.Summer and winter and springtime and harvest,</p>
                <p>Sun, moon, and stars in their courses above</p>
                <p>Join with all nature in manifold witness</p>
                <p>To Thy great faithfulness, mercy, and love</p>

                <p>3.Pardon for sin and a peace that endureth,</p>
                <p>Thine own dear presence to cheer and to guide;</p>
                <p>Strength for today and bright hope for tomorrow,</p>
                <p>Blessings all mine, with ten thousand beside!</p>

                <Dir>(Groom should now unveil the Bride)</Dir>
              </div>
            )}
          </div>
        </Reveal>

        {/* 9 — Questions */}
        <Reveal>
          <div className="programme-item">
            <span className="programme-num">9</span>
            <div className="programme-content">
              <p className="programme-title">
                QUESTIONS TO THE GROOM &amp; THE BRIDE &amp; THEIR RESPONSES
              </p>
            </div>
            <button
              type="button"
              onClick={() => toggleItem(9)}
              className="programme-toggle"
              aria-expanded={openItems[9]}
            >
              {openItems[9] ? "Close" : "Open"}
            </button>

            {openItems[9] && (
              <div className="programme-body">
                <VerseLabel>To the Groom:</VerseLabel>
                <p>
                  John, will you have this woman to be your wedded wife, to live together
                  according to God&apos;s ordinance in the holy estate of matrimony? Will you
                  love her, comfort her, honour and keep her in sickness and in health;
                  and, forsaking all others, keep yourself only for her, as long as you
                  both shall live?
                </p>
                <Bold>The man shall answer: &ldquo;I will.&rdquo;</Bold>

                <VerseLabel>To the Bride:</VerseLabel>
                <p>
                  Chioma, will you have this man to be your wedded husband, to live
                  together according to God&apos;s ordinance in the holy estate of matrimony?
                  Will you obey him and serve him, love, honour, and keep him in sickness
                  and in health; and, forsaking all others, keep yourself only for him,
                  as long as you both shall live?
                </p>
                <Bold>The woman shall answer: &ldquo;I will.&rdquo;</Bold>

                <Dir>
                  (Note: The Bride needs to give her flowers to her maid of honour in
                  order to do this. The Bride will receive them again immediately before
                  the recessional hymn. The man with his right hand takes the woman by
                  her right hand and says after the minister:)
                </Dir>
              </div>
            )}
          </div>
        </Reveal>

        {/* 10 — Vows (default collapsed with "Read" button as in mockup) */}
        <Reveal>
          <div className="programme-item">
            <span className="programme-num">10</span>
            <div className="programme-content">
              <p className="programme-title">VOWS</p>
            </div>
            <button
              type="button"
              onClick={() => toggleItem(10)}
              className="programme-toggle"
              aria-expanded={openItems[10]}
            >
              {openItems[10] ? "Close" : "Read"}
            </button>

            {openItems[10] && (
              <div className="programme-body">
                <VerseLabel>The Groom:</VerseLabel>
                <p className="programme-vow-text">
                  I, John, take you, Chioma, to be my wedded wife, / to have and to hold
                  / from this day forward, / for better for worse, / for richer for
                  poorer, / in sickness and in health, / to love and to cherish, / till
                  death do us part, / according to God&apos;s holy ordinance, / and to
                  this I pledge you my faithfulness
                </p>

                <Dir>
                  (Then they shall release their hands; and the woman, taking the man by
                  his right hand with her right hand, shall likewise say after the
                  minister:)
                </Dir>

                <VerseLabel>The Bride:</VerseLabel>
                <p className="programme-vow-text">
                  I, Chioma, take you, John, to be my wedded husband, / to have and to
                  hold / from this day forward, / for better for worse, / for richer for
                  poorer, / in sickness and in health, / to love, cherish, and to obey /
                  till death do us part, / according to God&apos;s holy ordinance, / and to
                  this I pledge you my faithfulness.
                </p>
              </div>
            )}
          </div>
        </Reveal>

        {/* 11 — Ring Ceremony (default collapsed with "Read" button as in mockup) */}
        <Reveal>
          <div className="programme-item">
            <span className="programme-num">11</span>
            <div className="programme-content">
              <p className="programme-title">RING CEREMONY</p>
            </div>
            <button
              type="button"
              onClick={() => toggleItem(11)}
              className="programme-toggle"
              aria-expanded={openItems[11]}
            >
              {openItems[11] ? "Close" : "Read"}
            </button>

            {openItems[11] && (
              <div className="programme-body">
                <Dir>
                  (Note: The rings to be presented to the minister.)
                </Dir>
                <p>
                  The rings I have in my hand are being given as symbols of the covenant
                  that John and Chioma are entering into and establishing this day.
                  These rings are never-ending circles, indicating the continuing and
                  eternal love of God with which you are to love one another. These rings
                  are made of a precious and enduring metal, and one that is not easily
                  tarnished. This represents how valuable and precious your marriage
                  covenant is in God&apos;s sight.
                </p>

                <VerseLabel>To the Groom:</VerseLabel>
                <p>
                  John, as you place this ring on Chioma&apos;s finger, please speak these
                  words to her from your heart:
                </p>
                <p className="programme-vow-text">
                  With this ring I wed you, / with my body I honour you, / and with all
                  my worldly goods I endow you / in the name of the Father, / and of the
                  Son, / and of the Holy Spirit. / Amen.
                </p>

                <VerseLabel>To the Bride:</VerseLabel>
                <p>
                  Chioma, as you place this ring on John&apos;s finger, please speak these
                  words to him from your heart:
                </p>
                <p className="programme-vow-text">
                  With this ring I wed you, / with my body I honour you, / and with all
                  my worldly goods I endow you / in the name of the Father, / and of the
                  Son, / and of the Holy Spirit. / Amen.
                </p>
              </div>
            )}
          </div>
        </Reveal>

        {/* 12 — Prayer */}
        <Reveal>
          <div className="programme-item">
            <span className="programme-num">12</span>
            <div className="programme-content">
              <p className="programme-title">PRAYER</p>
            </div>
            <button
              type="button"
              onClick={() => toggleItem(12)}
              className="programme-toggle"
              aria-expanded={openItems[12]}
            >
              {openItems[12] ? "Close" : "Open"}
            </button>

            {openItems[12] && (
              <div className="programme-body">
                <p>
                  O eternal God, Creator and Preserver of all mankind, Giver of all
                  spiritual grace, the Author of everlasting life; send Your blessing
                  upon these Your children, John and Chioma, whom we bless in Your name.
                  That, living faithfully together, they may surely keep the vow and
                  covenant which they have made today, of which these rings were given
                  and received as a token and pledge. We pray that they may ever remain
                  in perfect love and peace together, and live according to Your laws, in
                  Jesus Christ&apos;s name we pray. Amen
                </p>
              </div>
            )}
          </div>
        </Reveal>

        {/* 13 — Joining & Pronouncement */}
        <Reveal>
          <div className="programme-item">
            <span className="programme-num">13</span>
            <div className="programme-content">
              <p className="programme-title">JOINING &amp; PRONOUNCEMENT</p>
            </div>
            <button
              type="button"
              onClick={() => toggleItem(13)}
              className="programme-toggle"
              aria-expanded={openItems[13]}
            >
              {openItems[13] ? "Close" : "Open"}
            </button>

            {openItems[13] && (
              <div className="programme-body">
                <Dir>
                  (Then the Minister shall join their right hands together and say:)
                </Dir>
                <p className="programme-declaration">
                  &ldquo;THOSE WHOM GOD HAS JOINED TOGETHER, LET NO ONE SEPARATE.&rdquo;
                </p>
                <Dir>(Then the Minister shall speak to the people:)</Dir>
                <p>
                  Since John and Chioma have consented together in holy marriage, and
                  have witnessed this before God and this company, and have given and
                  pledged their faithfulness to each other, and have declared this by
                  giving and receiving rings and by joining hands, I pronounce that they
                  are husband and wife in the name of the Father, and of the Son, and of
                  the Holy Spirit. Amen.
                </p>
                <Dir>(And the Minister shall add this blessing:)</Dir>
                <p>
                  God the Father, God the Son, God the Holy Spirit, bless, preserve and
                  keep you; may the Lord mercifully look upon you with His favour, and so
                  fill you with every spiritual blessing and grace, that you may so live
                  together in this life that in the world to come you may have life
                  everlasting. Amen.
                </p>
              </div>
            )}
          </div>
        </Reveal>

        {/* 14 — Presentation */}
        <Reveal>
          <div className="programme-item">
            <span className="programme-num">14</span>
            <div className="programme-content">
              <p className="programme-title">PRESENTATION</p>
            </div>
            <button
              type="button"
              onClick={() => toggleItem(14)}
              className="programme-toggle"
              aria-expanded={openItems[14]}
            >
              {openItems[14] ? "Close" : "Open"}
            </button>

            {openItems[14] && (
              <div className="programme-body">
                <p>
                  Ladies and Gentlemen, I now present to you Mr. and Mrs. Oladimeji.
                </p>
              </div>
            )}
          </div>
        </Reveal>

        {/* 15 — Hymn 3 */}
        <Reveal>
          <div className="programme-item">
            <span className="programme-num">15</span>
            <div className="programme-content">
              <p className="programme-title">HYMN 3</p>
              <p className="programme-subtitle">Standing on the Promises</p>
            </div>
            <button
              type="button"
              onClick={() => toggleItem(15)}
              className="programme-toggle"
              aria-expanded={openItems[15]}
            >
              {openItems[15] ? "Close" : "Open"}
            </button>

            {openItems[15] && (
              <div className="programme-body">
                <p>1.Standing on the promises of Christ, my King!</p>
                <p>Through eternal ages let His praises ring.</p>
                <p>&ldquo;Glory in the highest!&rdquo; I will shout and sing,</p>
                <p>Standing on the promises of God.</p>

                <VerseLabel>Refrain:</VerseLabel>
                <p className="programme-refrain">
                  <em>
                    Standing, standing,
                    <br />
                    Standing on the promises of God, my Saviour;
                    <br />
                    Standing, standing,
                    <br />
                    I&apos;m standing on the promises of God.
                  </em>
                </p>

                <p>2.Standing on the promises that cannot fail!</p>
                <p>When the howling storms of doubt and fear assail,</p>
                <p>By the living Word of God I shall prevail,</p>
                <p>Standing on the promises of God.</p>

                <VerseLabel>Refrain</VerseLabel>

                <p>3.Standing on the promises, I now can see</p>
                <p>Perfect, present cleansing in the blood for me;</p>
                <p>Standing in the liberty where Christ makes free,</p>
                <p>Standing on the promises of God.</p>

                <VerseLabel>Refrain</VerseLabel>

                <p>4.Standing on the promises of Christ, the Lord,</p>
                <p>Bound to Him eternally by love&apos;s strong cord,</p>
                <p>Overcoming daily with the Spirit&apos;s sword,</p>
                <p>Standing on the promises of God</p>

                <VerseLabel>Refrain</VerseLabel>

                <p>5.Standing on the promises I cannot fall,</p>
                <p>List&apos;ning every moment to the Spirit&apos;s call,</p>
                <p>Resting in my Saviour as my all in all,</p>
                <p>Standing on the promises of God.</p>

                <VerseLabel>Refrain</VerseLabel>
              </div>
            )}
          </div>
        </Reveal>

        {/* 16 */}
        <Reveal>
          <div className="programme-item">
            <span className="programme-num">16</span>
            <div className="programme-content">
              <p className="programme-title">MESSAGE</p>
            </div>
          </div>
        </Reveal>

        {/* 17 */}
        <Reveal>
          <div className="programme-item">
            <span className="programme-num">17</span>
            <div className="programme-content">
              <p className="programme-title">SIGNING OF MARRIAGE REGISTER</p>
            </div>
          </div>
        </Reveal>

        {/* 18 */}
        <Reveal>
          <div className="programme-item">
            <span className="programme-num">18</span>
            <div className="programme-content">
              <p className="programme-title">OFFERING AND THANKSGIVING</p>
            </div>
          </div>
        </Reveal>

        {/* 19 */}
        <Reveal>
          <div className="programme-item">
            <span className="programme-num">19</span>
            <div className="programme-content">
              <p className="programme-title">CLOSING PRAYER</p>
            </div>
          </div>
        </Reveal>

        {/* 20 — Recessional Hymn 4 */}
        <Reveal>
          <div className="programme-item">
            <span className="programme-num">20</span>
            <div className="programme-content">
              <p className="programme-title">RECESSIONAL HYMN 4</p>
              <p className="programme-subtitle">Amazing Grace</p>
            </div>
            <button
              type="button"
              onClick={() => toggleItem(20)}
              className="programme-toggle"
              aria-expanded={openItems[20]}
            >
              {openItems[20] ? "Close" : "Open"}
            </button>

            {openItems[20] && (
              <div className="programme-body">
                <p>1.Amazing grace (how sweet the sound)</p>
                <p>That saved a wretch like me!</p>
                <p>I once was lost, but now am found,</p>
                <p>Was blind, but now I see.</p>

                <p>2.&apos;Twas grace that taught my heart to fear,</p>
                <p>And grace my fears relieved;</p>
                <p>How precious did that grace appear</p>
                <p>The hour I first believed!</p>

                <p>3.Through many dangers, toils and snares</p>
                <p>I have already come:</p>
                <p>&apos;Tis grace has brought me safe thus far,</p>
                <p>And grace will lead me home.</p>

                <p>4.The Lord has promised good to me,</p>
                <p>His word my hope secures;</p>
                <p>He will my shield and portion be</p>
                <p>As long as life endures.</p>

                <p>5.Yes, when this flesh and heart shall fail,</p>
                <p>And mortal life shall cease,</p>
                <p>I shall possess, within the veil,</p>
                <p>A life of joy and peace.</p>

                <p>6.The earth shall soon dissolve like snow,</p>
                <p>The sun forbear to shine;</p>
                <p>But God, who called me here below,</p>
                <p>Will be forever mine.</p>
              </div>
            )}
          </div>
        </Reveal>

        {/* ---- Officiating Ministers ---- */}
        <Reveal>
          <footer className="programme-footer">
            <h3 className="programme-ministers-title">OFFICIATING MINISTERS</h3>
            <ol className="programme-ministers-list">
              <li>Pastor Jonathan Ogungbe</li>
              <li>Pastor Yemi Akinseye-George</li>
              <li>Pastor Olumayowa Aleshin</li>
              <li>Pastor Ikponmwosa Omoigiade</li>
            </ol>
          </footer>
        </Reveal>

        <Reveal>
          <p className="programme-closing">Thank you for celebrating with us.</p>
        </Reveal>
      </main>
    </div>
  );
}
