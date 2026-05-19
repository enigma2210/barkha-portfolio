// src/data/articles.js
// COMPLETE VERBATIM CONTENT — scraped from barkhamanral.in May 2026

export const ARTS = {

  dpdp: {
    id: 'dpdp',
    cat: 'DPDP — Digital Policy',
    title: "India's DPDP Act — A Ticking Clock for Indian Businesses",
    date: 'April 26, 2026',
    excerpt: "May 13, 2027, is closer than it looks. And are most Indian businesses ready? The DPDP Act finally has teeth — here's what that means for every organisation that touches Indian user data.",
    body: `
      <p>It's May 14, 2027. Your company experienced a data breach three weeks ago that exposed customer names, phone numbers, and payment details. Your team patched the vulnerability, changed a few passwords, and sent an internal email saying "handled."</p>

      <p>Nobody told the Data Protection Board. Nobody notified the affected customers. There was no formal incident response. This is an internal email, and I hope no one noticed.</p>

      <p>The Data Protection Board noticed. And now you're looking at a penalty notice for ₹250 crore, for failing to implement reasonable security safeguards. Another ₹200 crore for not reporting the breach. All because a law that's been on the horizon for years finally has teeth, and your organization wasn't ready when it bit. This isn't a hypothetical designed to scare you. It's the exact scenario the DPDP Act was designed to address. And May 13, 2027, is the date those consequences switch on.</p>

      <h2>The Clock Is Already Running</h2>

      <p>India's Digital Personal Data Protection Act was passed in August 2023. The operational rules were notified in November 2025. That notification started an 18-month countdown to full enforcement.</p>

      <p>We are inside that window right now. May 13, 2027, is the date on which every substantive obligation under the Act becomes simultaneously enforceable: Consent mechanisms, Privacy notices, Breach reporting systems, Data retention policies, User rights, and Children's data protection – all of it, at once, with no grace period after the deadline.</p>

      <p>Here's the part most businesses haven't properly absorbed: the 18-month window wasn't meant for waiting; it was meant for building. The period from November 2025 to May 2027 is intended to be spent creating the systems, controls, contracts, and governance structures that compliance actually requires.</p>

      <p>Most enterprises we speak with are treating May 2027 as a start date. That's exactly the backward direction.</p>

      <h2>Who does this apply to? Almost Everyone</h2>

      <p>Before some readers convince themselves this doesn't apply to them, let's be clear about scope. The DPDP Act applies to any organization, regardless of size or sector, that processes the digital personal data of individuals in India. Personal data is broadly defined as Names, Phone numbers, Email addresses, IP addresses, Device identifiers, Financial data, Health information, Behavioral data, and Cookies.</p>

      <p>If you run an e-commerce platform, a fintech app, a healthcare service, an HR system, a SaaS product, a logistics operation, or an edtech platform, you're in scope. If you're a B2B company that stores client contacts in a CRM, you're in scope. If you're a startup with a few thousand users, you're in scope. And here's what catches international businesses off guard: the Act has extraterritorial reach. If you're a company headquartered outside India but offering goods or services to Indian users, the law applies to you too, just like its friend in the European region, GDPR. The DPDP Act follows the data, not the geography of whoever holds it. The honest question isn't "does this apply to us?" For most businesses, it does. The question is what you're required to do about it, and whether you've started.</p>

      <h2>What the Law Actually Requires</h2>

      <p>A lot of DPDP "compliance" being done right now is surface-level. A revised privacy policy, A new cookie banner, A legal team sign-off, that's not compliance, that's theatre. It will fail the first real audit. Here's what the Act actually requires, in plain terms.</p>

      <p><strong>1) 'Consent means something.'</strong> The DPDP Act doesn't accept the kind of consent most Indian businesses currently collect, such as bundled consent (a single checkbox covering multiple purposes), which is invalid. Each processing purpose needs its own specific, informed, unambiguous consent. If you collect data for personalization, analytics, and marketing, that's three separate consents. If you haven't redesigned your consent flows yet, this alone is a significant piece of work.</p>

      <p><strong>2) Privacy notices that are actually readable.</strong> Notices must be standalone documents, separate from your terms and conditions, written in plain language, available in English and regional languages, clearly explaining what data you collect, why you collect it, and what rights the user has. Most current privacy policies don't meet this bar.</p>

      <p><strong>3) A 72-hour breach clock.</strong> When a data breach occurs, you have 72 hours to notify the Data Protection Board. Neither to investigate nor to decide whether it's serious enough to report or to notify. That requires an incident response process capable of identifying, assessing, and escalating a breach within hours, not days, not the exact Indian Stretechable Time zone activity. Most Indian organizations lack a tested incident response plan.</p>

      <p><strong>4) Real infrastructure for user rights.</strong> Individuals can request to see their data, correct it, or have it deleted. They can nominate someone else to exercise those rights on their behalf. You need a process to receive these requests, verify the person, fulfill the request across every internal system that holds their data, and complete the whole thing within 90 days. Building that end-to-end capability is harder than it sounds, especially when data lives across a product database, a CRM, a support system, and three SaaS tools.</p>

      <p><strong>5) Vendor contracts that reflect the new reality.</strong> Every third party that processes personal data on your behalf, like cloud providers, analytics tools, payment processors, support platforms, must now carry compliance obligations. Most contracts signed before 2025 don't include the security clauses required by the DPDP Act. That means reviewing and renegotiating contracts. Not a handful, every processor in your chain.</p>

      <p><strong>6) A named grievance officer.</strong> A contact point, whether a person or team, must be publicly listed on your website or app before May 2027. Complaints from users must be addressed. This sounds simple. It requires a working complaints process behind it to mean anything.</p>

      <h2>The Penalties And Why the Fine Might Not Be the Worst Part</h2>

      <p>Let's look at the numbers, because they matter when we talk about Business.</p>

      <ul>
        <li><strong>₹250 crore,</strong> for failing to implement reasonable security safeguards</li>
        <li><strong>₹200 crore,</strong> for failing to notify the Board or affected individuals of a breach</li>
        <li><strong>₹150 crore,</strong> for violations involving children's data</li>
        <li><strong>₹50 crore,</strong> for other breaches of Data Fiduciary obligations</li>
      </ul>

      <p>These are per-violation figures. A single data breach incident can trigger multiple violations simultaneously, inadequate security, failure to notify individuals, and failure to notify the Board. Cumulative exposure from one incident can exceed ₹650 crore.</p>

      <p>But here's the thing most people miss when they focus on the fines: the Data Protection Board has the authority to order a halt on data processing while an investigation is underway. For a bank, for a payments platform, for any business where data processing isn't a supporting function, it's the product (a sigh of relief or tension that again it is the government aristocracy under the veil of democracy). An operational suspension isn't a fine you can absorb. It's a threat to the business itself.</p>

      <p>The fine you can budget for. The suspension you can't always survive.</p>

      <h2>Why "We'll Sort It Before the Deadline" Doesn't Work</h2>

      <p>The organizations that implemented GDPR know exactly how this plays out. The timeline that looks comfortable eighteen months out compresses dramatically once the actual work begins. Data mapping alone, going system by system to understand what personal data you hold, where it lives, who touches it, and why, takes weeks, not days. And you can't build compliant consent flows, privacy notices, or user rights infrastructure without it. Everything downstream depends on it. Then come the vendor reviews, then the technical implementation of consent management, security hardening, breach notification protocols, then the user rights infrastructure, then testing, validation, staff training, and much more, just a complete PDCA cycle (Plan-Do-Check-Act).</p>

      <p>Each of these is a project. They can run in parallel — but they can't all start in March 2027. Organizations that begin serious implementation work after mid-2026 will be operating under severe time compression. Some won't make it.</p>

      <p>The correct starting point is not a revised privacy policy. It involves appointing a compliance owner with actual authority, mapping your data, assessing your gaps against the specific obligations that apply to your business, and beginning structured implementation in that order.</p>

      <h2>The Opportunity Nobody Talks About</h2>

      <p>Here's the thing about the DPDP Act that doesn't get said enough. It's not just a compliance burden, it's an opportunity to do something your customers will actually notice and value: give them genuine control and transparency over their own data.</p>

      <p>The businesses that approach this honestly, building systems that actually work rather than ones that look compliant enough to pass an audit, will emerge from this with something real and more trust. Better data hygiene. Stronger processes. A privacy posture that holds up as regulation tightens globally, because India won't be the last place to legislate on this.</p>

      <p>Those treating it as a box to tick will find themselves scrambling when enforcement begins. And scrambling is expensive, or we can say far more expensive than building it right the first time.</p>

      <h2>Where Does Your Organization Stand?</h2>

      <p>Some honest questions worth answering, not for anyone else, just for yourself:</p>

      <ul>
        <li>Do you know exactly what personal data your organization holds, where it lives, and why you have it?</li>
        <li>Have your consent flows been redesigned for DPDP, separate, specific, purpose-by-purpose consent?</li>
        <li>Do you have an incident response process capable of moving at 72-hour speed?</li>
        <li>Have your vendor contracts been reviewed against DPDP requirements?</li>
        <li>Is there a named person in your organization with the authority and budget to get this done?</li>
      </ul>

      <p>If the answers are unclear, that's your signal. Not to panic, but to start. The deadline is fixed, the work is substantial, and the window is narrowing by the day.</p>

      <p>May 13, 2027, is not a target date. It's a cutoff. <em>The businesses that will be fine on May 14, 2027, are those that started in 2026, not those that haven't even started the scope.</em></p>
    `
  },

  nist: {
    id: 'nist',
    cat: 'Cybersecurity — DNS Security',
    title: 'NIST Just Updated Its DNS Security Guide After 12 Years',
    date: 'March 27, 2026',
    excerpt: "The US NIST has published SP 800-81r3 — the first major federal DNS security update in over 12 years. For cybersecurity practitioners and Internet governance advocates, this is a significant moment.",
    body: `
      <p>Think of the Domain Name System (DNS) — or a domain like iiro.in on which the DNS system works — as the Internet's phone book. Every time you type a website address, DNS quietly translates it into the actual numbers that computers use to find each other. It happens in milliseconds, billions of times a day. Most people never think about it. And for a long time, neither might did policymakers.</p>

      <p>That's finally changing.</p>

      <p>The US National Institute of Standards and Technology (NIST) has published SP 800-81r3, its revised <em>Secure Domain Name System Deployment Guide</em> — the first major federal update in this area in over 12 years, replacing guidance that dates back to 2013. For anyone working in cybersecurity, network management, or Internet governance, this is a significant moment.</p>

      <h2>DNS Is No Longer Just a Utility</h2>

      <p>For most of its history, DNS was treated like plumbing, essential but invisible. You secured your firewalls, your endpoints, your applications. DNS just sat there, doing its job.</p>

      <p>The new guide makes a clear argument: DNS is no longer just an operational necessity, rather it's a critical component of an enterprise's overall security posture. If DNS goes down or gets manipulated, everything built on top of it — whether it is email, applications, internal networks — collapses with it.</p>

      <p>The revised document is structured around three core pillars: using <strong>DNS as a proactive security control</strong>, <strong>strengthening the DNS protocol itself</strong>, and <strong>securing the infrastructure that supports DNS services</strong>.</p>

      <h2>The Big Idea: "Protective DNS"</h2>

      <p>The headline concept in SP 800-81r3 is <strong>Protective DNS</strong>, and it's a meaningful shift in thinking.</p>

      <p>The updated guide places significant emphasis on protective DNS, describing it as DNS services enhanced with security capabilities that can analyze queries and responses and take action against threats. In plain terms: instead of just resolving domain names, your DNS service can now actively block malicious sites, filter harmful content, and generate logs that help security teams trace exactly what happened during a breach.</p>

      <p>Because DNS queries precede network communication streams, enforcing policy at the DNS level prevents malicious or suspicious communication streams from starting at all, making it one of the most efficient places to stop threats before they reach users or systems.</p>

      <h2>Encrypted DNS Is Now the Expectation</h2>

      <p>Another major update is around <strong>encrypted DNS</strong>. Most DNS traffic today travels in plain text, meaning anyone watching the network can see what sites you're trying to visit. The new guide addresses this directly.</p>

      <p>The guidance covers three protocols: DNS over TLS (DoT), DNS over HTTPS (DoH), and DNS over QUIC (DoQ) — all of which encrypt communication between clients and DNS resolvers. For US federal civilian agencies, encrypted DNS is now required wherever technically supported.</p>

      <p>This matters for India too. As Indian government agencies and enterprises modernize their infrastructure, encrypted DNS is becoming a global baseline expectation.</p>

      <h2>DNSSEC Gets a Modern Refresh</h2>

      <p>The guide also updates recommendations for <strong>DNSSEC</strong>, the system that digitally signs DNS records to prevent tampering. It favours ECDSA and Edwards-curve algorithms over older RSA-based ones, since smaller key sizes keep DNS responses efficient. It also recommends keeping signing key validity periods short, around five to seven days, to limit exposure if a key is ever compromised.</p>

      <h2>Why This Matters for India</h2>

      <p>India has the world's second-largest Internet user base, and DNS infrastructure sits at the heart of every connection those users make. NIST notes that disruptions or attacks targeting DNS can affect an entire organisation and at a national scale, the implications are even larger.</p>

      <p>For Indian enterprises, government networks, and Internet service providers, this update is a clear signal: DNS security can no longer be an afterthought. It deserves dedicated infrastructure, active monitoring, and a seat at the policy table.</p>

      <div class="art-callout">
        📄 <strong>Read the full guide:</strong> NIST SP 800-81r3 — available at doi.org/10.6028/NIST.SP.800-81r3
      </div>

      <p>Share your thoughts on DNS governance with us. Let's discuss at <strong>info@iiro.in</strong>, or send your perspectives for publication as an article at <strong>articles@iiro.in</strong>.</p>
    `
  },

  'ai-summit': {
    id: 'ai-summit',
    cat: 'AI Governance — Policy',
    title: 'AI Impact Summit: A Governance Perspective',
    date: 'February 22, 2026',
    excerpt: "Last week at the India AI Impact Summit 2026 in New Delhi — 88 countries, USD 250 billion in pledges, and a New Delhi Declaration that raises as many questions as it answers.",
    body: `
      <p>Last week, attended the <strong>India AI Impact Summit 2026</strong> in <strong>New Delhi.</strong> The Summit brought together policymakers, industry leaders, startups, researchers, civil society members, and international delegates from over <strong>88 countries</strong> to discuss the present and future of artificial intelligence on a global stage. For someone invested in <strong>Internet governance</strong>, digital public policy, equitable access, and multistakeholder governance, being there was both exhilarating and sobering.</p>

      <h3>1. Scale and Public Engagement were massive</h3>

      <p>From the moment you entered the summit expo and conference spaces, the energy was unmistakable. The exhibition halls were packed with people exploring AI innovations, from tool demos and startup showcases to products meant to scale AI applications across sectors. Government ministries, global tech firms, and academic institutions all had a presence. It was clear that both domestic and international participants took the Summit seriously. Official figures indicate that the event saw more than 5 lakh visitors, and the government highlighted that this reflected strong local engagement alongside global participation. However, sheer size also had its impacts. At times, the crowds made meaningful participation in discussions difficult, long queues, packed pavilions, and tight walking routes meant that many sessions felt more like networking marathons than deep policy conversations.</p>

      <h2>2. A Summit Focused on Economic Narratives, With Governance in the Margins</h2>

      <p>One of the most striking patterns of the week was how often <strong>economic narratives and investment optics dominated the discourse:</strong></p>

      <ul>
        <li>Organisers highlighted that infrastructure-related investment commitments crossed <strong>USD 250 billion</strong>, alongside deep tech and venture capital pledges.</li>
        <li>Governments and corporations emphasised trade, innovation partnerships, AI industrial ecosystems, and scaling of AI products.</li>
      </ul>

      <p>While economic significance is not inherently at odds with good governance, the emphasis on <em>market outcomes</em> often overshadows conversations about <strong>norms, rights, accountability, and structural governance design</strong>, areas central to Internet governance work.</p>

      <h3>3. The New Delhi Declaration: Aspirational, Voluntary, and Soft on Enforcement</h3>

      <p>A major official outcome was the <strong>New Delhi Declaration on AI Impact</strong>, endorsed by <strong>88 countries and international organisations</strong> — a record number for this summit series. The Declaration stresses themes like:</p>

      <ul>
        <li><strong>Democratising AI resources</strong> and expanding access.</li>
        <li><strong>Human capital development and workforce readiness.</strong></li>
        <li><strong>AI for economic and social good.</strong></li>
        <li><strong>Democratically guided, inclusive AI ecosystems.</strong></li>
      </ul>

      <p>It also proposes voluntary platforms and frameworks, such as a <em>Charter for Democratic Diffusion of AI</em>, <em>Global AI Impact Commons</em>, and <em>Trusted AI Commons</em>, designed to encourage collaboration. But, as many Internet governance practitioners have noted, the commitments in the Declaration are <strong>non-binding and cooperative rather than regulatory</strong>. This creates a tension between the <em>vision of equitable, shared AI governance</em> and the reality of <em>soft, principle-based outcomes</em>.</p>

      <p>From an Internet governance perspective, meaningful influence on global AI norms requires <em>mechanisms for accountability, interoperability standards, and enforceable frameworks</em>, not just broad principles. With voluntary commitments, there's little to ensure that priorities such as fairness, privacy, and rights protection are implemented consistently, especially in less-regulated environments.</p>

      <h3>4. Sovereignty, Inclusion, and the Global South Narrative</h3>

      <p>One of the historic aspects of the Summit was its hosting <strong>in the Global South</strong>, marking a symbolic shift in the geography of global AI dialogues. This brought air to discussions of <em>sovereignty</em>, the idea that nations should have autonomy in shaping how AI technologies impact their societies, and <em>inclusion</em>, meaning that AI should serve a broad cross-section of populations, languages, and contexts.</p>

      <p>Yet there were underlying tensions:</p>

      <ul>
        <li>Balancing <em>sovereignty</em> with global cooperation isn't straightforward, especially when AI governance standards are emerging mostly from a few powerful tech hubs.</li>
        <li>The Summit's framing of inclusion often emphasised <em>access and scale</em> rather than <em>rights and redress mechanisms</em>.</li>
      </ul>

      <p>Good governance frameworks are not just about scale or access, they're about <strong>who gets to shape the rules, who is heard in decision-making processes, and how power imbalances are addressed</strong>. These remained under-articulated in the official narrative.</p>

      <h2>5. My Takeaways — What This Means for Internet Governance Work</h2>

      <p>Being there made three things especially clear:</p>

      <p><strong>1. Attention is shifting, but governance must catch up.</strong></p>
      <p>Global interest in AI is undeniable. Investment, collaboration, and innovation narratives will continue to grow. But if governance does not keep pace, we risk letting <em>technological markets drive policy agendas</em> rather than <em>policy priorities shaping technological futures</em>.</p>

      <p><strong>2. Non-binding commitments only go so far.</strong></p>
      <p>From an Internet governance standpoint, we need frameworks that move beyond aspirational principles to <em>accountability mechanisms, standards, and enforceable norms</em>. Voluntary multistakeholder agreements are only the first step.</p>

      <p><strong>3. The Global South and Majority World must lead the conversation, not follow it.</strong></p>
      <p>Hosting the Summit here signals a shift in geography, but influence comes from <em>how governance architectures are shaped, who is seated at the table, and whose priorities become operationalised</em>. This is the conversation that must broaden and deepen beyond one week of headlines. The India AI Impact Summit was a remarkable gathering of historic significance, marking a chapter in addressing people's concerns about emerging technologies.</p>

      <p>The challenge now, for India, for Internet governance communities, and for global digital policy practitioners, is to translate <em>momentum into meaningful governance outcomes</em> that ensure AI serves <em>people, rights, societies, and democratic values</em>.</p>
    `
  },

  backbone: {
    id: 'backbone',
    cat: 'Gender Equity — International',
    title: '2026: The Year We Stop Overlooking the Backbone',
    date: 'January 2, 2026',
    excerpt: "2026 is the UN-proclaimed International Year of the Woman Farmer. Women produce 60–80% of the world's food yet own less than 15% of agricultural land. This is not a gesture — it's a call to action.",
    body: `
      <p>In the regions of <strong>South Asia, sub-Saharan Africa, Latin America, and the Pacific islands,</strong> women go out before dawn with earth on their hands and hope within their hearts. It is not only a source of motivation but long-overdue validation to observe the earth-giving, life-sustaining, resilient women at such a significant moment. That's why the year 2026 is a momentous one, marking the United Nations-proclaimed International Year of the Woman Farmer. It is not a gesture but a call to action.</p>

      <h2>Honouring the Unsung Heroes</h2>

      <p>This year is not about applauding tradition, but about finally recognising women for what they are: essential drivers of global food systems and rural prosperity. Many regions of the world have women producing between 60% and 80% of the food, yet owning less than 15% of the agricultural land, a stark imbalance between contributions and control.</p>

      <p>And this isn't because of aptitude; it's because of systemic exclusion. Women are consistently excluded from access to credit, technology, secure markets, quality seeds, mechanized tools, extension services, and fair pricing. But even when they farm land as large as men's farms, the productivity statistics show an actual 24% gap due to unequal opportunities, not a lack of skill.</p>

      <p>This year, we celebrate them not only as caregivers or helpers but as economic architects building food security and rural stability in the most challenging situations.</p>

      <h2>The Unpaid Work That Sustains Us All</h2>

      <p>However, aside from the fields, women's contributions through their work are embedded in the fabric of life. The estimated value of unpaid care work, such as childcare, caregiving for older people, housework, and the production of subsistence food, is $10.8 trillion annually worldwide. This is not charity, this is infrastructure. It's the unseen framework behind schools, clinics, workplaces, and economies.</p>

      <h2>Empowerment Is an Economic Engine</h2>

      <p>It is high time that empowering women stops being perceived as '<strong>a social good</strong>' and becomes '<strong>an economic necessity</strong>.' Closing the gender gap in agriculture alone could:</p>

      <ul>
        <li>Add <strong>$10 billion to the gross national product annually</strong>.</li>
        <li>Increase <strong>global GDP by as much as $1 trillion</strong></li>
        <li>Reducing <strong>the number of people who are hungry by tens of millions</strong></li>
        <li>Improve <strong>productivity and resilience in food systems</strong></li>
      </ul>

      <p>All the above can be achieved by strategically investing in female farmers, tearing down structural barriers. When women are assured of their land tenure rights, access to finance, property ownership, and a voice in decision-making, they can reinvest up to 90% of the funds that benefit their families and communities.</p>

      <h2>From Inspiration to Action</h2>

      <p>2026 is not a year of mere appreciation; it is a year of transformation. The UN and FAO are pushing for policy shifts, increased investment, legal reforms, and community partnerships to dismantle the inequalities that have undervalued women's contributions.</p>

      <p>That is a call that resonates across all sectors — technology, finance, business, climate resilience, and beyond — because the barriers are rooted within the same systems, whether in the rural village or the corporate boardroom.</p>

      <p>A seat at every decision-making table is what real empowerment should look like. The harvest is ready. It is high time that we let the people who grew it actually own it, not just in metaphor, but in law, capital, and opportunity.</p>
    `
  },

  igf: {
    id: 'igf',
    cat: 'Internet Governance',
    title: 'Why Internet Governance Matters?',
    date: 'November 21, 2025',
    excerpt: "The Internet is less a magic cloud and more a living system that needs careful tending. The rules behind it quietly shape what you can say, how your data is used, and whether a region gets cut off by a national firewall.",
    body: `
      <p>I used to think the Internet was just a place to search, scroll, and binge something that "just works." Then I started meeting people who actually build and protect the thing, and I realised the Internet is less a magic cloud and more a living system that needs careful tending. The rules, decisions, and institutions behind that tend to be what we call Internet governance, and they quietly shape how our lives look online: what we can say, how our data is used, whether a small business can sell to the world, or a whole region gets cut off by a national firewall. Internet governance is not a faraway policy club; it's the scaffolding behind every link you click.</p>

      <p>Think about the simple things: domain names (the addresses you type), IP addresses (the numbers machines use to find each other), and the protocols that let your phone talk to a website. These things don't manage themselves, organisations coordinate them so your blog loads, your payments go through, and your messages arrive. ICANN, for example, coordinates those unique identifiers and helps keep more than a billion websites reachable for roughly 5.8 billion Internet users worldwide — that's not a small administrative detail, it's the difference between an Internet that works for everyone and a fractured set of national networks.</p>

      <p>When governance stumbles or the wrong people get the loudest voice, the consequences are immediate and visible. "Splinternet" is not just a trendy phrase, it's a real risk where different countries end up with their own closed-off internets. If that happens, the web ceases to be a global commons. It becomes a patchwork of walled gardens: one Internet for big-tech-dominated markets, another for heavily regulated states, and a host of isolated networks in between. This fragmentation isn't hypothetical; research and debates in global forums document the trend and warn of its costs for trade, learning, and civic life.</p>

      <p>Security is another place where governance shows its teeth. The web is attacked every day, from phishing and ransomware to nation-state operations. The economic cost is staggering: researchers and industry trackers have projected global cybercrime losses to reach eye-watering sums (a commonly cited projection pegs it at around $10.5 trillion annually by 2025), and governments and companies regularly report rising losses and fraud volumes. Those are not abstract numbers; they translate to blocked transactions, stolen savings, disrupted hospitals, and silenced activists. Governance matters because it is how countries, technical experts, and companies agree on standards, incident response, and norms to reduce harm. For instance, international groups that recommended norms against using cyberspace to cause large-scale civilian harm have pushed the conversation toward restraint and accountability.</p>

      <p>Rights and inclusion are political but also deeply personal. The Internet should be a place to learn, to organize, to make money, to meet people — but those opportunities evaporate when narrow interests capture governance. When only corporations and powerful states shape the rules, privacy gets eroded, surveillance increases, and marginalised voices get drowned out. That's why multistakeholder spaces, where civil society, technical experts, governments, businesses, and youth groups come together, matter. They're imperfect and messy, but they keep decision-making from becoming a closed playbook that benefits the already powerful. UNESCO and other global institutions frame the Internet as a public resource with the potential to build inclusive knowledge societies, which is a nice way of saying: <strong>the Internet is too important to be left to the highest bidder.</strong></p>

      <p>There are practical, everyday examples that make all this obvious. Look at debates over encryption: when a government asks platforms for message traceability, the security community warns that weakening end-to-end encryption would make millions of users — and critical systems — less safe. Look at the Cambridge Analytica scandal: a single instance of data misuse shook public trust and prompted governments to enact privacy protections. Look at national bans and restrictions on apps and platforms: they show how data-flow rules and national security claims can suddenly change which services you can use. These are governance battles, and they decide whether the Internet is an engine of opportunity or a tool for control.</p>

      <p>At the same time, governance is the mechanism that keeps innovation alive. The Internet grew because it was open: anyone could build, try, fail, and scale. Standard-setting groups, technical communities, and open protocols make that possible. But as tech like AI, biometric ID, and large-scale data analytics advance, society needs guardrails: not to stop progress but to steer it so that benefits are shared and harms minimised. Good governance tries to strike that balance — it gives startups a chance to compete while preventing unchecked monopoly power and predatory practices that stamp out newcomer innovation.</p>

      <p>If you're wondering where you fit in, you can be at the table. Internet governance isn't a closed thing reserved for ministers or a small set of engineers. The whole model is supposed to be multistakeholder — that includes youth networks, community groups, NGOs, researchers, and everyday users. Forums like the Internet Governance Forum (IGF), regional IGFs, ICANN meetings, et cetera exist precisely so more voices can shape rules that affect them. Suppose you're passionate about digital rights, access, women's safety online, or fair data practices. In that case, those are real places to make a difference.</p>

      <p>We also need to be honest about the complex parts. Governance legitimacy is a moving target: who decides which voices matter? Enforcement across borders is messy because laws are national while networks are global. Technology evolves faster than policy, meaning norms are always catching up, and marginalised communities remain underrepresented in international fora. These are solvable problems, but they require persistent engagement rather than periodic outrage when a scandal breaks.</p>

      <p>At the end of the day, Internet governance is not about control for its own sake, it's about coordination and protection. It's about making sure that the infrastructure that lets a student in a small town attend an online class, a small business sell to new markets, or an activist safely document human rights abuses, keeps working. It's about setting norms so a state or an attacker can't simply switch off large parts of the web or weaponise it without consequences. It's about protecting rights while enabling innovation.</p>

      <p>So why should you care? <strong>Because the future of the Internet will be shaped by whoever shows up: if users don't participate, corporations and states will fill the space and write the rules.</strong> If people like us do not show up, through local advocacy, by joining civil-society delegations, by following and contributing to public consultations, the Internet can remain open, secure, and fair. It's not glamorous work, and it rarely trends on social media. Still, it's the kind of slow, steady action that decides whether the Internet serves everyone or just the loudest and wealthiest. The choice is not inevitable, it will be decided in rooms, on mailing lists, in meetings, and in courts. If you want the Internet to be a public resource that helps people, not a closed marketplace or a surveillance grid, start caring about governance now.</p>
    `
  },

  influencers: {
    id: 'influencers',
    cat: 'Regulation — Digital Policy',
    title: 'Should India Regulate Influencers the Chinese Way?',
    date: 'October 30, 2025',
    excerpt: "China now requires influencers in finance, medicine, and law to show formal credentials. Should India consider a similar tiered approach — protecting citizens without extinguishing diverse grassroots voices?",
    body: `
      <p>Should India's DPDP Law Ask Influencers for Credentials? A Question Worth Asking and put your time into, because the Internet Era we are living in and everybody now-a-days on social media is influencing in some way, so how can we protect us or restrict them if in case they are spreading misinformation.</p>

      <h3>What China Did</h3>

      <p>China introduced sweeping rules for online influencers. Those who provide advice in fields such as finance, medicine, law, or education must now show formal qualifications (a professional licence, a degree, or certification) before hosting content on platforms. Platforms must verify credentials and tag AI-generated content, with penalties for violations.</p>

      <p>That move has its defenders — they argue it will tame misinformation, protect vulnerable citizens, and stop amateurs from posing as experts. And it has its critics — they warn of stifling speech, of excluding voices grounded in lived experience rather than formal certification, of creating gatekeepers of knowledge.</p>

      <h3>India's Digital Landscape: Familiar, Yet Different</h3>

      <p>In India, the DPDP law centres on how personal data is collected, processed, and protected — how consent is handled, how platforms are held accountable, and how user privacy is safeguarded. What it <em>doesn't</em> do is ask: "Who is allowed to <em>speak</em> on social media when it comes to advice?"</p>

      <p>We already have regulations on advertising and endorsements (via the Advertising Standards Council of India and consumer protection laws). Still, no law requires that an influencer with a million followers discussing investment strategies hold a chartered accountant's licence, or that a "wellness guru" discussing treatment options have a medical degree.</p>

      <h3>Why This Matters — Especially in India</h3>

      <p>India is uniquely positioned as a vast, multilingual, multicultural digital environment. Many voices offering advice come from informal expertise, community networks, regional languages, and lived experience rather than Ivy League credentials. That's a strength — it's inclusive, diverse, rooted in context. But it's also a vulnerability. Been there: a viral post promising a miracle cure, a "hot tip" on investment gone wrong. The potential for real harm is there.</p>

      <p>So we're faced with a dilemma: how to <em>protect</em> citizens from harmful advice without extinguishing the spark of diverse voices that make India's digital discourse rich?</p>

      <h3>A Middle Path for India</h3>

      <p>Rather than a blanket credential-requirement like China's, India might consider a <em>tiered approach:</em></p>

      <ul>
        <li>Influencers who <em>explicitly claim "professional expertise"</em> in regulated fields (medicine, legal, financial advice) are required they <strong>display or link to verified credentials</strong> (license, certification) or clearly state they are <em>not certified</em>.</li>
        <li>Require stronger, clearer disclosures when content is <strong>paid-for, AI-generated, or high-risk</strong> (e.g., "This is for information only", "Not certified advice").</li>
        <li>Increase platform responsibility: when content is potentially harmful, the platform should enable flagging and swift removal of misleading advice.</li>
        <li>Use sectoral regulators — for example, SEBI for investment advice, FSSAI for nutrition claims, and RBI for financial advice.</li>
      </ul>

      <h3>The Take-Away</h3>

      <p>We must ask ourselves: What kind of Internet do we want? One where <em>only officially credentials-bearing voices</em> are heard? Or one where <em>diverse voices</em> can speak, but with transparency, accountability, and user awareness?</p>

      <p>India has the chance to learn from China's experiment and also to chart its own path, one respectful of constitutional freedoms, grounded in our pluralism, yet rigorous enough to protect people from digital harm. If we tighten credentials, we risk excluding grassroots voices. If we do nothing, we risk letting misinformation flourish unchecked.</p>

      <div class="art-callout">
        <strong>A Thought to Leave You With</strong><br/>
        India's challenge isn't just to prevent misinformation — it's to <strong>protect digital expression without diluting its diversity</strong>. The DPDP Act offers a foundation for digital trust. Still, as we enter an age where social media shapes real-world decisions, we must ask: <strong>"Should the Internet reward only the 'qualified,' or can wisdom still come from experience, storytelling, and community voices?"</strong>
      </div>
    `
  },

  pit: {
    id: 'pit',
    cat: 'Tech Policy — Public Interest',
    title: '"Is Public Interest Technology Just a Buzzword?"',
    date: 'October 22, 2025',
    excerpt: "Can technology designed for profit also truly serve inclusion and equity? A question about public interest technology, business models, and what it means to build for everyone — not just the highest bidder.",
    body: `
      <p>How can inclusive design be effectively integrated into a business strategy, rather than remaining a side project? What role must policy, public procurement, regulation, and community engagement play so that inclusion is viable, not optional? How do technologists, designers, business leaders, and policymakers align so that public interest and profit aren't at odds but intertwined?</p>

      <p>I was introduced to terms like <em>Internet governance</em> four years ago. Since then, one new word after another has surfaced in the tech-policy space. When I came across the phrase <strong>public interest technology</strong>, I found myself pausing: <em>How exactly does this connect to what we often see around us? And in a world where almost everything is built around making a profit, can this idea really find a place?</em></p>

      <p><strong>Public interest technology</strong> refers to the study and application of technology expertise to advance the public interest — to generate benefits for society and promote the public good. It doesn't mean simply building the "next app" for the mass market, but asking: <em>Who</em> is this technology for? <em>What</em> impact does it have beyond revenue? <em>How</em> are communities being engaged so that the technology doesn't inadvertently exclude or harm?</p>

      <p>When I say <strong>"inclusion and equity"</strong> in this context, I do <em>not</em> mean only gender or rural-versus-urban divides (though both matter). I'm talking about a broader idea: technology designed and governed so that anyone, regardless of income, language, disability, digital-skill level, location, or other circumstance, has the capacity and opportunity to engage, benefit from, and not be left behind. For example: accessibility for persons with disabilities, multilingual interfaces, low-bandwidth versions of apps, and inclusive design that anticipates users with low digital literacy. These dimensions matter because the barriers to participation in tech are many and intersecting.</p>

      <p>From one perspective, the appeal is compelling. Imagine designing a digital service with accessibility built in, community-driven features, fairness in algorithms, and transparency in how data is used. When implemented effectively, technology can expand access to essential services (such as education and healthcare), empower historically marginalized groups, and help reduce inequality. Technology becomes not just a tool for commerce, but a tool for inclusion and justice.</p>

      <p>Yet from another view, the feasibility question looms large. Many tech firms, investors, and start-ups operate under business models that expect <strong>scale</strong>, <strong>monetisation</strong>, <strong>rapid growth</strong>, <strong>and market competition</strong>. Designing for inclusion or public interest often involves additional costs, a slower rollout, more engagement with user communities, localization, and more careful governance. The incentives may not align: underserved populations may be more complex to serve, with less immediate profit potential; inclusive design may not be rewarded in the same way as a feature that boosts user numbers or ad revenue. There are also measurement problems — how do you capture "fairness", "access", "dignity" as business metrics? Without strong alignment of incentives, inclusive features risk being sidelined.</p>

      <p>So where do these two paths meet? Where does the promise of public interest technology sit in a profit-driven world? One possibility is when value is redefined: if inclusive design becomes a source of new markets (for example, by reaching underserved users), if social license, trust, and reduced risk become integral to the business strategy. Another is when business models become hybrid, combining private sector, public funding, and philanthropic support. Additionally, when regulations, procurement policies, or public-sector contracts demand or reward inclusive features, they thereby shift incentives. Or when the ecosystem builds the infrastructure, norms, and tools, inclusive design becomes less costly, easier, and standardized.</p>

      <p>When I think of my context (India and the Global South), the stakes become quite concrete. The digital divide is real. Multilingual diversity, rural-urban gaps, access issues — these are not abstract. Suppose technology is designed with inclusion in mind. In that case, huge populations can be brought into digital services, and new users can be accessed. However, the pressures of cost, scalability, and profit motive remain simultaneously. The question becomes: <em>How can inclusive design be effectively integrated into a business strategy, rather than remaining a side project? What role must policy, public procurement, regulation, and community engagement play so that inclusion is viable, not optional? How do technologists, designers, business leaders, and policymakers align so that public interest and profit aren't at odds but intertwined?</em></p>

      <p>In what ways can we expect technology companies to embed public interest values when the ecosystem rewards speed, scale, and monetisation? Conversely, what does a truly public-interest-oriented technology initiative look like when it must survive and sustain itself in a market economy? Perhaps the intersection lies not in choosing one side over the other, but in asking how the structures around technology — business models, funding mechanisms, regulation, community participation — need to shift so that public interest becomes part of the equation rather than an afterthought.</p>

      <p>I'm not claiming I have the answer. But I believe this is one of the questions we must keep alive: <em>Can technology designed for profit also truly serve inclusion and equity — and if so, under what conditions?</em></p>
    `
  },

};
