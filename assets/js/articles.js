/* --- ARTICLES --- */
const ARTS = {
  dpdp: {
    id:'dpdp', cat:'DPDP — Digital Policy', tag:'Data Protection',
    title:"India's DPDP Act — A Ticking Clock for Indian Businesses",
    date:'April 26, 2026',
    body:`<p>It's May 14, 2027. Your company experienced a data breach three weeks ago that exposed customer names, phone numbers, and payment details. Your team patched the vulnerability, changed a few passwords, and sent an internal email saying "handled."</p>
<p>Nobody told the Data Protection Board. Nobody notified the affected customers. There was no formal incident response.</p>
<p>The Data Protection Board noticed. And now you're looking at a penalty notice for <strong>₹250 crore</strong>, for failing to implement reasonable security safeguards. Another <strong>₹200 crore</strong> for not reporting the breach. All because a law that's been on the horizon for years finally has teeth, and your organization wasn't ready when it bit.</p>
<p>This isn't a hypothetical designed to scare you. It's the exact scenario the DPDP Act was designed to address. And <strong>May 13, 2027</strong>, is the date those consequences switch on.</p>
<h2>The Clock Is Already Running</h2>
<p>India's Digital Personal Data Protection Act was passed in August 2023. The operational rules were notified in November 2025. That notification started an 18-month countdown to full enforcement. We are inside that window right now.</p>
<p>May 13, 2027, is the date on which every substantive obligation under the Act becomes simultaneously enforceable: Consent mechanisms, Privacy notices, Breach reporting systems, Data retention policies, User rights, and Children's data protection — all of it, at once, with no grace period after the deadline.</p>
<div class="art-callout">Here's the part most businesses haven't properly absorbed: the 18-month window wasn't meant for waiting; it was meant for building. Most enterprises are treating May 2027 as a start date. That's exactly the backward direction.</div>
<h2>Who Does This Apply To? Almost Everyone</h2>
<p>The DPDP Act applies to any organization, regardless of size or sector, that processes the digital personal data of individuals in India. Personal data is broadly defined: Names, Phone numbers, Email addresses, IP addresses, Device identifiers, Financial data, Health information, Behavioral data, Cookies.</p>
<p>If you run an e-commerce platform, fintech app, healthcare service, HR system, SaaS product, logistics operation, or edtech platform, you're in scope. And here's what catches international businesses off guard: the Act has <strong>extraterritorial reach</strong>. If you're a company headquartered outside India but offering goods or services to Indian users, the law applies to you too — just like GDPR. The DPDP Act follows the data, not the geography.</p>
<h2>What the Law Actually Requires</h2>
<p>A lot of DPDP "compliance" being done right now is surface-level — a revised privacy policy, a new cookie banner, a legal team sign-off. That's not compliance, that's theatre. It will fail the first real audit.</p>
<div class="highlight-box"><strong>1. Consent Means Something</strong>The DPDP Act doesn't accept bundled consent (a single checkbox covering multiple purposes). Each processing purpose needs its own specific, informed, unambiguous consent. If you collect data for personalization, analytics, and marketing — that's three separate consents.</div>
<div class="highlight-box"><strong>2. A 72-Hour Breach Clock</strong>When a data breach occurs, you have 72 hours to notify the Data Protection Board. Not to investigate — to notify. That requires an incident response process capable of identifying, assessing, and escalating a breach within hours.</div>
<div class="highlight-box"><strong>3. Real Infrastructure for User Rights</strong>Individuals can request to see their data, correct it, or have it deleted. You need a process to receive requests, verify the person, fulfill the request across every internal system, and complete the whole thing within 90 days.</div>
<div class="highlight-box"><strong>4. Vendor Contracts That Reflect the New Reality</strong>Every third party that processes personal data on your behalf must now carry compliance obligations. Most contracts signed before 2025 don't include the security clauses required by the DPDP Act. That means reviewing and renegotiating — not a handful, every processor in your chain.</div>
<h2>The Penalties — And Why the Fine Might Not Be the Worst Part</h2>
<ul>
<li><strong>₹250 crore</strong> — for failing to implement reasonable security safeguards</li>
<li><strong>₹200 crore</strong> — for failing to notify the Board or affected individuals of a breach</li>
<li><strong>₹150 crore</strong> — for violations involving children's data</li>
<li><strong>₹50 crore</strong> — for other breaches of Data Fiduciary obligations</li>
</ul>
<p>These are per-violation figures. A single data breach incident can trigger multiple violations simultaneously. Cumulative exposure from one incident can exceed <strong>₹650 crore</strong>.</p>
<p>But here's what most people miss when they focus on fines: the Data Protection Board has the authority to <strong>order a halt on data processing</strong> while an investigation is underway. For a payments platform, for any business where data processing is the product — an operational suspension isn't a fine you can absorb. It's a threat to the business itself.</p>
<h2>The Opportunity Nobody Talks About</h2>
<p>Here's the thing about the DPDP Act that doesn't get said enough. It's not just a compliance burden — it's an opportunity to give customers genuine control and transparency over their own data.</p>
<p>The businesses that approach this honestly — building systems that actually work rather than ones that look compliant enough to pass an audit — will emerge with something real: better data hygiene, stronger processes, and a privacy posture that holds up as regulation tightens globally.</p>
<div class="art-callout"><strong>May 13, 2027, is not a target date. It's a cutoff.</strong> The businesses that will be fine on May 14, 2027, are those that started in 2026 — not those that haven't even begun.</div>`
  },
  nist: {
    id:'nist', cat:'Cybersecurity — DNS Security', tag:'DNS Policy',
    title:'NIST Just Updated Its DNS Security Guide After 12 Years',
    date:'March 27, 2026',
    body:`<p>Think of the Domain Name System (DNS) — or a domain like <strong>iiro.in</strong> — as the Internet's phone book. Every time you type a website address, DNS quietly translates it into the actual numbers that computers use to find each other. It happens in milliseconds, billions of times a day. Most people never think about it. And for a long time, neither did policymakers.</p>
<p>That's finally changing.</p>
<p>The US <strong>National Institute of Standards and Technology (NIST)</strong> has published SP 800-81r3, its revised <em>Secure Domain Name System Deployment Guide</em> — the first major federal update in this area in over 12 years, replacing guidance that dates back to 2013. For anyone working in cybersecurity, network management, or Internet governance, this is a significant moment.</p>
<h2>DNS Is No Longer Just a Utility</h2>
<p>For most of its history, DNS was treated like plumbing — essential but invisible. You secured your firewalls, your endpoints, your applications. DNS just sat there, doing its job.</p>
<p>The new guide makes a clear argument: <strong>DNS is no longer just an operational necessity — it's a critical component of an enterprise's overall security posture.</strong> If DNS goes down or gets manipulated, everything built on top of it — email, applications, internal networks — collapses with it.</p>
<p>The revised document is structured around three core pillars: using <strong>DNS as a proactive security control</strong>, <strong>strengthening the DNS protocol itself</strong>, and <strong>securing the infrastructure that supports DNS services</strong>.</p>
<h2>The Big Idea: "Protective DNS"</h2>
<p>The headline concept in SP 800-81r3 is <strong>Protective DNS</strong> — and it's a meaningful shift in thinking. The updated guide describes it as DNS services enhanced with security capabilities that can analyze queries and responses and take action against threats.</p>
<p>In plain terms: instead of just resolving domain names, your DNS service can now actively block malicious sites, filter harmful content, and generate logs that help security teams trace exactly what happened during a breach.</p>
<div class="art-callout">Because DNS queries precede network communication streams, enforcing policy at the DNS level prevents malicious communication from starting at all — making it one of the most efficient places to stop threats before they reach users or systems.</div>
<h2>Encrypted DNS Is Now the Expectation</h2>
<p>Most DNS traffic today travels in plain text — meaning anyone watching the network can see what sites you're trying to visit. The new guide addresses this directly, covering three protocols:</p>
<ul>
<li><strong>DNS over TLS (DoT)</strong></li>
<li><strong>DNS over HTTPS (DoH)</strong></li>
<li><strong>DNS over QUIC (DoQ)</strong></li>
</ul>
<p>All of these encrypt communication between clients and DNS resolvers. For US federal civilian agencies, encrypted DNS is now <strong>required</strong> wherever technically supported. This matters for India too — as Indian government agencies and enterprises modernize their infrastructure, encrypted DNS is becoming a global baseline expectation.</p>
<h2>DNSSEC Gets a Modern Refresh</h2>
<p>The guide updates recommendations for <strong>DNSSEC</strong> — the system that digitally signs DNS records to prevent tampering. It favours ECDSA and Edwards-curve algorithms over older RSA-based ones, since smaller key sizes keep DNS responses efficient. It also recommends keeping signing key validity periods short — around <strong>five to seven days</strong> — to limit exposure if a key is ever compromised.</p>
<h2>Why This Matters for India</h2>
<p>India has the world's second-largest Internet user base, and DNS infrastructure sits at the heart of every connection those users make. NIST notes that disruptions or attacks targeting DNS can affect an entire organisation — and at a national scale, the implications are even larger.</p>
<p>For Indian enterprises, government networks, and Internet service providers, this update is a clear signal: <strong>DNS security can no longer be an afterthought</strong>. It deserves dedicated infrastructure, active monitoring, and a seat at the policy table.</p>
<div class="art-callout">Read the full guide: NIST SP 800-81r3 — doi.org/10.6028/NIST.SP.800-81r3 — Share your thoughts: info@iiro.in</div>`
  },
  'ai-summit': {
    id:'ai-summit', cat:'AI Governance — Policy', tag:'AI Policy',
    title:'AI Impact Summit: A Governance Perspective',
    date:'February 22, 2026',
    body:`<p>Last week, attended the <strong>India AI Impact Summit 2026</strong> in New Delhi. The Summit brought together policymakers, industry leaders, startups, researchers, civil society members, and international delegates from over <strong>88 countries</strong> to discuss the present and future of artificial intelligence on a global stage. For someone invested in Internet governance, digital public policy, equitable access, and multistakeholder governance, being there was both exhilarating and sobering.</p>
<h2>1. Scale and Public Engagement Were Massive</h2>
<p>From the moment you entered the summit expo and conference spaces, the energy was unmistakable. The exhibition halls were packed with people exploring AI innovations — from tool demos and startup showcases to products meant to scale AI applications across sectors. Government ministries, global tech firms, and academic institutions all had a presence.</p>
<p>Official figures indicate that the event saw more than <strong>5 lakh visitors</strong>. However, sheer size also had its impacts. At times, the crowds made meaningful participation in discussions difficult — long queues, packed pavilions, and tight walking routes meant that many sessions felt more like networking marathons than deep policy conversations.</p>
<h2>2. Economic Narratives, With Governance in the Margins</h2>
<p>One of the most striking patterns of the week was how often <strong>economic narratives and investment optics dominated the discourse</strong>. Organisers highlighted that infrastructure-related investment commitments crossed <strong>USD 250 billion</strong>. Governments and corporations emphasised trade, innovation partnerships, AI industrial ecosystems, and scaling of AI products.</p>
<p>While economic significance is not inherently at odds with good governance, the emphasis on market outcomes often overshadows conversations about <strong>norms, rights, accountability, and structural governance design</strong> — areas central to Internet governance work.</p>
<h2>3. The New Delhi Declaration: Aspirational, Voluntary, Soft on Enforcement</h2>
<p>A major official outcome was the <strong>New Delhi Declaration on AI Impact</strong>, endorsed by 88 countries and international organisations — a record number for this summit series. The Declaration stresses: democratising AI resources, human capital development, AI for economic and social good, and democratically guided, inclusive AI ecosystems.</p>
<p>But, as many Internet governance practitioners have noted, the commitments are <strong>non-binding and cooperative rather than regulatory</strong>. From an Internet governance perspective, meaningful influence on global AI norms requires mechanisms for accountability, interoperability standards, and enforceable frameworks — not just broad principles.</p>
<h2>4. Sovereignty, Inclusion, and the Global South</h2>
<p>One historic aspect of the Summit was its hosting <strong>in the Global South</strong>, marking a symbolic shift in the geography of global AI dialogues. This brought discussions of <em>sovereignty</em> — nations having autonomy in shaping AI's societal impact — and <em>inclusion</em> — AI serving a broad cross-section of populations, languages, and contexts.</p>
<p>Good governance frameworks are not just about scale or access — they're about <strong>who gets to shape the rules, who is heard in decision-making, and how power imbalances are addressed</strong>. These remained under-articulated in the official narrative.</p>
<h2>5. My Takeaways</h2>
<p><strong>1. Attention is shifting, but governance must catch up.</strong> If governance does not keep pace, we risk letting technological markets drive policy agendas rather than policy priorities shaping technological futures.</p>
<p><strong>2. Non-binding commitments only go so far.</strong> We need frameworks that move beyond aspirational principles to accountability mechanisms, standards, and enforceable norms.</p>
<p><strong>3. The Global South must lead the conversation, not follow it.</strong> Hosting the Summit here signals a shift in geography — but influence comes from how governance architectures are shaped and whose priorities become operationalised.</p>
<div class="art-callout">The challenge now — for India, for Internet governance communities, and for global digital policy practitioners — is to translate <em>momentum into meaningful governance outcomes</em> that ensure AI serves people, rights, societies, and democratic values.</div>`
  },
  backbone: {
    id:'backbone', cat:'Gender Equity — International', tag:'Women Empowerment',
    title:'2026: The Year We Stop Overlooking the Backbone',
    date:'January 2, 2026',
    body:`<p>In the regions of <strong>South Asia, sub-Saharan Africa, Latin America, and the Pacific islands</strong>, women go out before dawn with earth on their hands and hope within their hearts. That's why the year 2026 is a momentous one, marking the <strong>United Nations-proclaimed International Year of the Woman Farmer</strong>. It is not a gesture — it is a call to action.</p>
<h2>Honouring the Unsung Heroes</h2>
<p>This year is not about applauding tradition, but about finally recognising women for what they are: essential drivers of global food systems and rural prosperity. <strong>Many regions of the world have women producing between 60% and 80% of the food, yet owning less than 15% of the agricultural land</strong> — a stark imbalance between contributions and control.</p>
<p>And this isn't because of aptitude; it's because of systemic exclusion. Women are consistently excluded from access to credit, technology, secure markets, quality seeds, mechanized tools, extension services, and fair pricing. The productivity statistics show an actual <strong>24% gap due to unequal opportunities</strong> — not a lack of skill.</p>
<p>This year, we celebrate them not only as caregivers or helpers but as <strong>economic architects</strong> building food security and rural stability in the most challenging situations.</p>
<h2>The Unpaid Work That Sustains Us All</h2>
<p>Aside from the fields, women's contributions through their work are embedded in the fabric of life. <strong>The estimated value of unpaid care work — childcare, caregiving for older people, housework, and subsistence food production — is $10.8 trillion annually worldwide</strong>. This is not charity; this is infrastructure. It's the unseen framework behind schools, clinics, workplaces, and economies.</p>
<h2>Empowerment Is an Economic Engine</h2>
<p>It is high time that empowering women stops being perceived as "a social good" and becomes "an economic necessity." Closing the gender gap in agriculture alone could:</p>
<ul>
<li>Add <strong>$10 billion to the gross national product annually</strong></li>
<li>Increase <strong>global GDP by as much as $1 trillion</strong></li>
<li>Reduce <strong>the number of people who are hungry by tens of millions</strong></li>
<li>Improve <strong>productivity and resilience in food systems</strong></li>
</ul>
<p>When women are assured of their land tenure rights, access to finance, property ownership, and a voice in decision-making, they can reinvest up to <strong>90% of the funds</strong> that benefit their families and communities.</p>
<h2>From Inspiration to Action</h2>
<p>2026 is not a year of mere appreciation; it is a year of transformation. The UN and FAO are pushing for policy shifts, increased investment, legal reforms, and community partnerships to dismantle the inequalities that have undervalued women's contributions.</p>
<div class="art-callout">A seat at every decision-making table is what real empowerment should look like. The harvest is ready. It is high time that we let the people who grew it actually own it — not just in metaphor, but in law, capital, and opportunity.</div>`
  },
  igf: {
    id:'igf', cat:'Internet Governance', tag:'IG Policy',
    title:'Why Internet Governance Matters?',
    date:'November 21, 2025',
    body:`<p>I used to think the Internet was just a place to search, scroll, and binge — something that "just works." Then I started meeting people who actually build and protect the thing, and I realised the Internet is less a magic cloud and more a <strong>living system that needs careful tending</strong>.</p>
<p>The rules, decisions, and institutions behind that tending are what we call <strong>Internet governance</strong> — and they quietly shape how our lives look online: what we can say, how our data is used, whether a small business can sell to the world, or a whole region gets cut off by a national firewall. Internet governance is not a faraway policy club; it's the scaffolding behind every link you click.</p>
<h2>The Basics That Run Your Digital Life</h2>
<p>Think about domain names (the addresses you type), IP addresses (the numbers machines use to find each other), and the protocols that let your phone talk to a website. These things don't manage themselves — organisations coordinate them so your blog loads, your payments go through, and your messages arrive.</p>
<p>ICANN, for example, coordinates those unique identifiers and helps keep more than a billion websites reachable for roughly <strong>5.8 billion Internet users</strong> worldwide. That's the difference between an Internet that works for everyone and a fractured set of national networks.</p>
<h2>When Governance Fails: The Splinternet Risk</h2>
<p>When governance stumbles or the wrong people get the loudest voice, the consequences are immediate and visible. "Splinternet" is not just a trendy phrase — it's a real risk where different countries end up with their own closed-off internets. If that happens, the web ceases to be a global commons. It becomes a patchwork of walled gardens: one Internet for big-tech-dominated markets, another for heavily regulated states, and a host of isolated networks in between.</p>
<h2>The Security Stakes</h2>
<p>The web is attacked every day, from phishing and ransomware to nation-state operations. Global cybercrime losses are projected at around <strong>$10.5 trillion annually by 2025</strong>. Those are not abstract numbers — they translate to blocked transactions, stolen savings, disrupted hospitals, and silenced activists. Governance matters because it's how countries, technical experts, and companies agree on standards, incident response, and norms to reduce harm.</p>
<h2>Rights, Inclusion, and Why They're Not Optional</h2>
<p>The Internet should be a place to learn, to organize, to make money, to meet people — but those opportunities evaporate when narrow interests capture governance. When only corporations and powerful states shape the rules, privacy gets eroded, surveillance increases, and marginalised voices get drowned out.</p>
<p>That's why multistakeholder spaces — where civil society, technical experts, governments, businesses, and youth groups come together — matter. They're imperfect and messy, but they keep decision-making from becoming a closed playbook that benefits the already powerful.</p>
<h2>Where You Fit In</h2>
<p>Internet governance isn't closed to ministers or engineers. The whole model is supposed to be <strong>multistakeholder</strong> — that includes youth networks, community groups, NGOs, researchers, and everyday users. Forums like the Internet Governance Forum (IGF), regional IGFs, and ICANN meetings exist precisely so more voices can shape rules that affect them.</p>
<div class="art-callout"><strong>Because the future of the Internet will be shaped by whoever shows up.</strong> If users don't participate, corporations and states will fill the space and write the rules. The choice is not inevitable — it will be decided in rooms, on mailing lists, in meetings, and in courts. If you want the Internet to be a public resource that helps people, start caring about governance now.</div>`
  },
  influencers: {
    id:'influencers', cat:'Regulation — Digital Policy', tag:'Content Policy',
    title:'Should India Regulate Influencers the Chinese Way?',
    date:'October 30, 2025',
    body:`<p>Should India's DPDP Law Ask Influencers for Credentials? A question worth asking — because in the Internet era we live in, everybody on social media is influencing in some way. So how can we protect ourselves or restrict them if they're spreading misinformation?</p>
<h2>What China Did</h2>
<p>China introduced sweeping rules for online influencers. Those who provide advice in fields such as finance, medicine, law, or education must now show formal qualifications — a professional licence, a degree, or certification — before hosting content on platforms. Platforms must verify credentials and tag AI-generated content, with penalties for violations.</p>
<p>That move has its defenders — they argue it will tame misinformation, protect vulnerable citizens, and stop amateurs from posing as experts. And it has its critics — they warn of stifling speech, of excluding voices grounded in lived experience rather than formal certification, of creating gatekeepers of knowledge.</p>
<h2>India's Digital Landscape: Familiar, Yet Different</h2>
<p>In India, the DPDP law centres on how personal data is collected, processed, and protected. What it <em>doesn't</em> do is ask: "Who is allowed to <em>speak</em> on social media when it comes to advice?"</p>
<p>We already have regulations on advertising and endorsements via the Advertising Standards Council of India. Still, no law requires that an influencer with a million followers discussing investment strategies hold a chartered accountant's licence, or that a "wellness guru" discussing treatment options have a medical degree.</p>
<h2>Why This Matters — Especially in India</h2>
<p>India is uniquely positioned as a vast, multilingual, multicultural digital environment. Many voices offering advice come from informal expertise, community networks, regional languages, and lived experience — not Ivy League credentials. That's a strength. But it's also a vulnerability — a viral post promising a miracle cure, a "hot tip" on investment gone wrong. The potential for real harm is there.</p>
<h2>A Middle Path for India</h2>
<p>Rather than a blanket credential-requirement like China's, India might consider a <em>tiered approach</em>:</p>
<ul>
<li>Influencers who explicitly claim "professional expertise" in regulated fields must <strong>display or link to verified credentials</strong>, or clearly state they are <em>not certified</em>.</li>
<li>Require stronger disclosures when content is <strong>paid-for, AI-generated, or high-risk</strong> — "This is for information only", "Not certified advice".</li>
<li>Increase platform responsibility: when content is potentially harmful, the platform must enable flagging and swift removal.</li>
<li>Use sectoral regulators — SEBI for investment advice, FSSAI for nutrition claims, RBI for financial advice.</li>
</ul>
<div class="art-callout">India's challenge isn't just to prevent misinformation — it's to <strong>protect digital expression without diluting its diversity</strong>. The DPDP Act offers a foundation for digital trust. As we enter an age where social media shapes real-world decisions, we must ask: should the Internet reward only the "qualified," or can wisdom still come from experience, storytelling, and community voices?</div>`
  },
  pit: {
    id:'pit', cat:'Tech Policy — Public Interest', tag:'Inclusion',
    title:'"Is Public Interest Technology Just a Buzzword?"',
    date:'October 22, 2025',
    body:`<p>How can inclusive design be effectively integrated into a business strategy, rather than remaining a side project? What role must policy, public procurement, regulation, and community engagement play so that inclusion is viable, not optional? How do technologists, designers, business leaders, and policymakers align so that public interest and profit aren't at odds but intertwined?</p>
<p>I was introduced to terms like <em>Internet governance</em> four years ago. Since then, one new word after another has surfaced in the tech-policy space. When I came across the phrase <strong>public interest technology</strong>, I found myself pausing: <em>How exactly does this connect to what we often see around us? And in a world where almost everything is built around making a profit, can this idea really find a place?</em></p>
<h2>What Public Interest Technology Actually Means</h2>
<p><strong>Public interest technology</strong> refers to the study and application of technology expertise to advance the public interest — to generate benefits for society and promote the public good. It doesn't mean simply building the "next app" for the mass market, but asking: <em>Who</em> is this technology for? <em>What</em> impact does it have beyond revenue? <em>How</em> are communities being engaged so that the technology doesn't inadvertently exclude or harm?</p>
<h2>What "Inclusion and Equity" Really Means</h2>
<p>When I say <strong>"inclusion and equity"</strong> in this context, I mean technology designed and governed so that anyone — regardless of income, language, disability, digital-skill level, location, or other circumstance — has the capacity and opportunity to engage, benefit from, and not be left behind.</p>
<p>For example: accessibility for persons with disabilities, multilingual interfaces, low-bandwidth versions of apps, and inclusive design that anticipates users with low digital literacy. The barriers to participation in tech are many and intersecting.</p>
<h2>The Appeal — and the Feasibility Gap</h2>
<p>From one perspective, the appeal is compelling. Imagine designing a digital service with accessibility built in, community-driven features, fairness in algorithms, and transparency in how data is used. Technology can expand access to essential services, empower historically marginalized groups, and help reduce inequality.</p>
<p>Yet from another view, the feasibility question looms large. Many tech firms and start-ups operate under business models that expect <strong>scale, monetisation, rapid growth, and market competition</strong>. Designing for inclusion involves additional costs, slower rollout, more engagement with user communities. The incentives may not align.</p>
<h2>Where Do These Paths Meet?</h2>
<p>When I think of my context — India and the Global South — the stakes become concrete. The digital divide is real. Multilingual diversity, rural-urban gaps, access issues — these are not abstract. If technology is designed with inclusion in mind, huge populations can be brought into digital services. But the pressures of cost, scalability, and profit motive remain.</p>
<div class="art-callout">I'm not claiming I have the answer. But I believe this is one of the questions we must keep alive: <em>Can technology designed for profit also truly serve inclusion and equity — and if so, under what conditions?</em> Perhaps the intersection lies not in choosing one side, but in asking how the structures around technology — business models, funding, regulation, community participation — need to shift so that public interest becomes part of the equation rather than an afterthought.</div>`
  }
};

/* --- ARTICLES --- */
function openArt(id) {
  prevPage = currentPage;
  currentArtId = id;
  const a = ARTS[id];
  if (!a) return;
  if (typeof resetRouteScroll === 'function') resetRouteScroll();
  document.getElementById('art-cat').textContent = a.cat;
  document.getElementById('art-title').textContent = a.title;
  document.getElementById('art-date').textContent = '— ' + a.date;
  document.getElementById('art-tag').textContent = a.tag;
  document.getElementById('art-body').innerHTML = a.body;
  renderArticleComments(id);
  // Switch to article page
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-article').classList.add('active');
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  currentPage = 'article';
  setTimeout(() => {
    if (window.Motion) Motion.refresh();
  }, 120);
}

function goBack() {
  go(prevPage || 'blogs');
}
