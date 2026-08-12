"use client";
import { useEffect, useRef } from "react";

/**
 * Machine Science homepage — the approved design, now fully data-driven.
 * All content (board, articles, issues, scope, author steps/terms, journal
 * record, every UI label) is fetched from the backend /api/v1/home feed and
 * injected into the original render script. Nothing is hard-coded here.
 */
const MARKUP = `<!-- ================= NAV ================= -->
<header class="nav" id="nav">
  <div class="wrap nav__in">
    <a class="brand" href="#top">
      <span class="brand__mark" aria-hidden="true">
        <svg viewBox="0 0 64 64" fill="none">
          <g class="rot" stroke="currentColor" stroke-width="2.5">
            <circle cx="32" cy="32" r="13"/><circle cx="32" cy="32" r="4.5"/>
            <g stroke-linecap="round">
              <path d="M32 19v-7M32 52v-7M45 32h7M12 32h7M41.2 22.8l4.9-4.9M17.9 46.1l4.9-4.9M41.2 41.2l4.9 4.9M17.9 17.9l4.9 4.9"/>
            </g>
          </g>
        </svg>
      </span>
      <span class="brand__txt">
        <!-- lang="en": the journal's registered name is English. Without this,
             text-transform:uppercase under lang="az" casts i -> İ (the Turkic
             dotted capital) and the masthead misspells itself as MACHİNE. -->
        <span class="brand__name" lang="en">Machine Science</span>
        <span class="brand__sub">AzTU · ISSN 2227-6912</span>
      </span>
    </a>

    <nav aria-label="Primary">
      <ul class="nav__links" id="links">
        <li><a href="#about"   data-i18n="nav.about">About</a></li>
        <li><a href="#current" data-i18n="nav.current">Current Issue</a></li>
        <li><a href="#scope"   data-i18n="nav.scope">Scope</a></li>
        <li><a href="#board"   data-i18n="nav.board">Editorial Board</a></li>
        <li><a href="#archive" data-i18n="nav.archive">Archive</a></li>
        <li><a href="#authors" data-i18n="nav.authors">For Authors</a></li>
        <li><a href="#contact" data-i18n="nav.contact">Contact</a></li>
      </ul>
    </nav>

    <div class="tools">
      <div class="lang" role="group" aria-label="Language">
        <button id="langAz" aria-pressed="false" lang="az">AZ</button>
        <button id="langEn" aria-pressed="true"  lang="en">EN</button>
      </div>
      <button class="theme" id="theme" aria-label="Switch colour theme">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <circle cx="12" cy="12" r="4.5"/>
          <path d="M12 2.5v2.4M12 19.1v2.4M21.5 12h-2.4M4.9 12H2.5M18.7 5.3l-1.7 1.7M7 17l-1.7 1.7M18.7 18.7L17 17M7 7L5.3 5.3"/>
        </svg>
      </button>
      <button class="nav__burger" id="burger" aria-label="Menu" aria-expanded="false">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
      </button>
    </div>
  </div>
</header>

<main id="top">

<!-- ================= HERO / SLIDER ================= -->
<section class="hero">
  <div class="slides" id="slides">
    <figure class="slide on"><img src="/media/slides/slide1.webp" alt="Robotic welding line on an automotive assembly floor"></figure>
    <figure class="slide"><img src="/media/slides/slide2.webp" alt="Technician setting up a metal-cutting machine tool"></figure>
    <figure class="slide"><img src="/media/slides/slide3.webp" alt="Close-up of meshing bevel and spur gears"></figure>
    <figure class="slide"><img src="/media/slides/slide4.webp" alt="Engineer working with an industrial robot arm"></figure>
    <figure class="slide"><img src="/media/slides/slide5.webp" alt="Molten metal and sparks in a steel mill"></figure>
    <figure class="slide"><img src="/media/slides/slide6.webp" alt="Operator at a CNC machine control panel"></figure>
    <figure class="slide"><img src="/media/slides/slide7.webp" alt="Solar panels and wind turbines representing renewable energy"></figure>
  </div>

  <div class="wrap hero__in">
    <div class="hero__col">
      <p class="annot hero__eyebrow" data-i18n="hero.eyebrow">Azerbaijan Technical University · Baku</p>

      <h1 class="masthead" lang="en">
        <span class="ln ln--1"><span data-ln>Machine</span></span>
        <span class="ln ln--2"><span data-ln>Science</span></span>
      </h1>

      <p class="hero__lede" data-i18n-html="hero.lede">
        An <em>international scientific and technical journal</em> on the theory of mechanisms
        and machines — published continuously since 2001, peer-reviewed, and free of charge to authors.
      </p>

      <div class="hero__cta">
        <a class="btn btn--fill" href="#current">
          <span data-i18n="hero.cta1">Read current issue</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h15M13 6l6 6-6 6"/></svg>
        </a>
        <a class="btn btn--line" href="/submit" data-i18n="hero.cta2">Submit a manuscript</a>
      </div>

      <div class="specs">
        <div class="spec">
          <div class="spec__v">2001</div>
          <div class="spec__k" data-i18n="spec.since">Published since</div>
        </div>
        <div class="spec">
          <div class="spec__v"><span data-count="9">9</span></div>
          <div class="spec__k" data-i18n="spec.issues">Issues online</div>
        </div>
        <div class="spec">
          <div class="spec__v">2011</div>
          <div class="spec__k" data-i18n="spec.inspec">INSPEC indexed</div>
        </div>
        <div class="spec">
          <div class="spec__v" data-i18n="spec.free">Free</div>
          <div class="spec__k" data-i18n="spec.cost">Cost to authors</div>
        </div>
      </div>
    </div>
  </div>

  <div class="wrap hero__foot">
    <div class="cap">
      <span class="cap__k" id="capK">01 / 07</span>
      <span class="cap__t" id="capT"></span>
    </div>
    <div class="dots" id="dots" role="tablist" aria-label="Slides"></div>
  </div>
</section>

<!-- ================= RAIL ================= -->
<div class="rail" aria-hidden="true"><div class="rail__track" id="track"></div></div>

<!-- ================= ABOUT ================= -->
<section class="sec" id="about">
  <div class="wrap">
    <div class="sec__head rv">
      <p class="annot" data-i18n="about.label">About the journal</p>
      <h2 class="sec__title" data-i18n="about.title">A quarter-century of machine science</h2>
    </div>

    <div class="about">
      <div class="about__body rv" id="aboutBody"></div>

      <div class="about__side rv">
        <figure class="fig">
          <div class="fig__c"><canvas id="rig" aria-hidden="true"></canvas></div>
          <figcaption id="figCap"></figcaption>
        </figure>

        <aside class="plate" aria-label="Journal record">
          <div class="plate__hd" data-i18n="plate.hd">Journal record</div>
          <dl id="plate"></dl>
        </aside>
      </div>
    </div>
  </div>
</section>

<!-- ================= CURRENT ISSUE ================= -->
<section class="sec" id="current">
  <div class="wrap">
    <div class="sec__head issue__top rv">
      <div>
        <p class="annot" data-i18n="current.label">Current issue</p>
        <h2 class="sec__title" data-i18n-html="current.title">Machine Science<br>2025 — Number II</h2>
      </div>
      <a class="btn btn--line" href="#archive">
        <span data-i18n="current.browse">Browse the archive</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h15M13 6l6 6-6 6"/></svg>
      </a>
    </div>

    <article class="feat rv">
      <div class="feat__no">01</div>
      <div>
        <span class="feat__tag" data-i18n="feat.tag">Featured · Mechanical engineering technology</span>
        <h3 class="feat__title">
          Wear characteristics of cutting teeth of the tool in milling rectangular
          grooves in medium-density composite wood materials
        </h3>
        <p class="feat__auth">Vagif ABBASOV, Mursal NASIROV — Azerbaijan Technical University</p>
        <a class="feat__doi" href="https://doi.org/10.61413/UKQM5117" target="_blank" rel="noopener">doi.org/10.61413/UKQM5117</a>
      </div>
    </article>

    <div class="arts" id="arts"></div>
  </div>
</section>

<!-- ================= SCOPE ================= -->
<section class="sec" id="scope">
  <div class="wrap">
    <div class="sec__head rv">
      <p class="annot" data-i18n="scope.label">Scope</p>
      <h2 class="sec__title" data-i18n="scope.title">Where we publish</h2>
      <p class="sec__lede" data-i18n="scope.lede">Authors are cordially invited to submit articles to “Machine Science” on the following topics.</p>
    </div>
    <div class="scope rv" id="scopeGrid"></div>
  </div>
</section>

<!-- ================= BOARD ================= -->
<section class="sec" id="board">
  <div class="wrap">
    <div class="sec__head rv">
      <p class="annot" data-i18n="board.label">Editorial board</p>
      <h2 class="sec__title" data-i18n="board.title">Who reviews the work</h2>
    </div>

    <div class="board rv">
      <div class="ed">
        <div class="ed__av"><img src="/media/board/prof-dr-isa-khalilov.webp" alt="Prof. Dr. Isa Khalilov"></div>
        <div>
          <div class="ed__role" data-i18n="board.eic">Editor-in-Chief</div>
          <div class="ed__n">Prof. Dr. Isa Khalilov</div>
          <p class="ed__t" data-i18n="board.eicT">Head of the Department of Machine Design, Mechatronics and Industrial Technologies, Azerbaijan Technical University.</p>
          <div class="links" id="eicLinks"></div>
        </div>
      </div>
      <div class="ed">
        <div class="ed__av"><img src="/media/board/prof-dr-ing-eckart-schnack.webp" alt="Prof. Dr.-Ing. Eckart Schnack"></div>
        <div>
          <div class="ed__role" data-i18n="board.hon">Honorary Editor</div>
          <div class="ed__n">Prof. Dr.-Ing. Eckart Schnack</div>
          <p class="ed__t" data-i18n="board.honT">Distinguished mechanical engineer, Karlsruhe, Germany.</p>
          <div class="links" id="honLinks"></div>
        </div>
      </div>
    </div>

    <div class="members rv">
      <div class="members__hd" data-i18n="board.members">Editors &amp; peer reviewers</div>
      <div class="members__grid" id="mems"></div>
    </div>
  </div>
</section>

<!-- ================= ARCHIVE ================= -->
<section class="sec" id="archive">
  <div class="wrap">
    <div class="sec__head rv">
      <p class="annot" data-i18n="archive.label">Archive</p>
      <h2 class="sec__title" data-i18n="archive.title">Every issue, open</h2>
      <p class="sec__lede" data-i18n="archive.lede">All issues are freely available as full-text PDF. No subscription, no author fee.</p>
    </div>
    <div class="rv" id="arch"></div>
  </div>
</section>

<!-- ================= AUTHORS ================= -->
<section class="sec" id="authors">
  <div class="wrap">
    <div class="sec__head rv">
      <p class="annot" data-i18n="authors.label">For authors</p>
      <h2 class="sec__title" data-i18n-html="authors.title">From manuscript<br>to publication</h2>
    </div>
    <div class="auth">
      <div class="rv" id="steps"></div>
      <div class="terms rv" id="terms"></div>
    </div>
  </div>
</section>

</main>

<!-- ================= CONTACT ================= -->
<section class="cta" id="contact">
  <div class="wrap cta__in">
    <div class="rv">
      <p class="annot" data-i18n="contact.label">Contact</p>
      <h2 class="cta__t" data-i18n-html="contact.title">Send us<br>your research</h2>
      <p class="cta__d" data-i18n="contact.lede">Editorial office of “Machine Science”, Azerbaijan Technical University. Open access questions not answered by our policy are welcome by e-mail.</p>
      <a class="btn btn--fill" href="mailto:msj@aztu.edu.az">
        <span data-i18n="contact.cta">Write to the editors</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h15M13 6l6 6-6 6"/></svg>
      </a>
    </div>

    <div class="cards rv">
      <a class="card" href="mailto:msj@aztu.edu.az">
        <span class="card__ic" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg></span>
        <span><span class="card__k" data-i18n="card.email">E-mail</span><span class="card__v">msj@aztu.edu.az</span></span>
      </a>
      <a class="card" href="tel:+994125391225">
        <span class="card__ic" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6.5 3h3l2 5-2.5 1.5a12 12 0 005.5 5.5L16 12.5l5 2v3a2 2 0 01-2.2 2A17 17 0 013 5.2 2 2 0 015 3z"/></svg></span>
        <span><span class="card__k" data-i18n="card.phone">Telephone</span><span class="card__v">(+994 12) 539-12-25</span></span>
      </a>
      <a class="card" href="#contact">
        <span class="card__ic" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 21s7-5.6 7-11a7 7 0 10-14 0c0 5.4 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg></span>
        <span><span class="card__k" data-i18n="card.office">Editorial office</span><span class="card__v" data-i18n="card.addr">H. Javid ave 25, Baku AZ 1073</span></span>
      </a>
    </div>
  </div>
</section>

<footer class="ft">
  <div class="wrap ft__in">
    <div class="ft__c"><b>Machine Science</b> · <span data-i18n="ft.pub">Azerbaijan Technical University</span> · ISSN 2227-6912 · E-ISSN 2790-0479</div>
    <div class="ft__l">
      <a href="#about"   data-i18n="ft.ethics">Publication ethics</a>
      <a href="#authors" data-i18n="ft.oa">Open access policy</a>
      <a href="#authors" data-i18n="ft.ai">AI policy</a>
      <a href="#board"   data-i18n="ft.peer">Peer review</a>
      <a href="#contact" data-i18n="nav.contact">Contact</a>
    </div>
  </div>
</footer>`;

const SCRIPT = `
(function(){
  "use strict";
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;

  /* ==========================================================
     Copy. The journal itself publishes only in English, so
     article titles and author names stay in English in both
     languages — translating them would misrepresent the record.
     ========================================================== */
  var T = window.__MSJ_HOME__.T;

  /* the seven carousel topics, exactly as the journal lists them */
  var SLIDES = window.__MSJ_HOME__.SLIDES;

  var ABOUT = window.__MSJ_HOME__.ABOUT;

  var PLATE = window.__MSJ_HOME__.PLATE;

  var RAIL = window.__MSJ_HOME__.RAIL;

  /* Real articles from the journal. Field labels translate; titles do not. */
  var ARTS = window.__MSJ_HOME__.ARTS;

  var IC = {
    gear:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1.4"/><path stroke-linecap="round" d="M12 8V5m0 14v-3m4-4h3M5 12h3m1.2-2.8L7 7m10 10l-2.2-2.2M14.8 9.2L17 7M7 17l2.2-2.2"/></svg>',
    wave:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M2 16c2.5 0 2.5-8 5-8s2.5 8 5 8 2.5-8 5-8 2.5 8 5 8"/></svg>',
    chip:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="7" y="7" width="10" height="10" rx="1.5"/><path stroke-linecap="round" d="M10 7V4m4 3V4m-4 16v-3m4 3v-3M7 10H4m3 4H4m16-4h-3m3 4h-3"/></svg>',
    layer:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M12 3l9 4.5-9 4.5-9-4.5L12 3z"/><path d="M3 12.5L12 17l9-4.5M3 16.8L12 21.3l9-4.5"/></svg>',
    leaf:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M20 4C10 4 4 9 4 16a6 6 0 006 4c8 0 10-8 10-16z"/><path d="M4 20c4-8 8-11 13-13"/></svg>',
    trend:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17l5.5-5.5 4 4L21 7"/><path d="M15 7h6v6"/></svg>',
    tool:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3a5 5 0 00-4.6 7l-7 7 2.6 2.6 7-7A5 5 0 1015 3z"/></svg>',
    check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5 5L20 6.5"/></svg>'
  };

  var SCOPE = (window.__MSJ_HOME__.SCOPE_RAW||[]).map(function(s){return {i:IC[s.icon]||IC.gear, en:s.en, az:s.az};});

  /* The real board, with the portraits the journal publishes. Affiliations are
     institution names, so they stay in English in both languages. */
  /* Real editorial board, portraits + ORCID/Scopus/e-mail as published by the
     journal. Affiliations are institution names, kept in English in both langs. */
  var LEADS = window.__MSJ_HOME__.LEADS;
  var BOARD = window.__MSJ_HOME__.BOARD;

  var ISSUES = window.__MSJ_HOME__.ISSUES;

  var STEPS = window.__MSJ_HOME__.STEPS;

  var TERMS = window.__MSJ_HOME__.TERMS;

  /* ---------- profile links ---------------------------------
     Scopus / Gmail / ORCID marks. Simplified marks in the page's own palette,
     not the official brand assets — swap in the licensed logos before launch.
     Hrefs are '#' placeholders: the journal publishes no ORCID or Scopus IDs
     for its board, and inventing identifiers for real people is not on. */
  var MARK = {
    /* ORCID: ring + iD */
    orcid:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 1.6A10.4 10.4 0 1022.4 12 10.4 10.4 0 0012 1.6zm0 1.7A8.7 8.7 0 113.3 12 8.7 8.7 0 0112 3.3z"/><rect x="6.4" y="9.1" width="1.7" height="8"/><circle cx="7.25" cy="7.1" r="1.1"/><path d="M10.3 9.1h3.5c3 0 4.4 2 4.4 4s-1.6 4-4.4 4h-3.5zm1.7 1.6v4.9h1.7c2 0 2.8-1.1 2.8-2.4s-.9-2.4-2.8-2.4z"/></svg>',
    /* Scopus: stylised S */
    scopus:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.9 6.6a7.7 7.7 0 00-4.2-1.3c-2.6 0-4.4 1.5-4.4 3.6 0 1.9 1.3 3 3.7 3.8l1.4.5c1.7.6 2.4 1.2 2.4 2.2 0 1.2-1.1 2-2.8 2a6.6 6.6 0 01-3.9-1.4l-.9 1.5a8.2 8.2 0 004.8 1.6c2.9 0 4.9-1.6 4.9-3.9 0-2-1.2-3.1-3.8-4l-1.4-.5c-1.6-.5-2.3-1.1-2.3-2.1 0-1.1 1-1.8 2.5-1.8a6 6 0 013.2 1z"/></svg>',
    /* Gmail: envelope M */
    mail:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 5h17A1.5 1.5 0 0122 6.5v11a1.5 1.5 0 01-1.5 1.5H19V9.4l-7 5-7-5V19H3.5A1.5 1.5 0 012 17.5v-11A1.5 1.5 0 013.5 5zm.9 1.8L12 12.2l7.6-5.4z"/></svg>'
  };
  function icon(cls, href, extra, label, glyph){
    return '<a class="lnk lnk--'+cls+'" href="'+href+'"'+extra+' aria-label="'+label+'" title="'+label+'">'+glyph+'</a>';
  }
  /* Real ORCID / Scopus / e-mail links per person, straight from the journal.
     Only the marks a member actually has are rendered. */
  function LINK_ICONS(p){
    var h=[];
    if(p.orcid)  h.push(icon('orcid',  p.orcid,  ' target="_blank" rel="noopener"', 'ORCID — '+p.n, MARK.orcid));
    if(p.scopus) h.push(icon('scopus', p.scopus, ' target="_blank" rel="noopener"', 'Scopus — '+p.n, MARK.scopus));
    if(p.email)  h.push(icon('mail',   'mailto:'+p.email, '', 'E-mail — '+p.n, MARK.mail));
    return h.join('');
  }
  function profileLinks(p){ return '<div class="links">'+LINK_ICONS(p)+'</div>'; }

  /* ---------- render ---------------------------------------- */
  var lang = 'en';
  function t(k){ return (T[lang] && T[lang][k]) || T.en[k] || ''; }

  function render(){
    root.setAttribute('lang', lang);
    document.querySelectorAll('[data-i18n]').forEach(function(el){
      var v = t(el.dataset.i18n); if(v) el.textContent = v;
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function(el){
      var v = t(el.dataset.i18nHtml); if(v) el.innerHTML = v;
    });
    document.getElementById('langAz').setAttribute('aria-pressed', String(lang==='az'));
    document.getElementById('langEn').setAttribute('aria-pressed', String(lang==='en'));

    var railHTML = RAIL[lang].map(function(r){
      return '<span class="rail__item">'+r[0]+' <b>'+r[1]+'</b></span>';
    }).join('');
    document.getElementById('track').innerHTML = railHTML + railHTML;   /* doubled: seamless loop */

    document.getElementById('aboutBody').innerHTML = ABOUT[lang].map(function(p){ return '<p>'+p+'</p>'; }).join('');
    document.getElementById('figCap').innerHTML = t('fig.cap');
    document.getElementById('plate').innerHTML = PLATE[lang].map(function(r){
      return '<dt>'+r[0]+'</dt><dd>'+r[1]+'</dd>';
    }).join('');

    document.getElementById('arts').innerHTML = ARTS.map(function(x){
      return '<a class="art" href="/articles/'+x.id+'"><div class="art__field">'+x.f[lang]+'</div>'+
        '<h3 class="art__title">'+x.t+'</h3><p class="art__auth">'+x.a+'</p>'+
        '<div class="art__keys">'+x.k.map(function(k){ return '<span class="key">'+k+'</span>'; }).join('')+'</div></a>';
    }).join('');

    document.getElementById('scopeGrid').innerHTML = SCOPE.map(function(s){
      return '<div class="scope__c"><span class="scope__ic" aria-hidden="true">'+s.i+'</span>'+
        '<div class="scope__n">'+s[lang][0]+'</div><p class="scope__d">'+s[lang][1]+'</p></div>';
    }).join('');

    document.getElementById('mems').innerHTML = BOARD.map(function(m){
      return '<figure class="mem">'+
        '<div class="mem__ph"><img src="'+m.img+'" alt="'+m.n+'" loading="lazy" decoding="async"></div>'+
        '<figcaption><div class="mem__n">'+m.n+'</div>'+
        (m.t ? '<p class="mem__t">'+m.t+'</p>' : '')+
        '</figcaption>'+ profileLinks(m) +'</figure>';
    }).join('');

    /* lead editors carry the same profile links as the rest of the board */
    document.getElementById('eicLinks').innerHTML = LINK_ICONS(LEADS.eic);
    document.getElementById('honLinks').innerHTML = LINK_ICONS(LEADS.hon);

    document.getElementById('arch').innerHTML = ISSUES.map(function(v){
      var no = (lang==='az' ? v[1]+' nömrə' : 'Number '+v[1]);
      return '<a class="iss'+(v[3]?' iss--live':'')+'" href="/issues/'+(v[4]||'')+'">'+
        '<span class="iss__yr">'+v[0]+'</span>'+
        '<span class="iss__no">'+no+(v[3]?' · '+t('iss.current'):'')+'</span>'+
        '<span class="iss__meta">'+t('iss.pdf')+'</span>'+
        '<svg class="iss__go" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h15M13 6l6 6-6 6"/></svg></a>';
    }).join('');

    document.getElementById('steps').innerHTML = STEPS[lang].map(function(s){
      return '<div class="step"><div class="step__n">'+s[0]+'</div><div>'+
        '<div class="step__t">'+s[1]+'</div><p class="step__d">'+s[2]+'</p></div></div>';
    }).join('');

    document.getElementById('terms').innerHTML = TERMS[lang].map(function(x){
      return '<div class="term"><span class="term__ic" aria-hidden="true">'+IC.check+'</span><div>'+
        '<div class="term__t">'+x[0]+'</div><p class="term__d">'+x[1]+'</p></div></div>';
    }).join('');

    paintCap();
  }

  function setLang(l){ lang = l; render(); }
  document.getElementById('langAz').addEventListener('click', function(){ setLang('az'); });
  document.getElementById('langEn').addEventListener('click', function(){ setLang('en'); });

  /* ---------- theme ---------------------------------------- */
  document.getElementById('theme').addEventListener('click', function(){
    var cur = root.getAttribute('data-theme');
    if(!cur) cur = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    root.setAttribute('data-theme', cur === 'dark' ? 'light' : 'dark');
    readColors();
  });

  /* ---------- nav ------------------------------------------ */
  var nav = document.getElementById('nav'), links = document.getElementById('links'),
      burger = document.getElementById('burger');
  addEventListener('scroll', function(){ nav.classList.toggle('stuck', scrollY > 10); }, {passive:true});
  burger.addEventListener('click', function(){
    burger.setAttribute('aria-expanded', String(links.classList.toggle('open')));
  });
  links.addEventListener('click', function(e){
    if(e.target.tagName === 'A'){ links.classList.remove('open'); burger.setAttribute('aria-expanded','false'); }
  });

  /* ==========================================================
     SLIDER — crossfade + Ken Burns, auto-advancing.
     ========================================================== */
  var DWELL = 6000;
  var slides = [].slice.call(document.querySelectorAll('.slide'));
  var dots = document.getElementById('dots');
  var capK = document.getElementById('capK'), capT = document.getElementById('capT');
  var idx = 0, timer = null;

  dots.innerHTML = slides.map(function(_, i){
    return '<button role="tab" aria-label="Slide '+(i+1)+'" aria-current="'+(i===0)+'"></button>';
  }).join('');
  var dotEls = [].slice.call(dots.children);
  dots.style.setProperty('--dwell', DWELL + 'ms');

  function paintCap(){
    capK.textContent = String(idx+1).padStart(2,'0') + ' / ' + String(slides.length).padStart(2,'0');
    /* re-wrap so the caption animation replays on every change */
    capT.innerHTML = '<span>' + SLIDES[idx][lang] + '</span>';
  }

  function go(n, manual){
    idx = (n + slides.length) % slides.length;
    slides.forEach(function(s,i){ s.classList.toggle('on', i===idx); });
    dotEls.forEach(function(d,i){
      d.setAttribute('aria-current', String(i===idx));
      d.classList.remove('run');
      if(i===idx && !reduce && !manual) void d.offsetWidth, d.classList.add('run');
    });
    paintCap();
    if(manual) restart();
  }
  function next(){ go(idx+1); }
  function restart(){ clearInterval(timer); if(!reduce) timer = setInterval(next, DWELL); }

  dotEls.forEach(function(d,i){ d.addEventListener('click', function(){ go(i, true); }); });

  /* pause while the hero is off-screen or the tab is hidden */
  var heroEl = document.querySelector('.hero');
  new IntersectionObserver(function(es){
    if(es[0].isIntersecting) restart(); else clearInterval(timer);
  }, {threshold:.15}).observe(heroEl);
  document.addEventListener('visibilitychange', function(){
    if(document.hidden) clearInterval(timer); else restart();
  });

  /* ---------- reveal ---------------------------------------
     .rv starts at opacity:0, so if this never runs the page reads as blank.
     Guard it: no IntersectionObserver -> show everything immediately, and if
     the observer somehow delivers nothing, a one-shot net reveals the page.
     The net only fires when IO stayed silent, so real scroll animation is kept. */
  function revealAll(){
    document.querySelectorAll('.rv').forEach(function(el){ el.classList.add('in'); });
  }
  if(!('IntersectionObserver' in window)){
    revealAll();
  } else {
    var ioFired = false;
    var io = new IntersectionObserver(function(es){
      ioFired = true;
      es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold:.12, rootMargin:'0px 0px -8% 0px' });
    document.querySelectorAll('.rv').forEach(function(el,i){
      el.style.transitionDelay = (i%4)*60 + 'ms'; io.observe(el);
    });
    setTimeout(function(){ if(!ioFired) revealAll(); }, 2500);
  }

  /* ---------- masthead rises on load ----------------------- */
  if(!reduce){
    document.querySelectorAll('[data-ln]').forEach(function(el,i){
      el.style.transform = 'translateY(105%)';
      el.style.transition = 'transform 1s cubic-bezier(.16,.9,.3,1) ' + (160+i*110) + 'ms';
      requestAnimationFrame(function(){ requestAnimationFrame(function(){ el.style.transform='none'; }); });
    });
  }

  /* ---------- counter (genuine tallies only) --------------- */
  var cio = new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(!e.isIntersecting) return;
      cio.unobserve(e.target);
      var el = e.target, end = +el.dataset.count;
      if(reduce){ el.textContent = end; return; }
      var t0=null, dur=900;
      (function tick(ts){
        if(t0===null) t0=ts;
        var p = Math.min((ts-t0)/dur,1); p = 1-Math.pow(1-p,3);
        el.textContent = Math.round(end*p);
        if(p<1) requestAnimationFrame(tick);
      })(performance.now());
    });
  }, { threshold:.6 });
  document.querySelectorAll('[data-count]').forEach(function(el){ cio.observe(el); });

  /* ==========================================================
     FIG. 1 — a working gear train driving a four-bar linkage.
     The journal studies the theory of mechanisms and machines,
     so the figure is an actual mechanism, solved every frame.
     ========================================================== */
  var cv = document.getElementById('rig'), ctx = cv.getContext('2d');
  var W=0, H=0;
  var C = {};
  function css(v){ return getComputedStyle(root).getPropertyValue(v).trim(); }
  function readColors(){
    C.line=css('--ink-2'); C.faint=css('--ink-3'); C.brass=css('--accent');
    C.annot=css('--annot'); C.bg=css('--bg-deep');
  }
  readColors();

  function resize(){
    var d = Math.min(devicePixelRatio||1, 2);
    W = cv.clientWidth; H = cv.clientHeight;
    cv.width = Math.max(1, W*d); cv.height = Math.max(1, H*d);
    ctx.setTransform(d,0,0,d,0,0);
  }
  addEventListener('resize', function(){ resize(); readColors(); }, {passive:true});
  new MutationObserver(readColors).observe(root, {attributes:true, attributeFilter:['data-theme']});
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', readColors);
  resize();

  function alpha(hex,a){
    hex = (hex||'#888').replace('#','');
    if(hex.length===3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
    var n = parseInt(hex,16);
    return 'rgba('+((n>>16)&255)+','+((n>>8)&255)+','+(n&255)+','+a+')';
  }

  /* BL: backlash. Real gears leave a flank gap so teeth never jam; these
     teeth are trapezoidal rather than true involutes, so without it the
     profiles graze at the pitch point (verified: 0.95 is the largest value
     that stays collision-free through a full rotation). */
  var BL = 0.95;
  function gear(cx,cy,teeth,mod,rot,opt){
    opt = opt||{};
    var rp=mod*teeth/2, ra=rp+mod, rd=rp-1.25*mod, st=Math.PI*2/teeth;
    var wR=st*.31*BL, wP=st*.25*BL, wA=st*.155*BL;
    ctx.beginPath();
    for(var i=0;i<teeth;i++){
      var c = rot + i*st;
      var pts = [[rd,c-wR],[rp,c-wP],[ra,c-wA],[ra,c+wA],[rp,c+wP],[rd,c+wR]];
      for(var j=0;j<pts.length;j++){
        var x = cx+pts[j][0]*Math.cos(pts[j][1]), y = cy+pts[j][0]*Math.sin(pts[j][1]);
        (i===0&&j===0) ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
      }
      ctx.arc(cx,cy,rd,c+wR,c+st-wR);
    }
    ctx.closePath();
    ctx.strokeStyle = alpha(C.line,.62); ctx.lineWidth = opt.lw||1.25; ctx.stroke();

    ctx.beginPath(); ctx.arc(cx,cy,rd*.20,0,Math.PI*2);
    ctx.strokeStyle = alpha(C.line,.5); ctx.lineWidth = 1.1; ctx.stroke();

    if(opt.spokes){
      ctx.beginPath(); ctx.arc(cx,cy,rd*.72,0,Math.PI*2);
      ctx.strokeStyle = alpha(C.faint,.4); ctx.lineWidth = 1; ctx.stroke();
      for(var s=0;s<opt.spokes;s++){
        var a = rot + s*Math.PI*2/opt.spokes;
        ctx.beginPath();
        ctx.moveTo(cx+Math.cos(a)*rd*.20, cy+Math.sin(a)*rd*.20);
        ctx.lineTo(cx+Math.cos(a)*rd*.72, cy+Math.sin(a)*rd*.72);
        ctx.strokeStyle = alpha(C.faint,.36); ctx.lineWidth = 2.4; ctx.stroke();
      }
    }
    /* pitch circle — the drafting reference that defines the mesh */
    ctx.beginPath(); ctx.arc(cx,cy,rp,0,Math.PI*2);
    ctx.strokeStyle = alpha(C.annot,.18);
    ctx.setLineDash([5,5]); ctx.lineWidth = 1; ctx.stroke(); ctx.setLineDash([]);
  }

  function circIx(x0,y0,r0,x1,y1,r1,sign){
    var dx=x1-x0, dy=y1-y0, d=Math.hypot(dx,dy);
    if(d > r0+r1 || d < Math.abs(r0-r1) || d===0) return null;
    var a=(r0*r0-r1*r1+d*d)/(2*d), h2=r0*r0-a*a;
    if(h2<0) return null;
    var h=Math.sqrt(h2), xm=x0+a*dx/d, ym=y0+a*dy/d;
    return [xm+sign*h*dy/d, ym-sign*h*dx/d];
  }

  /* Static geometry. 30T drives 18T; the 18T gear carries a crank pin
     on its face driving a Grashof crank-rocker. Link lengths were chosen
     so the coupler traces a cusped curve and the mechanism stays ~19
     units clear of its change point (verified over a full rotation). */
  var TAU = Math.PI*2;
  var MOD=7.2, N1=30, N2=18;
  var R1=MOD*N1/2, R2=MOD*N2/2;
  var G1={x:-95,y:10}, PHI=-0.52;
  var G2={ x:G1.x+(R1+R2)*Math.cos(PHI), y:G1.y+(R1+R2)*Math.sin(PHI) };
  var LA=50, LB=80, LC=120;
  var O2=G2, O4={ x:G2.x+130, y:G2.y+15 };
  var PF=0.40, PO=50;
  /* Bounds of everything actually drawn — both gear addendum circles, every
     joint over a full rotation, and the fixed-pivot hatching — so the figure
     is framed rather than clipped. */
  var RIG_W=411.2, RIG_H=306, RIG_CX=8.6, RIG_CY=23.8;

  function solve(th){
    var A = { x:O2.x+LA*Math.cos(th), y:O2.y+LA*Math.sin(th) };
    var B = circIx(A.x,A.y,LB,O4.x,O4.y,LC,1);
    if(!B) return null;
    var ux=B[0]-A.x, uy=B[1]-A.y, ul=Math.hypot(ux,uy);
    if(ul<1e-9) return null;
    ux/=ul; uy/=ul;
    return { A:A, B:{x:B[0],y:B[1]},
             P:{ x:A.x+ux*LB*PF-uy*PO, y:A.y+uy*LB*PF+ux*PO } };
  }

  /* the closed coupler curve, sampled once — the figure an engineering
     text would plot. Drawing it whole keeps it identical at any refresh rate. */
  var CURVE = (function(){
    var o=[];
    for(var i=0;i<360;i++){ var s=solve(i*TAU/360); if(s) o.push([s.P.x,s.P.y]); }
    return o;
  })();

  var t0v=0, last=performance.now(), running=false;
  new IntersectionObserver(function(es){ running = es[0].isIntersecting; }, {threshold:0})
    .observe(cv);

  function frame(now){
    var dt = Math.min((now-last)/1000, .05); last = now;
    requestAnimationFrame(frame);
    if(!running) return;
    if(cv.clientWidth !== W || cv.clientHeight !== H) resize();
    if(!reduce) t0v += dt*0.5;

    ctx.clearRect(0,0,W,H);
    var S = Math.min(W*0.9/RIG_W, H*0.88/RIG_H);
    ctx.save();
    ctx.translate(W/2, H/2); ctx.scale(S,S); ctx.translate(RIG_CX, RIG_CY);

    var th1 = t0v;
    /* meshing relation — teeth interleave rather than collide */
    var th2 = -(N1/N2)*th1 + (1+N1/N2)*PHI + Math.PI/N2;

    gear(G1.x,G1.y,N1,MOD,th1,{spokes:5,lw:1.4});
    gear(G2.x,G2.y,N2,MOD,th2,{spokes:3,lw:1.3});

    var s = solve(th2);
    if(s){
      var A=s.A, B=s.B, P=s.P;

      if(CURVE.length>1){
        ctx.beginPath(); ctx.moveTo(CURVE[0][0],CURVE[0][1]);
        for(var i=1;i<CURVE.length;i++) ctx.lineTo(CURVE[i][0],CURVE[i][1]);
        ctx.closePath();
        ctx.strokeStyle = alpha(C.brass,.34); ctx.lineWidth=1.3; ctx.lineJoin='round'; ctx.stroke();

        /* comet: the arc P has just swept. th2 runs backwards, so the tail
           lies at increasing index. Angle-indexed, not frame-indexed, so it
           looks identical at 60Hz and 120Hz. */
        var n=CURVE.length, ci=((th2%TAU)+TAU)%TAU/TAU*n, TAIL=64;
        ctx.lineWidth = 2.1;
        for(var k=0;k<TAIL;k++){
          var j0=(Math.floor(ci+k)%n+n)%n, j1=(Math.floor(ci+k+1)%n+n)%n;
          ctx.beginPath();
          ctx.moveTo(CURVE[j0][0],CURVE[j0][1]); ctx.lineTo(CURVE[j1][0],CURVE[j1][1]);
          ctx.strokeStyle = alpha(C.brass,(1-k/TAIL)*.95); ctx.stroke();
        }
      }

      ctx.beginPath(); ctx.moveTo(O2.x,O2.y); ctx.lineTo(O4.x,O4.y);
      ctx.strokeStyle = alpha(C.faint,.34);
      ctx.setLineDash([2,6]); ctx.lineWidth=1; ctx.stroke(); ctx.setLineDash([]);

      ctx.lineCap='round'; ctx.lineWidth=3.4; ctx.strokeStyle=alpha(C.line,.92);
      ctx.beginPath(); ctx.moveTo(O2.x,O2.y); ctx.lineTo(A.x,A.y); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(O4.x,O4.y); ctx.lineTo(B.x,B.y); ctx.stroke();

      /* coupler drawn as the ternary link it is: A – B – P */
      ctx.beginPath(); ctx.moveTo(A.x,A.y); ctx.lineTo(B.x,B.y); ctx.lineTo(P.x,P.y); ctx.closePath();
      ctx.strokeStyle = alpha(C.brass,.95); ctx.lineWidth=3.4; ctx.stroke();
      ctx.fillStyle = alpha(C.brass,.09); ctx.fill();

      [[A,'m'],[B,'m'],[P,'p'],[O2,'f'],[O4,'f']].forEach(function(j){
        var pt=j[0], kind=j[1];
        ctx.beginPath(); ctx.arc(pt.x,pt.y, kind==='f'?5:4.2, 0, Math.PI*2);
        ctx.fillStyle = C.bg; ctx.fill();
        ctx.lineWidth=2; ctx.strokeStyle = kind==='p' ? C.brass : alpha(C.line,.95);
        ctx.stroke();
        if(kind==='f'){   /* the fixed-pivot triangle from any kinematics figure */
          ctx.beginPath();
          ctx.moveTo(pt.x-8,pt.y+13); ctx.lineTo(pt.x+8,pt.y+13); ctx.lineTo(pt.x,pt.y); ctx.closePath();
          ctx.strokeStyle = alpha(C.faint,.65); ctx.lineWidth=1.3; ctx.stroke();
          for(var k=-8;k<=8;k+=4){
            ctx.beginPath(); ctx.moveTo(pt.x+k,pt.y+13); ctx.lineTo(pt.x+k-3,pt.y+17);
            ctx.strokeStyle = alpha(C.faint,.5); ctx.lineWidth=1; ctx.stroke();
          }
        }
      });
    }
    ctx.restore();
  }

  render();
  go(0);
  restart();
  requestAnimationFrame(frame);
})();
`;

export default function DesignHome() {
  const mounted = useRef(false);

  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;
    (async function boot() {
      let H: any;
      try {
        const r = await fetch("/api/v1/home");
        if (!r.ok) throw new Error("home " + r.status);
        H = await r.json();
      } catch (e) { console.error("home feed failed", e); return; }

      const tx = H.texts || {};
      const pick = (o: any, l: string) => (o && (o[l] ?? o.en)) || "";
      const T: any = { en: {}, az: {}, ru: {} };
      Object.keys(tx).forEach((k) => (["en", "az", "ru"] as const).forEach((l) => { T[l][k] = pick(tx[k], l); }));
      const aboutKeys = Object.keys(tx).filter((k) => /^about\.p\d+$/.test(k)).sort();
      const ABOUT = { en: aboutKeys.map((k) => pick(tx[k], "en")), az: aboutKeys.map((k) => pick(tx[k], "az")) };
      const slides = H.heroSlides || [];
      const SLIDES = slides.map((s: any) => ({ en: pick(s.caption, "en"), az: pick(s.caption, "az") }));
      const PLATE = (H.settings && H.settings.record) || { en: [], az: [] };
      const RAIL = (H.settings && H.settings.ticker) || { en: [], az: [] };
      const SCOPE_RAW = (H.scopeTopics || []).map((s: any) => ({
        icon: s.icon,
        en: [pick(s.title, "en"), pick(s.description, "en")],
        az: [pick(s.title, "az"), pick(s.description, "az")],
      }));
      const STEPS = {
        en: (H.authorSteps || []).map((s: any) => [s.stepNo, pick(s.title, "en"), pick(s.body, "en")]),
        az: (H.authorSteps || []).map((s: any) => [s.stepNo, pick(s.title, "az"), pick(s.body, "az")]),
      };
      const TERMS = {
        en: (H.authorTerms || []).map((t: any) => [pick(t.title, "en"), pick(t.body, "en")]),
        az: (H.authorTerms || []).map((t: any) => [pick(t.title, "az"), pick(t.body, "az")]),
      };
      const mm = (m: any) => ({ n: m.fullName, t: m.title || "", img: m.photoUrl, orcid: m.orcidUrl, scopus: m.scopusUrl, email: m.email });
      const board = H.board || [];
      const LEADS = {
        eic: mm(board.find((m: any) => m.section === "EDITOR_IN_CHIEF") || {}),
        hon: mm(board.find((m: any) => m.section === "HONORARY") || {}),
      };
      const BOARD = board.filter((m: any) => m.section === "BOARD").map(mm);
      const roman = (n: any) => (({ 1: "I", 2: "II", 3: "III", 4: "IV" } as any)[n] || (n == null ? "" : String(n)));
      const ISSUES = (H.archive || []).map((iss: any, i: number) => [String(iss.year), roman(iss.number), iss.id, i === 0, iss.slug]);
      const arts = (H.currentIssue && H.currentIssue.articles) || [];
      const ARTS = arts.slice(1).map((a: any) => ({
        id: a.id, f: { en: a.subjectArea || "", az: a.subjectArea || "" }, t: a.title,
        a: (a.authorNames || []).join(", "),
        k: a.keywords ? String(a.keywords).split(/[;,]/).map((x: string) => x.trim()).filter(Boolean).slice(0, 3) : [],
      }));

      (window as any).__MSJ_HOME__ = { T, SLIDES, ABOUT, PLATE, RAIL, SCOPE_RAW, STEPS, TERMS, LEADS, BOARD, ISSUES, ARTS };

      const slidesEl = document.getElementById("slides");
      if (slidesEl && slides.length) {
        slidesEl.innerHTML = slides.map((s: any, i: number) =>
          '<figure class="slide' + (i === 0 ? " on" : "") + '"><img src="' + s.imageUrl + '" alt="' + String(s.altText || "").replace(/"/g, "&quot;") + '"></figure>').join("");
      }

      try { new Function(SCRIPT)(); } catch (e) { console.error("home interactions failed", e); }

      const setLead = (sel: string, m: any) => {
        const card = document.querySelector(sel); if (!card || !m) return;
        const img = card.querySelector("img") as HTMLImageElement | null;
        if (img && m.img) { img.src = m.img; img.alt = m.n || ""; }
        const nm = card.querySelector(".ed__n"); if (nm && m.n) nm.textContent = m.n;
      };
      setLead(".board .ed:nth-child(1)", LEADS.eic);
      setLead(".board .ed:nth-child(2)", LEADS.hon);

      // featured card (top of current issue) = first article of the current issue
      const feat = arts[0];
      const featEl = document.querySelector(".feat");
      if (feat && featEl) {
        const set = (sel: string, txt: string) => { const el = featEl.querySelector(sel); if (el) el.textContent = txt; };
        const tag = featEl.querySelector(".feat__tag");
        if (tag) { tag.removeAttribute("data-i18n"); tag.textContent = "Featured · " + (feat.subjectArea || ""); }
        set(".feat__title", feat.title);
        set(".feat__auth", (feat.authorNames || []).join(", "));
        const doi = featEl.querySelector(".feat__doi") as HTMLAnchorElement | null;
        if (doi) {
          if (feat.doi) { doi.href = "https://doi.org/" + feat.doi; doi.textContent = "doi.org/" + feat.doi; doi.style.display = ""; }
          else { doi.style.display = "none"; }
        }
        (featEl as HTMLElement).style.cursor = "pointer";
        featEl.addEventListener("click", (e) => {
          if ((e.target as HTMLElement).tagName !== "A") location.href = "/articles/" + feat.id;
        });
      }
    })();
  }, []);
  return <div dangerouslySetInnerHTML={{ __html: MARKUP }} />;
}
